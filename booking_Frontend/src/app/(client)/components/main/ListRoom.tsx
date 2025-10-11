"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatPrice";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Users, Wifi, Car, Coffee, Tv, Bath } from "lucide-react";

export interface RoomCustomer {
  id: string;
  roomNumber: string;
  roomTypeId: string;
  images: {
    id: string;
    imageUrl: string;
  }[];
  roomType: {
    name: string;
    maxOccupancy: number;
    basePrice: number;
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

  return (
    <div className="flex items-center justify-center py-8 px-4">
      <Head>
        <title>{roomtype.roomType.name}</title>
      </Head>

      <div
        className="group relative bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-xl 
      hover:shadow-2xl transition-all duration-500 w-full  max-w-md overflow-hidden border border-slate-200/50
       hover:border-slate-300/70 transform hover:-translate-y-2 "
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative overflow-hidden">
          <Image
            alt={roomtype.roomType.name}
            src={roomtype.images[0]?.imageUrl || "/placeholder.svg"}
            width={500}
            height={300}
            className="object-cover w-full h-56 transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
          />

          <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
            {formatPrice(roomtype.roomType.basePrice)}/Đêm
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="relative p-6 space-y-4">
          <div className="text-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1 tracking-wide">
              {roomtype.roomNumber}
            </h1>
            <p className="text-lg font-semibold text-slate-700 uppercase tracking-wider">
              {roomtype.roomType.name}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-600 text-center">
              Tiện Nghi Phòng
            </p>
            <div className="grid grid-cols-2 gap-2">
              {roomtype.roomType.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                >
                  <div className="text-slate-500">
                    {getAmenityIcon(amenity.amenity.name)}
                  </div>
                  <span className="text-xs text-slate-600 font-medium">
                    {amenity.amenity.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              {roomtype.roomType.maxOccupancy} Khách/phòng
            </span>
          </div>

          <div className="pt-2">
            <Button
              type="button"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group/btn"
              onClick={() =>
                router.push(`/rooms/${roomtype.roomTypeId}/${roomtype.id}`)
              }
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative">Đặt Phòng Ngay</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListRoom;
