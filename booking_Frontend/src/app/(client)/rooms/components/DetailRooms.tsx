"use client";

import type React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import { Users, Star, CheckCircle, Clock, Shield } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { formatPrice } from "@/lib/formatPrice";
import { RoomStatus } from "@/app/(dashboard)/admin/bookings/addbooking/components/AdminBookingForm";

interface DetailRoomsProps {
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

const DetailRooms: React.FC<DetailRoomsProps> = ({ room }) => {
  return (
    <>
      {/* Main Content */}
      <div className="space-y-10">
        {/* Enhanced Header Section */}
        <div className="relative">
          <div className="flex flex-row justify-between items-start md:items-center border-b pb-8 border-gray-200">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-2 text-balance">
                {room.roomType.name}
              </h1>
              <p className="text-lg text-gray-600 font-light">
                Phòng {room.roomNumber} • Tầng {room.floor}
              </p>
            </div>
            <div className="text-right flex mt-6">
              <p className="text-2xl lg:text-4xl font-bold text-blue-600 mb-1">
                {formatPrice(Number(room.roomType.basePrice))}
              </p>
              <span className="text-lg font-normal text-gray-500">/đêm</span>
            </div>
          </div>

          {/* Enhanced Key Features */}
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
              <Users size={20} className="text-blue-600 mr-2" />
              <span className="text-gray-700 font-medium">
                Tối đa {room.roomType.maxOccupancy} khách
              </span>
            </div>
            <div className="flex items-center bg-amber-50 px-4 py-2 rounded-full">
              <Star size={20} className="text-amber-500 mr-2" />
              <span className="text-gray-700 font-medium">Phòng cao cấp</span>
            </div>
          </div>
        </div>

        {/* Enhanced Image Gallery */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <Swiper
            modules={[Navigation, Pagination, EffectFade, Autoplay]}
            effect="fade"
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              bulletClass: "swiper-pagination-bullet-custom",
              bulletActiveClass: "swiper-pagination-bullet-active-custom",
            }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            loop={true}
            className="w-full h-[500px] lg:h-[650px]"
          >
            {room.images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                  <Image
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={`${room.roomType.name} - Phòng ${room.roomNumber}`}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority={index === 0}
                  />
                  <div className="absolute bottom-0 left-0 p-8 z-20 text-white">
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 inline-block">
                      <h2 className="text-2xl lg:text-3xl font-serif mb-1 tracking-wide">
                        {room.roomType.name}
                      </h2>
                      <p className="text-lg font-light opacity-90">
                        Không gian sang trọng & tiện nghi
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg cursor-pointer transition-all duration-300">
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
          <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg cursor-pointer transition-all duration-300">
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* Enhanced Description */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl">
          <h2 className="text-2xl lg:text-3xl font-serif text-gray-800 mb-6 flex items-center">
            <div className="w-1 h-8 bg-blue-600 rounded-full mr-4"></div>
            Giới thiệu
          </h2>
          <ReactMarkdown>{room.roomType.description}</ReactMarkdown>
        </div>

        {/* Enhanced Amenities */}
        <div>
          <h2 className="text-2xl lg:text-3xl font-serif text-gray-800 mb-6 flex items-center">
            <div className="w-1 h-8 bg-blue-600 rounded-full mr-4"></div>
            Tiện nghi phòng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {room.roomType.amenities.map((item, index) => (
              <div
                key={index}
                className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <CheckCircle size={20} className="text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">
                  {item.amenity.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Policies */}
        <div>
          <h2 className="text-2xl lg:text-3xl font-serif text-gray-800 mb-6 flex items-center">
            <div className="w-1 h-8 bg-blue-600 rounded-full mr-4"></div>
            Chính sách
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 p-2 rounded-full mr-3">
                  <Clock size={20} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  Nhận phòng & Trả phòng
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Nhận phòng: 14:00
                </p>
                <p className="text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Trả phòng: 12:00
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
              <div className="flex items-center mb-4">
                <div className="bg-green-600 p-2 rounded-full mr-3">
                  <Shield size={20} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  Hủy phòng
                </h3>
              </div>
              <p className="text-gray-700 flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                Miễn phí hủy trước 3 ngày
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Swiper Styles */}
    </>
  );
};

export default DetailRooms;
