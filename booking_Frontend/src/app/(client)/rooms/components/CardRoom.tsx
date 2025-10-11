"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatPrice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

// Interfaces
interface RoomImage {
  id: string;
  imageUrl: string;
}

interface RoomDetail {
  id: string;
  roomNumber: string;
  images: RoomImage[];
}

interface Amenity {
  amenity: {
    name: string;
  };
}

interface Room {
  id: true;
  name: string;
  maxOccupancy: number;
  basePrice: string; // Hoặc number nếu cần
  rooms: RoomDetail[];
  amenities: Amenity[];
}

interface RoomCardProps {
  room: Room;
}

const CardRoom = ({ room }: RoomCardProps) => {
  const router = useRouter();

  if (!room || room.rooms.length === 0) {
    return (
      <div className="text-center text-gray-500 md:mt-5 mt-0">
        <h1 className="text-2xl md:text-3xl font-bold text-yellow-600 mb-4">
          {room.name}
        </h1>
        <p>Hiện Chưa Có Phòng Nào Để Hiển Thị</p>
      </div>
    );
  }
  return (
    <section className="my-2 px-4 md:px-8 lg:px-16 bg-gray-50">
      <h1 className="text-center text-2xl md:text-3xl font-bold text-yellow-600 mb-12 uppercase tracking-widest pt-2">
        {room.name}
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {room.rooms.map((roomDetail) => (
          <div
            key={roomDetail.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Image */}
            <div className="relative w-full h-64 md:h-72">
              <Image
                src={roomDetail.images[0]?.imageUrl || "/fallback.jpg"}
                alt={`${room.name} Image`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center"
                priority
              />
            </div>

            {/* Room Info */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {room.name}
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                Phòng Số: {roomDetail.roomNumber}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Sức Chứa: {room.maxOccupancy} khách
              </p>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Tiện Nghi
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity, index) => (
                    <li
                      key={index}
                      className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                    >
                      {amenity.amenity.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-2xl titleFont text-red-600/80 ">
                  {formatPrice(Number(room.basePrice))} / đêm
                </p>
                <Button
                  variant="default"
                  className=" font-semibold  text-center bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                  onClick={() =>
                    router.push(`/rooms/${room.id}/${roomDetail.id}`)
                  }
                >
                  Đặt ngay
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CardRoom;
