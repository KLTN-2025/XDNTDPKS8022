import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatDate";
import React from "react";
import Modal from "react-modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface Room {
  bookingItems: { booking: { checkInDate: string; checkOutDate: string } }[];
}

interface CheckDateInOutProps {
  room: Room;
}

const CheckDateInOut = ({ room }: CheckDateInOutProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Danh sách các ngày đã đặt
  const bookedDates = room.bookingItems.flatMap((item) => {
    const checkIn = new Date(item.booking.checkInDate);
    const checkOut = new Date(item.booking.checkOutDate);
    const dates: string[] = [];

    for (let d = new Date(checkIn); d <= checkOut; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toDateString()); // dùng toDateString để dễ so sánh
    }

    return dates;
  });

  // Class tùy chỉnh cho từng ô trong lịch
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      if (bookedDates.includes(date.toDateString())) {
        return "booked-date";
      }
    }
    return null;
  };

  return (
    <>
      <Button className="cursor-pointer ml-7" onClick={() => setIsOpen(true)}>
        Kiểm Tra
      </Button>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="danh sách lịch phòng"
        className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-4xl mx-auto mt-40 outline-none"
        overlayClassName="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-start z-50 overflow-y-auto"
      >
        <h2 className="text-lg font-semibold mb-4">Lịch đặt phòng</h2>

        <div className="grid grid-cols-2">
          <Calendar
            tileClassName={tileClassName}
            locale="vi-VN"
            className="w-full"
          />

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Chi tiết các đơn đặt:</h3>
            {room.bookingItems.length > 0 ? (
              <div className="flex flex-col gap-3">
                {room.bookingItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b py-1 text-sm"
                  >
                    <span>
                      {index + 1}. Nhận: {formatDate(item.booking.checkInDate)}{" "}
                      - Trả: {formatDate(item.booking.checkOutDate)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p>Không có lịch đặt phòng nào</p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CheckDateInOut;
