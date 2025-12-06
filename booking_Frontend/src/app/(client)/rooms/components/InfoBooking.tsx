"use client";
import { useBookingStore } from "@/app/(dashboard)/context/useBookingForm";
import { formatDate } from "@/lib/formatDate";
import { formatPrice } from "@/lib/formatPrice";
import React from "react";

const InfoBooking = () => {
  const { formData } = useBookingStore();

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    return Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const nights = calculateNights();

  return (
    <>
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Thông tin đặt phòng
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Mã phòng:</span>
            <span className="font-semibold">{formData?.roomId}</span>
          </div>

          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Ngày nhận phòng:</span>
            <span className="font-semibold">
              {formatDate(formData.checkInDate)}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Ngày trả phòng:</span>
            <span className="font-semibold">
              {formatDate(formData.checkOutDate)}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Số đêm:</span>
            <span className="font-semibold">{nights} đêm</span>
          </div>

          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Số khách:</span>
            <span className="font-semibold">{formData.totalGuests} người</span>
          </div>

          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Giá mỗi đêm:</span>
            <span className="font-semibold">
              {formatPrice(formData.pricePerNight)}
            </span>
          </div>

          {formData.discountId && (
            <div className="flex justify-between py-2 border-b text-green-600">
              <span>Mã giảm giá:</span>
              <span className="font-semibold">#{formData.discountId}</span>
            </div>
          )}

          <div className="flex justify-between py-3 border-t-2 border-gray-300 mt-4">
            <span className="text-lg font-bold text-gray-800">Tổng tiền:</span>
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(formData.totalAmount)}
            </span>
          </div>

          {formData.specialRequests && (
            <div className="py-2">
              <span className="text-gray-600 block mb-2">
                Yêu cầu đặc biệt:
              </span>
              <p className="text-gray-800 bg-white p-3 rounded border">
                {formData.specialRequests}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InfoBooking;
