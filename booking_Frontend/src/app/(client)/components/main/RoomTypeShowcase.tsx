// components/RoomTypeShowcase.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

import { motion } from "framer-motion";

import useSWR from "swr";
import Link from "next/link";

interface Amenity {
  id: string;
  name: string;
  description: string | null;
}

interface RoomType {
  id: string;
  name: string;
  description: string | null;
  maxOccupancy: number;
  photoUrls: string; // JSON string array<
  amenities: {
    amenity: Amenity;
  }[];
}

interface RoomTypeShowcaseProps {
  roomType: RoomType[];
}

export default function RoomTypeShowcase() {
  const { data } = useSWR<RoomTypeShowcaseProps>("/api/roomtype");
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Khám Phá Các Loại Phòng
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trải nghiệm không gian nghỉ dưỡng được thiết kế tinh tế, mang đến sự
            thoải mái tuyệt đối cho kỳ nghỉ của bạn
          </p>
        </motion.div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.roomType.map((roomType, index) => (
            <RoomCard key={roomType.id} roomType={roomType} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RoomCard({ roomType, index }: { roomType: RoomType; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/rooms/${roomType.id}`}>
        {/* Image Section với Carousel */}
        <div className="relative h-72 overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={roomType.photoUrls || ""}
              alt=""
              fill
              className={`object-cover transition-all duration-700  opacity-100 scale-100`}
            />
          </div>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Max Occupancy Badge */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">
                Tối đa {roomType.maxOccupancy} người
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Room Name */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {roomType.name}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {roomType.description ||
              "Phòng được thiết kế sang trọng với đầy đủ tiện nghi hiện đại"}
          </p>

          {/* Amenities */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Tiện Nghi
            </h4>
            <div className="flex flex-wrap gap-2">
              {roomType.amenities.slice(0, 4).map(({ amenity }) => (
                <span
                  key={amenity.id}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full 
                         hover:bg-blue-100 transition-colors"
                >
                  {amenity.name}
                </span>
              ))}
              {roomType.amenities.length > 4 && (
                <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  +{roomType.amenities.length - 4} thêm
                </span>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
        </div>

        {/* Hover Effect Border */}
        <div
          className={`absolute inset-0 border-2 border-blue-500 rounded-2xl transition-opacity duration-300 pointer-events-none ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />
      </Link>
    </motion.div>
  );
}
