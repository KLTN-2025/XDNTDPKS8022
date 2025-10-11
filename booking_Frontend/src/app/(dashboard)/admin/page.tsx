"use client";

import React, { useEffect, useState, useMemo } from "react";
import CardStatistical from "../components/statistical/CardStatistical";
import RevenueTotalMonth from "../components/statistical/RevenueTotalMonth";
import CustomerBarChart from "../components/statistical/CustomerBarChart";
import BookingResourceChart from "../components/statistical/BookingResourceChart";
import axios from "axios";
import { URL_API } from "@/lib/fetcher";
import CalendarBooking from "../components/statistical/CalendaBooking";

interface RevenueDataType {
  months: string[];
  data: number[];
}

interface CustomerDatatype {
  months: string[];
  counts: number[];
}

const Page = () => {
  const emptyRevenueData: RevenueDataType = { months: [], data: [] };
  const emtypeCustomerData: CustomerDatatype = { months: [], counts: [] };
  const [revenueData, setRevenueData] =
    useState<RevenueDataType>(emptyRevenueData);
  const [customerData, setCustomerData] =
    useState<CustomerDatatype>(emtypeCustomerData);
  const [bookingResource, setBookingResource] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [resRevenue, resCustomer, resBooking] = await Promise.all([
        axios.get(`${URL_API}/api/dashboard/revenue-total-month`),
        axios.get(`${URL_API}/api/dashboard/customer-count-by-month`),
        axios.get(`${URL_API}/api/dashboard/revenue-online-offline`),
      ]);

      setRevenueData(resRevenue.data);
      setCustomerData(resCustomer.data.data);
      setBookingResource(resBooking.data.data);
    } catch (err: any) {
      console.error(err);
      setError("Có lỗi khi tải dữ liệu. Vui lòng kiểm tra API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formattedData = useMemo(() => {
    return (
      bookingResource?.map((item) => ({
        name: item.month,
        online: item.online,
        offline: item.offline,
      })) || []
    );
  }, [bookingResource]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CardStatistical />
      {/* lichj ddt phong */}
      <CalendarBooking />
      <h2 className="text-lg font-bold mt-4 mb-2">
        Biểu đồ doanh thu theo tháng và khách hàng
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-2 items-center">
        <RevenueTotalMonth data={revenueData || []} />
        <CustomerBarChart data={customerData || []} />
      </div>
      <h2 className="text-lg font-bold mt-4 mb-2">
        Biểu đồ doanh thu online/offline
      </h2>
      <BookingResourceChart data={formattedData || []} />
    </div>
  );
};

export default Page;
