"use client";
import { formatDate } from "@/lib/formatDate";
import { formatPrice } from "@/lib/formatPrice";
import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { Label } from "@/components/ui/label";
import QrCodePayment from "../../add-booking/components/QrCodePayment";
import { BookingFormData } from "../page";
import { URL_API } from "@/lib/fetcher";

interface IPaymen {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  formBooking: BookingFormData;
  setFormBooking: React.Dispatch<React.SetStateAction<BookingFormData>>;
  totalAmount: number;
}

const ModalPaymentAdmin = ({
  isOpen,
  setIsOpen,
  formBooking,
  setFormBooking,
  totalAmount,
}: IPaymen) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  const calculateNights = () => {
    if (!formBooking.checkInDate || !formBooking.checkOutDate) return 0;

    const checkIn = new Date(formBooking.checkInDate);
    const checkOut = new Date(formBooking.checkOutDate);

    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const nights = calculateNights();

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${URL_API}/api/booking/employee`,
        formBooking,
        {
          withCredentials: true,
        }
      );

      console.log("Response booking:", res.data);

      if (res.data) {
        if (res.data.data && res.data.data.id) {
          const resPayment = await axios.post(`${URL_API}/api/payment`, {
            amount: totalAmount,
            paymentMethod: paymentMethod,
            bookingId: res.data.data.id,
            status: "COMPLETED",
          });

          if (resPayment.data) {
            toast.success("Thanh toán thành công");
            setIsOpen(false);
          } else {
            toast.error("Thanh toán thất bại, vui lòng thử lại!");
          }
        } else {
          toast.error("Không lấy được ID booking từ server");
        }
        setFormBooking({
          bookingSource: "DIRECT",
          checkInDate: "",
          checkOutDate: "",
          totalGuests: 1,
          specialRequests: "",
          discountCode: "",
          pricePerNight: 0,
          roomId: "",
          customerId: "",
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="Payment Confirmation"
      className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-6xl mx-auto mt-5 outline-none"
      overlayClassName="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-start z-50 overflow-auto"
    >
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Xác Nhận Thanh Toán</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Booking Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Chi Tiết Booking</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Ngày Check In:</span>
                <span className="font-medium">
                  {formatDate(formBooking.checkInDate)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Ngày Check Out:</span>
                <span className="font-medium">
                  {formatDate(formBooking.checkOutDate)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Thời Gian:</span>
                <span className="font-medium">
                  {nights} {nights === 1 ? "Đêm" : "Đêm"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tổng Số Khách Hàng:</span>
                <span className="font-medium">{formBooking.totalGuests}</span>
              </div>

              {formBooking.specialRequests && (
                <div className="pt-2">
                  <span className="block mb-1">Special Requests:</span>
                  <p className="text-sm bg-white p-2 rounded border">
                    {formBooking.specialRequests}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between">
                <span>Giá Một Đêm:</span>
                <span className="font-medium">
                  {formatPrice(formBooking.pricePerNight)}
                </span>
              </div>

              {formBooking.discountCode && (
                <div className="flex justify-between text-green-600">
                  <span>mã Giảm Giá:</span>
                  <span>{formBooking.discountCode}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-xl mt-2">
                <span>Tổng Số Tiền:</span>
                <span className="text-blue-500">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Chọn Phương Thức Thanh Toán
            </h3>
            <div className="space-y-4">
              <Label className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CASH"
                  checked={paymentMethod === "CASH"}
                  onChange={handlePaymentMethodChange}
                  className="form-radio h-5 w-5 text-blue-500"
                />
                <span className="ml-3 text-gray-700">Tiền Mặt</span>
              </Label>

              <Label className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="QR_CODE"
                  checked={paymentMethod === "QR_CODE"}
                  onChange={handlePaymentMethodChange}
                  className="form-radio h-5 w-5 text-blue-500"
                />

                <span className="ml-3 text-gray-700">Thẻ Ngân Hàng</span>
              </Label>
              {paymentMethod === "QR_CODE" && (
                <QrCodePayment Amount={totalAmount} />
              )}

              <Label className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mobilePayment"
                  checked={paymentMethod === "mobilePayment"}
                  onChange={handlePaymentMethodChange}
                  className="form-radio h-5 w-5 text-blue-500"
                />
                <span className="ml-3 text-gray-700">
                  Thanh Toán Qua Ứng Dụng
                </span>
              </Label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-gray-600 mr-3 hover:bg-gray-100 rounded disabled:opacity-50 cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={!paymentMethod}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
          >
            Xác Nhận
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalPaymentAdmin;
