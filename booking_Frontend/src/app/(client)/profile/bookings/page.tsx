"use client";
import { fetcher } from "@/lib/fetcher";
import React from "react";
import useSWR from "swr";
import BookingDetails from "../components/UserBooking";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Amenity {
  amenity: {
    id: string;
    name: string;
  };
}

interface RoomType {
  id: string;
  name: string;
  amenities: Amenity[];
}

interface Room {
  roomNumber: string;
  floor: number;
  roomType: RoomType;
  images: {
    id: string;
    imageUrl: string;
  }[];
}

interface BookingItem {
  id: string;
  room: Room;
  pricePerNight: string;
}

interface Payment {
  id: string;
  paymentMethod: string;
  status: string;
  amount: string;
  paymentDate: string;
}

interface Booking {
  id: string;
  bookingDate: string;
  checkInDate: string;
  checkOutDate: string;
  totalGuests: number;
  status: string;
  bookingSource: string;
  totalAmount: string;
  bookingItems: BookingItem[];
  payments: Payment[];
  discount: null | {
    code: string;
    percentage: number;
  };
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

const Page = () => {
  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_URL_API}/api/booking/bookingUser`,
    fetcher
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Swiper
        spaceBetween={30}
        effect={"fade"}
        pagination={{
          clickable: true,
        }}
        modules={[EffectFade, Navigation, Pagination]}
        className="mySwiper"
      >
        {data && data?.data?.length > 0 ? (
          <>
            {data?.data.map((item: Booking, index: number) => (
              <SwiperSlide key={index} className="">
                <BookingDetails booking={item} />
              </SwiperSlide>
            ))}
          </>
        ) : (
          <>
            <SwiperSlide className="mt-10">
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">hiện tại chưa có đơn đặt phòng</p>
              </div>
            </SwiperSlide>
          </>
        )}
      </Swiper>
    </>
  );
};

export default Page;
