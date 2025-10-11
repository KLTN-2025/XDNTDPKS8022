"use client";
import { URL_API } from "@/lib/fetcher";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, Bed } from "lucide-react";

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

const Page = () => {
  const { data } = useSWR<{ bookings: BookingEvent[] }>(
    `${URL_API}/api/booking`
  );

  const events = useMemo(() => {
    if (!data) return [];
    return data.bookings.map((booking) => ({
      id: booking.id,
      title: `${booking.customer.user.firstName} ${booking.customer.user.lastName}`,
      start: new Date(booking.checkInDate),
      end: new Date(
        new Date(booking.checkOutDate).getTime() + 24 * 60 * 60 * 1000
      ),
      booking,
    }));
  }, [data]);

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

  const stats = useMemo(() => {
    if (!data) return { totalBookings: 0, todayCheckIns: 0, occupiedRooms: 0 };

    const today = moment().startOf("day");
    const todayCheckIns = data.bookings.filter((booking) =>
      moment(booking.checkInDate).isSame(today, "day")
    ).length;

    const occupiedRooms = data.bookings.filter((booking) => {
      const checkIn = moment(booking.checkInDate);
      const checkOut = moment(booking.checkOutDate);
      return today.isBetween(checkIn, checkOut, "day", "[]");
    }).length;

    return {
      totalBookings: data.bookings.length,
      todayCheckIns,
      occupiedRooms,
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Quản Lý Đặt Phòng Khách Sạn
            </h1>
            <p className="text-muted-foreground">
              Theo dõi và quản lý các đặt phòng một cách hiệu quả
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <CalendarDays className="w-4 h-4 mr-2" />
            Thêm Đặt Phòng
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Tổng Đặt Phòng
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.totalBookings}
            </div>
            <p className="text-xs text-muted-foreground">
              Tất cả đặt phòng hiện tại
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Check-in Hôm Nay
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {stats.todayCheckIns}
            </div>
            <p className="text-xs text-muted-foreground">
              Khách check-in trong ngày
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Phòng Đang Sử Dụng
            </CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {stats.occupiedRooms}
            </div>
            <p className="text-xs text-muted-foreground">
              Phòng hiện đang có khách
            </p>
          </CardContent>
        </Card>
      </div>

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
              className="modern-calendar"
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
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          overflow: hidden;
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

export default Page;
