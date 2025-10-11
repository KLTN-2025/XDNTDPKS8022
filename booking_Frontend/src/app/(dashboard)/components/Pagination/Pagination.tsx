// components/Pagination/Pagination.tsx
"use client";

import React from "react";

interface PaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  setPage,
  totalPages,
}) => {
  // Hàm xử lý chuyển trang trước
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // Hàm xử lý chuyển trang tiếp theo
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="flex justify-end mr-4 items-center mt-4 space-x-2">
      {/* Nút Previous */}
      <button
        onClick={handlePrevPage}
        disabled={page === 1}
        className={`px-3 py-1 rounded font-semibold ${
          page === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-blue-500 text-gray-50 hover:bg-blue-600"
        }`}
      >
        Trước
      </button>

      {/* Hiển thị trang hiện tại và tổng số trang */}
      <span className="px-3 py-1 text-gray-700">
        Trang {page} của {totalPages}
      </span>

      {/* Nút Next */}
      <button
        onClick={handleNextPage}
        disabled={page === totalPages}
        className={`px-3 py-1 rounded font-semibold ${
          page === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-blue-500 text-gray-50 hover:bg-blue-600"
        }`}
      >
        Tiếp theo
      </button>
    </div>
  );
};

export default Pagination;
