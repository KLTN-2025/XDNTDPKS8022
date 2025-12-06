"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatPrice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Users,
  Wifi,
  Car,
  Coffee,
  Tv,
  Bath,
  ChevronRight,
  Star,
} from "lucide-react";
import { useState } from "react";

export interface RoomCustomer {
  id: string;
  roomNumber: string;
  roomTypeId: string;
  currentPrice: number;
  originalPrice: number;
  images: {
    id: string;
    imageUrl: string;
  }[];
  roomType: {
    name: string;
    maxOccupancy: number;
    amenities: {
      amenity: {
        name: string;
      };
    }[];
  };
}

interface RoomType {
  roomtype: RoomCustomer;
}

const ListRoom = ({ roomtype }: RoomType) => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  const getAmenityIcon = (amenityName: string) => {
    const name = amenityName.toLowerCase();
    if (name.includes("wifi") || name.includes("internet"))
      return <Wifi className="w-4 h-4" />;
    if (name.includes("parking") || name.includes("đỗ xe"))
      return <Car className="w-4 h-4" />;
    if (name.includes("coffee") || name.includes("cà phê"))
      return <Coffee className="w-4 h-4" />;
    if (name.includes("tv") || name.includes("tivi"))
      return <Tv className="w-4 h-4" />;
    if (name.includes("bath") || name.includes("tắm"))
      return <Bath className="w-4 h-4" />;
    return <Coffee className="w-4 h-4" />;
  };

  const hasDiscount = roomtype.currentPrice < roomtype.originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(
        ((roomtype.originalPrice - roomtype.currentPrice) /
          roomtype.originalPrice) *
          100
      )
    : 0;

  const handleCardClick = () => {
    router.push(`/rooms/${roomtype.roomTypeId}/${roomtype.id}`);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <article
        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 cursor-pointer"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      >
        {/* Image Container - Agoda style */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            alt={roomtype.roomType.name}
            src={roomtype.images[0]?.imageUrl || "/placeholder.svg"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-all duration-500 ${
              imageLoaded ? "scale-100" : "scale-105"
            } group-hover:scale-110`}
            onLoad={() => setImageLoaded(true)}
            priority={false}
            quality={85}
          />

          {/* Discount Badge - Top Right */}
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg z-10">
              -{discountPercent}%
            </div>
          )}

          {/* Room Number Badge - Top Left */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md z-10">
            Phòng {roomtype.roomNumber}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section - Agoda style layout */}
        <div className="p-4 space-y-3">
          {/* Room Type Name */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">
              {roomtype.roomType.name}
            </h3>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1 group-hover:text-blue-600 transition-colors" />
          </div>

          {/* Occupancy */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-gray-400" />
            <span>Tối đa {roomtype.roomType.maxOccupancy} khách</span>
          </div>

          {/* Amenities - Horizontal scroll like Agoda */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {roomtype.roomType.amenities.slice(0, 4).map((amenity, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-xs text-gray-700 whitespace-nowrap flex-shrink-0 border border-gray-100"
              >
                <span className="text-gray-500">
                  {getAmenityIcon(amenity.amenity.name)}
                </span>
                <span className="font-medium">{amenity.amenity.name}</span>
              </div>
            ))}
            {roomtype.roomType.amenities.length > 4 && (
              <div className="flex items-center px-3 py-1.5 bg-gray-50 rounded-full text-xs text-gray-600 whitespace-nowrap flex-shrink-0 border border-gray-100">
                +{roomtype.roomType.amenities.length - 4} tiện nghi
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Price Section - Agoda style */}
          <div className="flex items-end justify-between pt-1">
            <div className="space-y-1">
              {hasDiscount && (
                <p className="text-xs text-gray-400 line-through">
                  {formatPrice(roomtype.originalPrice)}
                </p>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(roomtype.currentPrice)}
                </span>
                <span className="text-sm text-gray-500 font-normal">/đêm</span>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm hover:shadow-md"
            >
              Xem phòng
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ListRoom;
