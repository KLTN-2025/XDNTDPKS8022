"use client";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { URL_API } from "@/lib/fetcher";
import toast from "react-hot-toast";

interface IRoomType {
  id: string;
  name: string;
  maxOccupancy: number;
}

interface ISeearchForm {
  setSearchParams: (value: any) => void;
  searchParams: any;
  setLoading: (value: boolean) => void;
  // onSubmit: (e: React.FormEvent) => Promise<void>;
  setAvailableRooms: (value: any) => void;
}
const SearchForm = ({
  searchParams,
  setSearchParams,
  setAvailableRooms,
  setLoading,
}: ISeearchForm) => {
  const { data: roomType } = useSWR(`${URL_API}/api/roomtype`);
  const [isSticky, setIsSticky] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSearchParams((prev: any) => ({
      ...prev,
      [name]: name === "customer" ? Number(value) : value,
    }));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 768) {
        setIsSticky(window.scrollY > 2000);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchParams.checkInDate || !searchParams.checkOutDate) {
      console.log("Thiếu ngày check-in hoặc check-out");
      toast.error(
        "Vui lòng chọn đầy đủ ngày nhận và ngày trả phòng trước khi tìm!"
      );
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `${URL_API}/api/room/customer?customer=${searchParams.customer}&checkIn=${searchParams.checkInDate}&checkOut=${searchParams.checkOutDate}&roomType=${searchParams.roomType}`
      );
      if (res.data && res.data.length > 0) {
        setAvailableRooms(res?.data || []);
        setLoading(false);
      } else {
        toast.error(`Hiện Tại Phòng Chúng Tôi Chưa có`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi tìm phòng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`max-w-4xl mx-auto my-8  bg-white rounded-lg shadow-md transition-all duration-300 
        ${
          isSticky
            ? "fixed -top-8 left-0 p-2 right-0 z-40 max-w-full  shadow-lg"
            : "p-6"
        }
      `}
    >
      <form
        className={`flex flex-col md:grid ${
          isSticky ? "md:grid-cols-5" : "md:grid-cols-4"
        } lg:grid-cols-${isSticky ? "5" : "4"} gap-4`}
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          {!isSticky && (
            <label
              htmlFor="checkInDate"
              className="mb-2 font-medium text-gray-700"
            >
              Ngày nhận phòng
            </label>
          )}
          <input
            type="date"
            id="checkInDate"
            name="checkInDate"
            value={searchParams.checkInDate}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="flex flex-col">
          {!isSticky && (
            <label
              htmlFor="checkOutDate"
              className="mb-2 font-medium text-gray-700"
            >
              Ngày trả phòng
            </label>
          )}
          <input
            type="date"
            id="checkOutDate"
            name="checkOutDate"
            value={searchParams.checkOutDate}
            onChange={handleChange}
            disabled={!searchParams.checkInDate}
            min={searchParams.checkInDate}
            required
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          {!isSticky && (
            <label
              htmlFor="customer"
              className="mb-2 font-medium text-gray-700"
            >
              Số Khách
            </label>
          )}
          <select
            id="customer"
            name="customer"
            value={searchParams.customer}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[...Array(6)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} khách
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          {!isSticky && (
            <label
              htmlFor="roomType"
              className="mb-2 font-medium text-gray-700"
            >
              Loại phòng
            </label>
          )}
          <select
            id="roomType"
            name="roomType"
            value={searchParams.roomType}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            {roomType?.roomType?.map((item: IRoomType) => (
              <option value={item.name} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {isSticky ? (
          <div className="flex flex-col">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md transition duration-200"
            >
              Tìm phòng trống
            </button>
          </div>
        ) : (
          <div className="col-span-full w-full ">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 w-full"
            >
              Tìm phòng trống
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchForm;
