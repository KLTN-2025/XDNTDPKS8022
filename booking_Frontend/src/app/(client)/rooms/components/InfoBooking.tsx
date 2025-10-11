import { formatDate } from "@/lib/formatDate";
import { formatPrice } from "@/lib/formatPrice";
import React from "react";

interface IInfo {
  formData: {
    checkInDate: string;
    checkOutDate: string;
    totalGuests: number;
    specialRequests: string;
    totalAmount: number;
    pricePerNight: number;
  };
}

const InfoBooking = ({ formData }: IInfo) => {
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
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Chi Tiết Booking</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Ngày Nhận Phòng:</span>
            <span className="font-medium">
              {formatDate(formData.checkInDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Ngày Trả Phòng:</span>
            <span className="font-medium">
              {formatDate(formData.checkOutDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Thời Gian:</span>
            <span className="font-medium">
              {nights} {nights === 1 ? "Đêm" : "Đêm"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tổng Số Khách:</span>
            <span className="font-medium">{formData.totalGuests}</span>
          </div>
          {formData.specialRequests && (
            <div className="pt-2">
              <span className="block mb-1">Yêu Cầu Đặc Biệt:</span>
              <p className="text-sm bg-white p-2 rounded border">
                {formData.specialRequests}
              </p>
            </div>
          )}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between">
            <span>Giá Một Đêm:</span>
            <span className="font-medium">
              {formatPrice(formData.pricePerNight)}
            </span>
          </div>
          <div className="flex justify-between font-bold text-xl mt-2">
            <span>Tổng Số Tiền:</span>
            <span className="text-blue-500">
              {formatPrice(formData.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoBooking;
