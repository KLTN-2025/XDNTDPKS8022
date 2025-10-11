import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { fetcher, URL_API } from "@/lib/fetcher";
import { formatPrice } from "@/lib/formatPrice";
import { Label } from "@radix-ui/react-label";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import useSWR from "swr";
import ModalPaymentAdmin from "./ModalPaymentAdmin";
import axios from "axios";
import { BookingFormData } from "../page";

export interface RoomImage {
  id: string;
  imageUrl: string;
}

export interface Booking {
  checkInDate: string;
  checkOutDate: string;
}

export interface BookingItem {
  booking: Booking;
}

export interface RoomType {
  id: string;
  name: string;
  maxOccupancy: number;
  basePrice: string; // dạng string (vd: "500000") trong dữ liệu JSON của bạn
}

export type RoomStatus = "AVAILABLE" | "OCCUPIED" | string;

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  notes: string | null;
  roomTypeId: string;
  bookingItems: BookingItem[];
  images: RoomImage[];
  roomType: RoomType;
}

export interface BookingProps {
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  roomData: Room[];
}
const fetcher1 = (url: string) => axios.get(url).then((res) => res.data);
const AdminBookingForm = ({
  formData,
  setFormData,
  roomData,
}: BookingProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [discount, setDiscount] = useState<number | null>(null);

  const { data } = useSWR(
    `${URL_API}/api/room/${
      formData.roomId ? formData.roomId : null
    }/booked-dates`,
    fetcher
  );

  const excludeDateIntervals =
    data?.map((item: { start: string; end: string }) => ({
      start: new Date(item.start),
      end: new Date(item.end),
    })) || [];

  // Hàm kiểm tra tính hợp lệ của form
  const isFormValid = () => {
    const requiredFields = [
      formData.checkInDate,
      formData.checkOutDate,
      formData.roomId,
    ];
    const guestsValid = formData.totalGuests > 0;
    const priceValid = formData.pricePerNight > 0;

    return (
      requiredFields.every((field) => field && field.trim() !== "") &&
      guestsValid &&
      priceValid
    );
  };

  const { data: code } = useSWR(
    formData.discountCode
      ? `${URL_API}/api/discount?code=${formData.discountCode}`
      : null,
    fetcher1
  );

  useEffect(() => {
    if (code) {
      setDiscount(code?.data?.percentage);
    } else {
      setDiscount(0); // hoặc null tùy bạn
    }
  }, [code]);

  // Tính totalAmount
  useEffect(() => {
    const calculateTotalAmount = async () => {
      if (
        !formData.checkInDate ||
        !formData.checkOutDate ||
        !formData.pricePerNight
      ) {
        setTotalAmount(0);
        return;
      }

      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const nights =
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);
      const baseAmount = formData.pricePerNight * nights;
      let discountAmount = 0;

      if (formData.discountCode) {
        discountAmount = (baseAmount * Number(discount)) / 100;
      }

      const total = baseAmount - discountAmount;
      setTotalAmount(total > 0 ? total : 0);
    };

    calculateTotalAmount();
  }, [
    formData.checkInDate,
    formData.checkOutDate,
    formData.pricePerNight,
    formData.discountCode,
    discount,
  ]);

  return (
    <>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày Check-in
            </Label>
            <DatePicker
              placeholderText="dd/MM/yyyy"
              dateFormat="dd/MM/yyyy"
              className="w-full p-3 border border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              selected={
                formData.checkInDate ? new Date(formData.checkInDate) : null
              }
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  checkInDate: date ? date.toISOString() : "",
                }))
              }
              required
              minDate={new Date()}
              excludeDateIntervals={excludeDateIntervals}
            />
          </div>

          <div className="flex flex-col justify-center items-center w-full">
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày Check-out
            </Label>
            <DatePicker
              placeholderText="dd/MM/yyyy"
              dateFormat="dd/MM/yyyy"
              className="w-full p-3 border border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              selected={
                formData.checkOutDate ? new Date(formData.checkOutDate) : null
              }
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  checkOutDate: date ? date.toISOString() : "",
                }))
              }
              required
              minDate={
                formData.checkInDate
                  ? new Date(formData.checkInDate)
                  : new Date()
              }
              disabled={!formData.checkInDate}
              excludeDateIntervals={excludeDateIntervals}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn Phòng
            </Label>
            <select
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.roomId}
              onChange={(e) => {
                const selectedRoom = roomData.find(
                  (room) => room.id === e.target.value
                );

                setFormData((prev) => ({
                  ...prev,
                  roomId: e.target.value,
                  pricePerNight: selectedRoom
                    ? Number(selectedRoom.roomType.basePrice)
                    : prev.pricePerNight,
                }));
              }}
              required
            >
              <option value="">Select a room</option>
              {roomData
                ?.filter((room) => room.status === "AVAILABLE")
                .map((room) => (
                  <option value={room.id} key={room.id}>
                    {room.roomNumber} - {room.roomType.name} (Max:{" "}
                    {room.roomType.maxOccupancy})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Số Khách Hàng
            </Label>
            <select
              name="totalGuests"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.totalGuests}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  totalGuests: parseInt(e.target.value) || 1,
                }))
              }
              required
            >
              {Array.from({
                length:
                  roomData.find((room) => room.id === formData.roomId)?.roomType
                    .maxOccupancy || 1,
              }).map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1} khách
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Giá Tiền 1 Đêm
            </Label>
            <div className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
              {formatPrice(formData.pricePerNight)}
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Tổng Số Tiền (VND)
            </Label>
            <div className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
              {formatPrice(totalAmount)}
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Mã Giảm Giá (không bắt buộc)
            </Label>
            <Input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.discountCode.toUpperCase()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  discountCode: e.target.value,
                }))
              }
            />
            <p className="mt-2">
              {discount ? (
                <span className="text-sm  text-green-500">
                  Đã Áp Dụng Mã Giảm Giá{" "}
                </span>
              ) : (
                <span className="text-sm  text-red-500"></span>
              )}
            </p>
          </div>
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Yêu cầu đặc biệt
          </Label>
          <textarea
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={formData.specialRequests}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                specialRequests: e.target.value,
              }))
            }
          />
        </div>

        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Đặt Phòng
        </Button>
      </form>

      <ModalPaymentAdmin
        totalAmount={totalAmount}
        setFormBooking={setFormData}
        formBooking={formData}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
};

export default AdminBookingForm;
