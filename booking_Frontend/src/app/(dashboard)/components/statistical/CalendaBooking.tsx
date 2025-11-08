"use client";
import { URL_API } from "@/lib/fetcher";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

moment.locale("vi");
const localizer = momentLocalizer(moment);

interface BookingEvent {
  id: string;
  bookingItems: {
    room: {
      roomNumber: number;
      roomType: { name: string; photoUrls: string };
    };
  }[];
  customer: { user: { firstName: string; lastName: string } };
  checkInDate: string;
  checkOutDate: string;
}

const CalendarBooking = () => {
  const { data } = useSWR<{ bookings: BookingEvent[] }>(
    `${URL_API}/api/booking`
  );

  const events = useMemo(() => {
    if (!data) return [];
    return data.bookings.map((booking) => ({
      id: booking.id,
      title: `${booking.customer.user.firstName} ${booking.customer.user.lastName}`,
      start: new Date(booking.checkInDate),
      end: new Date(booking.checkOutDate), // Đã sửa: không cần +1 ngày
      booking,
    }));
  }, [data]);

  console.log(events);

  const [date, setDate] = useState(new Date());

  const CustomEvent = ({ event }: any) => {
    const b = event.booking;
    const checkInDate = moment(b.checkInDate).format("DD/MM");
    const checkOutDate = moment(b.checkOutDate).format("DD/MM");

    return (
      <div className="bg-accent text-accent-foreground p-2 rounded-md shadow-sm border-l-4 border-primary h-full overflow-hidden">
        <div className="font-semibold text-xs truncate">
          {b.customer.user.firstName} {b.customer.user.lastName}
        </div>
        <div className="text-xs opacity-90 truncate">
          P{b.bookingItems[0].room.roomNumber} -{" "}
          {b.bookingItems[0].room.roomType.name}
        </div>
        <div className="text-xs opacity-75 mt-1">
          {checkInDate} → {checkOutDate}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6">
      <Card className="bg-card border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-card-foreground flex items-center">
            <CalendarDays className="w-5 h-5 mr-2 text-primary" />
            Lịch Đặt Phòng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="calendar-container" style={{ height: "700px" }}>
            <Calendar
              localizer={localizer}
              events={events}
              date={date}
              onNavigate={(newDate) => setDate(newDate)}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              messages={{
                today: "Hôm nay",
                previous: "Trước",
                next: "Tiếp",
                month: "Tháng",
                week: "Tuần",
                day: "Ngày",
                agenda: "Lịch biểu",
                date: "Ngày",
                time: "Giờ",
                event: "Sự kiện",
                noEventsInRange: "Không có sự kiện trong khoảng thời gian này",
                showMore: (total) => `+${total} sự kiện nữa`,
              }}
              components={{
                event: CustomEvent,
              }}
              // Thêm các props mới để xử lý sự kiện chồng chéo
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: "transparent",
                  zIndex: 2,
                },
              })}
              className="modern-calendar"
              // Sử dụng month view với layout tự động
              views={["month"]}
            />
          </div>
        </CardContent>
      </Card>

      <style jsx global>{`
        .modern-calendar {
          font-family: inherit;
        }

        .rbc-calendar {
          background: transparent;
        }

        .rbc-header {
          background: hsl(var(--muted));
          color: hsl(var(--muted-foreground));
          font-weight: 600;
          padding: 12px 8px;
          border-bottom: 1px solid hsl(var(--border));
        }

        .rbc-month-view {
          border: 1px solid hsl(210, 40%, 90%);
          border-radius: 8px;
          overflow: hidden;
          background-color: hsl(210, 60%, 99%);
        }
        .rbc-event {
          background-color: #e6f7ff !important; /* Màu xanh nhạt */
          border: 1px solid #91d5ff !important;
          border-left: 4px solid #1890ff !important;
          color: #0050b3 !important;
          border-radius: 4px;
          padding: 2px 4px;
        }

        .rbc-event:hover {
          background-color: #bae7ff !important; /* Màu xanh đậm hơn khi hover */
          box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
        }

        .rbc-date-cell {
          padding: 8px;
          color: hsl(var(--foreground));
        }

        .rbc-today {
          background-color: hsl(var(--accent) / 0.1);
        }

        .rbc-toolbar {
          margin-bottom: 20px;
          padding: 0 10px;
        }

        .rbc-toolbar button {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .rbc-toolbar button:hover {
          background: hsl(var(--primary) / 0.9);
        }

        .rbc-toolbar button.rbc-active {
          background: hsl(var(--accent));
        }

        .rbc-toolbar-label {
          font-size: 18px;
          font-weight: 600;
          color: hsl(var(--foreground));
        }

        .rbc-day-bg {
          border-right: 1px solid hsl(var(--border));
        }

        .rbc-month-row {
          border-bottom: 1px solid hsl(var(--border));
        }
      `}</style>
    </div>
  );
};

export default CalendarBooking;
