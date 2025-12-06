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
import { Booking } from "../components/profileBooking";

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
              <SwiperSlide key={index} className="w-full h-screen">
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
