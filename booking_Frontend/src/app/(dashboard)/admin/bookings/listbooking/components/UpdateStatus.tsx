"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { URL_API } from "@/lib/fetcher";
import axios from "axios";
import Mutate from "@/hook/Mutate";
import Invoice from "./Invoice";
import { IBooking } from "./bookingad";
interface IUpdateStatus {
  booking: IBooking;
}
const UpdateStatus = ({ booking }: IUpdateStatus) => {
  const handleUpdateStatus = async () => {
    const res = await axiosInstance.put(`/api/booking/${booking.id}`);

    if (res.data) {
      if (res.data.data.status === "CHECKED_IN") {
        Mutate(`${URL_API}/api/booking`);
        toast.success("Đã nhận phòng");
      } else if (res.data.data.status === "CHECKED_OUT") {
        Mutate(`${URL_API}/api/booking`);
        toast.success("Đã trả phòng");
      }
    }
  };
  // huy
  const handleCancelledStatus = async () => {
    try {
      const res = await axios.put(
        `${URL_API}/api/booking/cancelled/${booking.id}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data) {
        Mutate(`${URL_API}/api/booking`);
        toast.success("Phòng Đã Được Hủy");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const deleteBooking = async () => {
    try {
      const res = await axios.delete(
        `${URL_API}/api/booking/employee/${booking.id}`,
        {
          withCredentials: true,
        }
      );

      if (res.data) {
        Mutate(`${URL_API}/api/booking?idNumber=`);
        toast.success("Phòng Đã Được xóa");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <DropdownMenu>
        {" "}
        <DropdownMenuTrigger className="text-center ml-8">
          <MoreHorizontal className="w-5 h-5 cursor-pointer " />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {" "}
          <DropdownMenuLabel>Hành Động</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {" "}
              <Invoice booking={booking} />
            </DropdownMenuItem>

            <DropdownMenuItem>
              <button
                className="text-green-600 hover:text-green-800 mr-2 cursor-pointer"
                onClick={handleUpdateStatus}
                disabled={booking.status === "CHECKED_OUT"}
              >
                {booking.status === "PENDING"
                  ? "Nhận Phòng"
                  : booking.status === "CHECKED_IN"
                  ? "Trả Phòng"
                  : "Hoàn Thành"}
              </button>
            </DropdownMenuItem>
            {booking.status !== "CHECKED_OUT" && (
              <DropdownMenuItem>
                <button
                  className="text-yellow-600 hover:text-yellow-800"
                  onClick={handleCancelledStatus}
                >
                  Hủy Phòng
                </button>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="text-red-600 hover:text-red-800">
                    xóa Phòng
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Bạn Có Chắc Chắn Muốn Xóa Không ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Không Thể Khôi Phục Dữ Liệu Này
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteBooking}>
                      Xác Nhận
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UpdateStatus;
