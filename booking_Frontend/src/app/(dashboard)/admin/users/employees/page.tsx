"use client";
import React, { useEffect, useState } from "react";
import EmployeeTable from "./components/TableEmployee";
import useSWR from "swr";
import { fetcher, URL_API } from "@/lib/fetcher";
import { useDebounce } from "../../../../../../hook/Debounce";
import Pagination from "@/app/(dashboard)/components/Pagination/Pagination";
import LimitSelector from "@/app/(dashboard)/components/Pagination/SelectRecord";
import ElegantTitle from "@/app/(dashboard)/components/TitleDashboard/ElegantTitle";

const Page = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const debouncedSearch = useDebounce(search, 400); // gọi API sau khi ngừng gõ 0.4s
  const { data, isLoading } = useSWR(
    `${URL_API}/api/auth/employee?search=${encodeURIComponent(
      debouncedSearch || ""
    )}&page=${currentPage}&limit=${limit}`,
    fetcher
  );

  // Kiểm tra trạng thái loading và hiển thị thông báo
  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl">
      <ElegantTitle title="Quản Lý Nhân Viên" className="mb-5" />
      <EmployeeTable
        employee={data?.employee.result || []}
        search={search}
        setSearchTerm={setSearch}
        setCurrentPage={setCurrentPage}
      />
      <Pagination
        page={currentPage}
        setPage={setCurrentPage}
        totalPages={data?.employee?.totalPages || 1}
      />
      <LimitSelector onChange={setLimit} value={limit} />
    </div>
  );
};

export default Page;
