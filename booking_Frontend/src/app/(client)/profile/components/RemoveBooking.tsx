import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React from "react";
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
import axios from "axios";
import toast from "react-hot-toast";
import { mutate } from "swr";

interface RemoveBookingProps {
  bookingId: string;
}

const RemoveBooking = ({ bookingId }: RemoveBookingProps) => {
  const handleRemoveBooking = async () => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_URL_API}/api/booking/${bookingId}`,
        {
          withCredentials: true,
        }
      );
      if (res.data) {
        toast.success("Đơn đặt phòng đã được hủy thành công");
        mutate(`${process.env.NEXT_PUBLIC_URL_API}/api/booking/bookingUser`);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi hủy đơn");
      console.error(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer hover:text-red-500"
        >
          <X className="h-4 w-4 mr-2 " />
          Hủy phòng
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bạn có chắc chắn muốn hủy đặt phòng ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Đơn đặt phòng sẽ bị xóa vĩnh viễn.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemoveBooking}
            className="cursor-pointer"
          >
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveBooking;
