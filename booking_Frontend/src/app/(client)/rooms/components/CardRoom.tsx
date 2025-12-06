"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatPrice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Wifi, Users, Check, MapPin } from "lucide-react";
import { ShowCurrentPrice } from "@/lib/showCurrentPrice";

// Interfaces
interface RoomImage {
  id: string;
  imageUrl: string;
}

interface RoomDetail {
  id: string;
  roomNumber: string;
  originalPrice: number;
  currentPrice: number;
  images: RoomImage[];
}

interface Amenity {
  amenity: {
    name: string;
  };
}

interface Room {
  id: string;
  name: string;
  maxOccupancy: number;
  rooms: RoomDetail[];
  amenities: Amenity[];
}

interface RoomCardProps {
  room: Room;
}

const CardRoom = ({ room }: RoomCardProps) => {
  const router = useRouter();
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  useEffect(() => {
    async function fetchPrices() {
      const newPrices: { [key: string]: number } = {};
      for (const roomDetail of room.rooms) {
        const res = await ShowCurrentPrice({ roomId: roomDetail.id });
        newPrices[roomDetail.id] = res.displayPrice;
      }
      setPrices(newPrices);
    }

    if (room.rooms.length > 0) {
      fetchPrices();
    }
  }, [room.rooms]);

  if (!room || room.rooms.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          {room.name}
        </h1>
        <p className="text-gray-600">Hiện chưa có phòng nào để hiển thị</p>
      </div>
    );
  }

  return (
    <section className="py-8 px-4 md:px-6 lg:px-8 bg-gray-50">
      {/* Section Title - Agoda Style */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {room.name}
        </h2>
        <p className="text-gray-600">
          {room.rooms.length} phòng có sẵn • Sức chứa tối đa {room.maxOccupancy}{" "}
          khách
        </p>
      </div>

      {/* Room Cards Grid */}
      <div className="max-w-7xl mx-auto space-y-4">
        {room.rooms.map((roomDetail) => (
          <div
            key={roomDetail.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 group"
          >
            {/* Horizontal Layout - Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Image Section - 4 columns */}
              <div className="lg:col-span-4 relative h-64 lg:h-full min-h-[240px]">
                <Image
                  src={roomDetail.images[0]?.imageUrl || "/fallback.jpg"}
                  alt={`${room.name} - Phòng ${roomDetail.roomNumber}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />

                {/* Deal Badge */}
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded">
                  Deal Hôm Nay
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  1/{roomDetail.images.length}
                </div>
              </div>

              {/* Content Section - 5 columns */}
              <div className="lg:col-span-5 p-4 md:p-6">
                {/* Room Type & Number */}
                <div className="mb-3">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                    {room.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Phòng số {roomDetail.roomNumber}</span>
                  </div>
                </div>

                {/* Rating - Agoda Style */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded">
                    8.5
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    Tuyệt vời
                  </span>
                </div>

                {/* Key Features - Icons */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-700">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{room.maxOccupancy} khách</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-4 h-4" />
                    <span>WiFi miễn phí</span>
                  </div>
                </div>

                {/* Amenities - Clean List */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Tiện nghi nổi bật
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {room.amenities.slice(0, 6).map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">
                          {amenity.amenity.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {room.amenities.length > 6 && (
                    <button className="text-sm text-blue-600 font-medium mt-2 hover:underline">
                      + Xem thêm {room.amenities.length - 6} tiện nghi
                    </button>
                  )}
                </div>
              </div>

              {/* Price & CTA Section - 3 columns */}
              <div className="lg:col-span-3 bg-blue-50/50 p-4 md:p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-200">
                {/* Price Section */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">
                    Giá mỗi đêm từ
                  </div>

                  {/* Original Price - Strikethrough */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-400 line-through">
                      {prices[roomDetail.id]
                        ? formatPrice(prices[roomDetail.id] * 1.1)
                        : "Đang tải..."}
                    </span>
                    <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded">
                      -10%
                    </span>
                  </div>

                  {/* Current Price - Large */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-bold text-gray-900">
                      {prices[roomDetail.id]
                        ? formatPrice(prices[roomDetail.id])
                        : "Đang tải..."}
                    </span>
                  </div>

                  {/* <div className="text-xs text-gray-500 mt-1">
                    + 240.000đ phí & thuế
                  </div> */}
                  {/* Benefits - Green Text */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <Check className="w-4 h-4" />
                      <span className="font-medium">Hủy miễn phí</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <Check className="w-4 h-4" />
                      <span className="font-medium">
                        Không cần thanh toán trước
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA Button - Prominent */}
                <div className="space-y-2">
                  <Button
                    onClick={() =>
                      router.push(`/rooms/${room.id}/${roomDetail.id}`)
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-base rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Chọn phòng
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                    <Check className="w-3 h-3 text-green-600" />
                    <span>Xác nhận tức thì</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More - Agoda Style */}
      {room.rooms.length > 5 && (
        <div className="max-w-7xl mx-auto mt-6 text-center">
          <Button
            variant="outline"
            className="px-8 py-3 text-blue-600 border-blue-600 hover:bg-blue-50 font-semibold"
          >
            Xem thêm phòng
          </Button>
        </div>
      )}
    </section>
  );
};

export default CardRoom;
