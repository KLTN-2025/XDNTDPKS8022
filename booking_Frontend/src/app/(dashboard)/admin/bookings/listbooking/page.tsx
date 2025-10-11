"use client";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import useSWR from "swr";
import TableListBooking, { IBooking } from "./components/TableListBooking";
import FilterBooking from "./components/FilterBooking";

const API_URL = process.env.NEXT_PUBLIC_URL_API;

type Dates = {
  checkInDate: Date | null;
  checkOutDate: Date | null;
};

const BookingManagementForm = () => {
  const [isNumber, setIsNumber] = useState<number | string>("");
  const [status, setStatus] = useState<string>("");
  const [order, setOrder] = useState<"default" | "asc" | "desc">("default");
  const [dates, setDates] = useState<Dates>({
    checkInDate: null,
    checkOutDate: null,
  });
  const { data } = useSWR<{ bookings: IBooking[] }>(
    `${API_URL}/api/booking?idNumber=${isNumber}&status=${status}&checkInDate=${dates.checkInDate}&checkOutDate=${dates.checkOutDate}&totalAmount=${order}`
  );

  return (
    <div className="container mx-auto p-6 bg-white">
      <h2 className="text-3xl font-bold text-gray-800 ">Quản lý đặt phòng</h2>
      <div className="justify-center flex items-center">
        <FilterBooking
          dates={dates}
          setDates={setDates}
          isNumber={isNumber}
          setIsNumber={setIsNumber}
        />
      </div>

      {/* Bookings Table */}
      <TableListBooking
        booking={data?.bookings || []}
        selectedStatus={status}
        setSelectedStatus={setStatus}
        setOrder={setOrder}
        order={order}
      />
    </div>
  );
};

export default BookingManagementForm;
