"use client";
import React, { useState } from "react";
import RoomTypesAdminPage from "./components/TableRoomtype";
import useSWR from "swr";
import CreateRoomtype from "./components/CreateRoomtype";
import ElegantTitle from "@/app/(dashboard)/components/TitleDashboard/ElegantTitle";
import SearchForm from "@/app/(dashboard)/components/searchPage/SearchForm";
import { useDebounce } from "../../../../../../hook/Debounce";
import Pagination from "@/app/(dashboard)/components/Pagination/Pagination";

const Page = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const debouncedSearch = useDebounce(search, 800);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_URL_API}/api/roomtype?search=${debouncedSearch}&page=${page}&limit=${limit}&order=${order}`
  );

  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl">
      <ElegantTitle title="Quản Lý Loại Phòng" className="ml-5 mb-5" />
      <div className="flex justify-between items-center">
        {" "}
        <SearchForm
          placeholder="Tìm Kiếm Loại Phòng"
          search={search}
          setPage={setPage}
          setSearch={setSearch}
        />
        <CreateRoomtype />
      </div>
      <RoomTypesAdminPage
        roomTypes={data?.roomType || []}
        setOrder={setOrder}
        order={order}
      />
      <Pagination
        page={page}
        setPage={setPage}
        totalPages={data?.pagination?.totalPages || 1}
      />
    </div>
  );
};

export default Page;
