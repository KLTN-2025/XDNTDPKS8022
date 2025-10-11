"use client";

import React, { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import Mutate from "../../../../../../../hook/Mutate";
import { URL_API } from "@/lib/fetcher";

const statuses = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

function getMaintenanceStatusText(status: string): string {
  switch (status) {
    case "SCHEDULED":
      return "Đã lên lịch";
    case "IN_PROGRESS":
      return "Đang thực hiện";
    case "COMPLETED":
      return "Đã hoàn thành";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return "Không xác định";
  }
}

const UpdateStatus = ({ status, id }: { status: string; id: string }) => {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(status);

  useEffect(() => {
    setSelectedStatus(status);
  }, [status]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[240px] justify-between"
        >
          {selectedStatus
            ? getMaintenanceStatusText(selectedStatus)
            : "Chọn trạng thái"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Tìm trạng thái..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy</CommandEmpty>
            <CommandGroup>
              {statuses.map((s) => (
                <CommandItem
                  key={s}
                  value={s}
                  onSelect={() => {
                    setSelectedStatus(s);
                    setOpen(false);
                    console.log("Trạng thái mới:", s);
                    // Gọi API update tại đây nếu cần
                    try {
                      axiosInstance.put(`/api/maintenance/${id}`, {
                        status: s,
                      });
                      // Cập nhật trạng thái trong giao diện người dùng nếu cần
                      toast.success(
                        `Cập nhật trạng thái thành công: ${getMaintenanceStatusText(
                          s
                        )}`
                      );
                      Mutate(`${URL_API}/api/maintenance`);
                    } catch (error: any) {
                      toast.error(
                        error.response?.data?.message ||
                          "Cập nhật trạng thái thất bại"
                      );
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedStatus === s ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {getMaintenanceStatusText(s)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default UpdateStatus;
