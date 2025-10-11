"use client";
import { fetcher } from "@/lib/fetcher";
import React, { use, useEffect } from "react";
import useSWR from "swr";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import FormBooking from "../../components/FormBooking";
import DetailRooms from "../../components/DetailRooms";

export interface RoomData {
  room: {
    id: string;
    roomNumber: string;
    floor: number;
    status: RoomStatus;
    images: Array<{ imageUrl: string }>;
    roomType: {
      name: string;
      description: string;
      basePrice: string;
      maxOccupancy: number;
      amenities: Array<{ amenity: { name: string } }>;
    };
  };
}

enum RoomStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  MAINTENANCE = "MAINTENANCE",
}

interface FormData {
  checkInDate: Date | null;
  checkOutDate: Date | null;
  totalGuests: number;
  bookingSource: string;
  specialRequests: string;
  totalAmount: number;
  discountId: number | null;
  pricePerNight: number;
  roomId: string;
}
export default function Page({
  params,
}: {
  params: Promise<{ id: string; roomId: string }>;
}) {
  const { roomId } = use(params);

  const { data, isLoading } = useSWR<RoomData>(
    `${process.env.NEXT_PUBLIC_URL_API}/api/room/${roomId}`,
    fetcher
  );

  useEffect(() => {
    if (data?.room.roomType.basePrice) {
      setFormData((prev) => ({
        ...prev,
        pricePerNight: Number(data.room.roomType.basePrice),
      }));
    }
  }, [data]);

  const [formData, setFormData] = React.useState<FormData>({
    checkInDate: null,
    checkOutDate: null,
    totalGuests: 1,
    specialRequests: "",
    bookingSource: "WEBSITE",
    totalAmount: 0,
    discountId: null,
    pricePerNight: 0,
    roomId: roomId,
  });

  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setFormData((prev) => ({
        ...prev,
        totalAmount: diffDays * Number(prev.pricePerNight),
      }));
    }
  }, [formData.checkInDate, formData.checkOutDate, formData.pricePerNight]);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-serif italic text-gray-600">
            Đang tải thông tin phòng...
          </p>
        </div>
      </div>
    );

  if (!data) return null;

  const { room } = data;

  return (
    <div className="container mx-auto  mt-0.5 ">
      <div className="bg-white  shadow-2xl overflow-hidden border border-gray-100">
        {/* Main Content */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-4 lg:p-12">
          {" "}
          <div className="lg:col-span-2">
            {" "}
            <DetailRooms room={room} />
          </div>
          {/* Booking Form */}
          <div className="lg:col-span-1">
            <FormBooking
              room={room}
              handleFormChange={handleFormChange}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
