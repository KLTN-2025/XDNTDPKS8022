import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import axiosInstance from "@/lib/axios";
import { URL_API } from "@/lib/fetcher";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";

interface IDisabledUser {
  employee: {
    id: string;
    status: "ACTIVE" | "INACTIVE" | string;
  };
}
const DisabledUser = ({ employee }: IDisabledUser) => {
  const handleDisable = async () => {
    const nextStatus = employee.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await axios.put(
        `${URL_API}/api/auth/employee/disabled/${employee.id}`,
        {
          action: nextStatus,
        },
        {
          withCredentials: true,
        }
      );
      mutate(`${URL_API}/api/auth/employee`);
      toast.success(
        `${employee.status === "ACTIVE" ? "đã vô hiệu hóa " : "Kích hoạt"}`
      );
    } catch (error: any) {
      toast.error(error.response.data.message || "Có lỗi xảy ra");
    }
  };
  return (
    <>
      <DropdownMenuItem className="text-destructive" onClick={handleDisable}>
        {employee.status === "ACTIVE" ? "Vô hiệu hóa" : "Kích hoạt"}
      </DropdownMenuItem>
    </>
  );
};

export default DisabledUser;
