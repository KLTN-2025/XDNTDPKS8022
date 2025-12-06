"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { calculateNights, formatDate } from "@/lib/formatDate";
import { formatPrice } from "@/lib/formatPrice";
import RemoveBooking from "./RemoveBooking";
import ReviewCusTomer from "./ReviewCusTomer";
import {
  translatePaymentMethod,
  translatePaymentStatus,
  translateStatus,
} from "@/lib/translate";
import { Booking } from "./profileBooking";

interface BookingDetailsProps {
  booking: Booking;
}

const BookingDetails = ({ booking }: BookingDetailsProps) => {
  const [expandedRoomIndex, setExpandedRoomIndex] = useState<number | null>(
    null
  );

  return (
    <div className="max-w-6xl mx-auto p-10  ">
      <div className="bg-white rounded-lg shadow-sm h-full">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-medium">
                Đơn #{booking.id.slice(0, 8).toUpperCase()}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    booking.status === "CANCELLED" ? "destructive" : "default"
                  }
                >
                  {translateStatus(booking.status)}
                </Badge>
              </div>
            </div>
            {booking.status === "CHECKED_OUT" ? (
              <div className="flex flex-col md:flex-row gap-2">
                <ReviewCusTomer bookingId={booking.id} />
              </div>
            ) : booking.status === "PENDING" ? (
              <RemoveBooking bookingId={booking.id} />
            ) : (
              ""
            )}
          </div>
        </div>

        {/* Booking Details */}
        <div className="p-4 space-y-4">
          {/* Stay Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Nhận phòng</p>
              <p className="font-medium">{formatDate(booking.checkInDate)}</p>
            </div>
            <div>
              <p className="text-gray-500">Trả phòng</p>
              <p className="font-medium">{formatDate(booking.checkOutDate)}</p>
            </div>
            <div>
              <p className="text-gray-500">Thời gian</p>
              <p className="font-medium">
                {calculateNights(booking.checkInDate, booking.checkOutDate)} đêm
                • {booking.totalGuests} khách
              </p>
            </div>
          </div>

          {/* Rooms */}
          <div className="space-y-2">
            {booking.bookingItems.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center p-2 border rounded">
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        item.room.images[0]?.imageUrl || "/placeholder-room.jpg"
                      }
                      alt={item.room.roomNumber}
                      width={48}
                      height={48}
                      className="rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.room.roomType.name}</p>
                      <p className="text-sm text-gray-500">
                        Phòng {item.room.roomNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(Number(item.pricePerNight))}
                    </p>
                    <button
                      onClick={() =>
                        setExpandedRoomIndex(
                          expandedRoomIndex === index ? null : index
                        )
                      }
                      className="text-sm text-blue-600 flex items-center"
                    >
                      Xem tiện nghi
                      {expandedRoomIndex === index ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {expandedRoomIndex === index && (
                  <div className="p-2 bg-gray-50 rounded mt-2">
                    <p className="font-medium mb-2">Tiện nghi phòng:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.room.roomType.amenities.map((amenity, i) => (
                        <Badge key={i} variant="secondary">
                          {amenity.amenity.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Payment Details */}
          <div className="border-t pt-4 space-y-4">
            <div>
              <div className="flex justify-between">
                {" "}
                <h3 className="font-medium mb-2">Chi tiết thanh toán</h3>
                <p>
                  {(booking.customer?.user?.firstName || "") +
                    " " +
                    (booking.customer?.user?.lastName || "")}
                </p>
              </div>
              {booking.payments.map((payment, index) => (
                <div key={index} className="flex justify-between text-sm py-1">
                  <div className="space-x-2">
                    {" "}
                    <span className="text-gray-600">
                      {translatePaymentMethod(payment.paymentMethod)} •{" "}
                      {formatDate(payment.paymentDate)}
                    </span>
                    <span>{formatPrice(Number(payment.amount))}</span>
                  </div>
                  <div
                    className={`text-sm ${
                      payment.status === "COMPLETED"
                        ? "text-green-600"
                        : payment.status === "PENDING"
                        ? "text-yellow-600"
                        : payment.status === "REFUNDED"
                        ? "text-blue-600"
                        : payment.status === "FAILED"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {translatePaymentStatus(payment.status)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Tổng thanh toán</span>
              <span className="text-xl text-blue-600">
                {formatPrice(Number(booking.totalAmount))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
