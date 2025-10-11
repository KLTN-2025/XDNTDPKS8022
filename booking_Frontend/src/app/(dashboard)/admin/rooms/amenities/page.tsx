"use client";
import React from "react";
import TableAmenies from "./components/TableAmenies";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import AddAmenies from "./components/AddAmenies";
import { Input } from "@/components/ui/input";

const Page = () => {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_URL_API}/api/amenity`,
    fetcher
  );

  // Nếu còn loading

  if (error) {
    return <div>Đã xảy ra lỗi: {error.message}</div>;
  }
  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }
  // Kiểm tra trạng thái loading và hiển thị thông báo
  return (
    <div className="bg-white p-6 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Input
            type="search"
            className="px-3 py-2"
            placeholder="tìm kiếm ..."
          />
        </div>
        <AddAmenies />
      </div>
      <TableAmenies amenities={data?.amenity || []} />
    </div>
  );
};

export default Page;
