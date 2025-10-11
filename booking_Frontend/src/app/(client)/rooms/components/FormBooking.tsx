import { formatPrice } from "@/lib/formatPrice";
import { Calendar, Coffee } from "lucide-react";
import React, { useEffect, useState } from "react";
import ModalPayMent from "./ModalPayMent";
import toast from "react-hot-toast";
import useSWR from "swr";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { URL_API } from "@/lib/fetcher";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Square } from "lucide-react";

interface BookedRange {
  start: string; // "YYYY-MM-DD"
  end: string; // "YYYY-MM-DD"
  status: string;
}
interface RoomBooking {
  room: {
    id: string;
    roomType: {
      maxOccupancy: number;
      basePrice: string;
    };
  };
  handleFormChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  formData: any;
  setFormData: React.Dispatch<
    React.SetStateAction<{
      checkInDate: Date | null;
      checkOutDate: Date | null;
      totalGuests: number;
      specialRequests: string;
      totalAmount: number;
      bookingSource: string;
      discountId: number | null;
      pricePerNight: number;
      roomId: string;
    }>
  >;
}

const FormBooking = ({
  room,
  formData,
  handleFormChange,
  setFormData,
}: RoomBooking) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [highlightedDates, setHighlightedDates] = useState<
    { [className: string]: Date[] }[]
  >([]);

  const handleOpenModal = () => {
    if (formData.checkInDate && formData.checkOutDate) {
      if (formData.checkOutDate <= formData.checkInDate) {
        toast.error("Ngày trả phòng phải sau ngày nhận phòng");
        return;
      }
      setIsOpen(true);
    } else {
      toast.error("Vui lòng chọn ngày nhận phòng và trả phòng");
    }
  };

  function getExcludeDates(bookedRanges: BookedRange[]): Date[] {
    const dates: Date[] = [];
    bookedRanges.forEach((range) => {
      const startDate = new Date(range.start);
      const endDate = new Date(range.end);

      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        dates.push(new Date(d));
      }
    });
    return dates;
  }

  const { data } = useSWR(`${URL_API}/api/room/${room.id}/booked-dates`);
  console.log("Booked Dates Data:", data);
  const { data: discount } = useSWR(
    discountCode ? `${URL_API}/api/discount?code=${discountCode}` : null
  );

  function handleDiscountCode() {
    if (!formData.checkInDate || !formData.checkOutDate) return;
    const basePrice = Number(room.roomType.basePrice);
    const days =
      (formData.checkOutDate.getTime() - formData.checkInDate.getTime()) /
      (1000 * 60 * 60 * 24);
    if (discount?.data?.percentage) {
      setFormData((prev) => ({
        ...prev,
        discountId: discount.data.id,
        totalAmount: Math.round(
          basePrice * days * (1 - discount.data.percentage / 100)
        ),
      }));

      toast.success("Mã giảm giá đã được áp dụng!");
    } else {
      toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn");
      setFormData((prev) => ({
        ...prev,
        discountId: null,
        totalAmount: Math.round(basePrice * days),
      }));
    }
  }

  useEffect(() => {
    if (data) {
      setHighlightedDates(getHighlightedDates(data));
      setBookedDates(getExcludeDates(data));
    }
  }, [data]);

  function getHighlightedDates(
    bookedRanges: BookedRange[]
  ): { [className: string]: Date[] }[] {
    const highlighted: { [className: string]: Date[] }[] = [];

    bookedRanges.forEach((range) => {
      const startDate = new Date(range.start);
      const endDate = new Date(range.end);
      const dates: Date[] = [];

      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        dates.push(new Date(d));
      }

      let className = "";

      if (range.status === "CHECKED_IN") {
        className = "react-datepicker__day--checked-in";
      } else if (range.status === "PENDING") {
        className = "react-datepicker__day--pending";
      }

      if (className) {
        highlighted.push({ [className]: dates });
      }
    });

    return highlighted;
  }

  const handleDateChange = (
    date: Date | null,
    field: "checkInDate" | "checkOutDate"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  return (
    <div>
      <div className="bg-gray-50 py-8 px-4 rounded-xl shadow-md sticky top-6 border border-gray-100">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Đặt phòng
        </h2>
        <form className="space-y-6">
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Chi tiết đặt phòng
              </span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar size={16} className="mr-2 text-blue-600" />
                  Ngày nhận *
                </label>
                <DatePicker
                  selected={formData.checkInDate}
                  onChange={(date) => handleDateChange(date, "checkInDate")}
                  excludeDates={bookedDates}
                  highlightDates={highlightedDates}
                  placeholderText=" ngày nhận phòng"
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  minDate={new Date()} // Disable past dates
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar size={16} className="mr-2 text-blue-600" />
                  Ngày trả *
                </label>
                <DatePicker
                  selected={formData.checkOutDate}
                  onChange={(date) => handleDateChange(date, "checkOutDate")}
                  excludeDates={bookedDates}
                  highlightDates={highlightedDates}
                  placeholderText=" ngày trả phòng"
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  minDate={formData.checkInDate || new Date()} // Ensure checkOutDate is after checkInDate
                  required
                />
              </div>
            </div>
            <div className="flex  items-center gap-6">
              <div className="flex items-center gap-2">
                <Square className="w-4 h-4 text-gray-400 bg-gray-400" />
                <span>Đã có người đặt</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Square className="w-4 h-4 text-green-500 bg-green-500" />
                <span>Đã Nhận Phòng</span>
              </div>
            </div>
            {room.roomType.maxOccupancy !== 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng khách
                </label>
                <select
                  name="totalGuests"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleFormChange}
                  value={formData.totalGuests}
                >
                  {[...Array(room.roomType.maxOccupancy)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} người
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Coffee size={16} className="mr-2 text-blue-600" />
                Yêu cầu đặc biệt
              </label>
              <textarea
                name="specialRequests"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                rows={3}
                placeholder="Vui lòng cho chúng tôi biết nhu cầu đặc biệt của bạn"
                onChange={handleFormChange}
                value={formData.specialRequests}
              />
            </div>
          </div>
          <div className="grid w-full max-w-sm gap-2">
            <Label htmlFor="discount">Mã giảm giá</Label>
            <div className="flex items-center gap-2">
              <Input
                id="discount"
                placeholder="Nhập mã giảm giá"
                value={discountCode.toUpperCase()}
                onChange={(e) => setDiscountCode(e.target.value)}
              />{" "}
              <Button type="button" onClick={handleDiscountCode}>
                {" "}
                Áp Dụng
              </Button>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-white p-4 rounded-lg border border-blue-100">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Giá phòng mỗi đêm:</span>
              <span className="font-medium">
                {formatPrice(Number(room.roomType.basePrice))}
              </span>
            </div>
            <div className="border-t border-gray-200 my-2 pt-2">
              <div className="flex justify-between">
                <span className="font-medium">Tổng cộng:</span>
                <span className="text-blue-600 font-bold">
                  {formatPrice(Number(formData.totalAmount)) || 0}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                * Giá chưa bao gồm thuế và phí dịch vụ
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleOpenModal}
            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Đặt phòng ngay
          </button>

          <p className="text-xs text-center text-gray-500">
            Bằng cách nhấn Đặt phòng ngay, bạn đồng ý với các điều khoản và điều
            kiện của chúng tôi
          </p>
        </form>
      </div>
      <ModalPayMent isOpen={isOpen} setIsOpen={setIsOpen} formData={formData} />
    </div>
  );
};

export default FormBooking;
