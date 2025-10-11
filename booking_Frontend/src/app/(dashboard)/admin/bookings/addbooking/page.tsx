"use client";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import AdminBookingForm from "./components/AdminBookingForm";
import NewCustomerForm from "./components/newCustomerForm";

interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  status: string;
  roomType: { name: string; maxOccupancy: number; basePrice: string };
}
export interface BookingFormData {
  customerId: string;
  checkInDate: string;
  checkOutDate: string;
  totalGuests: number;
  bookingSource: "DIRECT";
  specialRequests: string;
  discountCode: string;
  pricePerNight: number;
  roomId: string;
}

const Page = () => {
  const [idNumber, setIdNumber] = useState("");
  const [formCustomer, setFormCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idNumber: "",
  });
  const [formData, setFormData] = useState<BookingFormData>({
    customerId: "",
    checkInDate: "",
    checkOutDate: "",
    totalGuests: 1,
    bookingSource: "DIRECT",
    specialRequests: "",
    discountCode: "",
    pricePerNight: 0,
    roomId: "",
  });

  const { data: customerData } = useSWR(
    idNumber ? `/api/auth/customer?search=${idNumber}&limit=20` : null,
    {
      dedupingInterval: 200,
    }
  );
  console.log(customerData);

  const { data: roomData, isLoading: isLoadingRoomData } =
    useSWR(`/api/room?limit=9999`);

  useEffect(() => {
    if (!idNumber) {
      setFormCustomer({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        idNumber: "",
      });
      setFormData((prev) => ({ ...prev, customerId: "" }));
      return;
    }

    // reset thông tin trước khi tìm
    setFormCustomer({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      idNumber,
    });
    setFormData((prev) => ({ ...prev, customerId: "" }));

    if (customerData?.customer?.length > 0) {
      const matchedCustomer = customerData.customer.find(
        (c: any) => c.customer?.idNumber === idNumber
      );

      if (matchedCustomer) {
        const { email, firstName, lastName, phone } = matchedCustomer;
        const customerId = matchedCustomer.customer.id;

        setFormData((prev) => ({ ...prev, customerId }));
        setFormCustomer({ email, firstName, lastName, phone, idNumber });
      }
    }
  }, [customerData, idNumber]);

  useEffect(() => {
    if (!formData.roomId || !roomData?.room) return;

    if (roomData > 0) {
      const room = roomData.room.find((r: Room) => r.id === formData.roomId);
      if (room) {
        const basePrice = parseFloat(room.roomType.basePrice);
        setFormData((prev) => ({
          ...prev,
          pricePerNight: basePrice,
        }));
      }
    }
  }, [formData.roomId, roomData, formData.checkInDate, formData.checkOutDate]);

  if (isLoadingRoomData) {
    return <div>đang tải ....</div>;
  }
  return (
    <div className="p-6 mx-auto bg-white border rounded-xl">
      <div className="flex items-center justify-between gap-5 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Booking</h1>
          <p className="text-gray-600 md:text-base text-sm md:text-center text-left">
            Điền thông tin để thêm booking mới
          </p>
        </div>
        <NewCustomerForm
          formCustomer={formCustomer}
          setFormCustomer={setFormCustomer}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nhập CCCD khách hàng
        </label>
        <Input
          type="text"
          placeholder="Nhập số CCCD"
          className="md:w-2/3 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
        />
      </div>

      {idNumber && formCustomer.firstName ? (
        <div className="bg-gray-100 p-4 rounded-lg mb-6 space-y-2">
          <p>
            <strong>Họ tên:</strong> {formCustomer.firstName}{" "}
            {formCustomer.lastName}
          </p>
          <p>
            <strong>Email:</strong> {formCustomer.email}
          </p>
          <p>
            <strong>Điện thoại:</strong> {formCustomer.phone}
          </p>
        </div>
      ) : idNumber ? (
        <div className="text-red-500 mb-6">Không tìm thấy khách hàng</div>
      ) : null}

      <AdminBookingForm
        formData={formData}
        roomData={roomData.room.data || []}
        setFormData={setFormData}
      />
    </div>
  );
};

export default Page;
