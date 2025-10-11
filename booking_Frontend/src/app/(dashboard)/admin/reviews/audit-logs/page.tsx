"use client";
import { URL_API } from "@/lib/fetcher";
import React, { useState } from "react";
import useSWR from "swr";
import TableAuditLog from "./components/TableAuditLog";
import { Button } from "@/components/ui/button";

const Page = () => {
  const today = new Date();
  const [mode, setMode] = useState("Ngày");
  const dateValue = {
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  };
  const getDisplayDate = () => {
    if (mode === "Ngày") {
      return `?day=${dateValue.day}`;
    }
    if (mode === "Tháng") {
      return `?month=${dateValue.month}&year=${dateValue.year}`;
    }
    if (mode === "Năm") {
      return `?year=${dateValue.year}`;
    }
  };
  const { data, isLoading } = useSWR(
    `${URL_API}/api/auth/auditlog${getDisplayDate()}`
  );

  // Nếu còn loading

  if (isLoading) return <div>loading....</div>;
  return (
    <div className="bg-white p-5">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-6">Nhật Ký Hoạt Động</h1>
        <div className="flex gap-6">
          {["Ngày", "Tháng", "Năm"].map((item) => (
            <Button
              key={item}
              variant={"outline"}
              className="cursor-pointer"
              value={mode}
              onClick={() => setMode(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
      <TableAuditLog auditLogs={data} />
    </div>
  );
};

export default Page;
