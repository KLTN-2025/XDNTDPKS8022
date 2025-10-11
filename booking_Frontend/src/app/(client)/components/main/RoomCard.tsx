"use client";
import { formatPrice } from "@/lib/formatPrice";
import Image from "next/image";
import Link from "next/link";
import { Users, Star, ArrowRight } from "lucide-react";

interface Iroom {
  room: {
    id: string;
    roomTypeId: string;
    roomType: {
      maxOccupancy: number;
      basePrice: string;
      name: string;
    };
    images: { imageUrl: string }[];
  };
}

const RoomCard = ({ room }: Iroom) => {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
      <div className="relative h-32 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        <Image
          src={room.images[0].imageUrl || "/images/room-placeholder.jpg"}
          alt={room.roomType.name}
          width={400}
          height={300}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Floating badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 transform translate-x-8 group-hover:translate-x-0 transition-transform duration-300">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium text-gray-700">Premium</span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
            {room.roomType.name}
          </h3>

          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Sức chứa:</span>
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm font-semibold">
              {room.roomType.maxOccupancy} người
            </span>
          </div>
        </div>

        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">Giá từ:</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-600 block">
                {formatPrice(Number(room.roomType.basePrice))}
              </span>
              <span className="text-sm text-gray-500">VND/đêm</span>
            </div>
          </div>
        </div>

        <Link
          href={`/rooms/${room.roomTypeId}/${room.id}`}
          className="group/btn relative block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-center font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
        >
          <span className="flex items-center justify-center gap-2">
            Đặt phòng ngay
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </span>

          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 rounded-xl" />
        </Link>
      </div>

      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300 pointer-events-none" />
    </div>
  );
};

export default RoomCard;
