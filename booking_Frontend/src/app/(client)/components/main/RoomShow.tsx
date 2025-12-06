"use client";
import React, { useEffect, useState } from "react";

import { URL_API } from "@/lib/fetcher";
import ListRoom, { RoomCustomer } from "./ListRoom";
import ButtonSeclectType from "./ButtonSeclectType";
import Link from "next/link";
import useSWR from "swr";

const RoomShow = () => {
  const [typeRoom, setTypeRoom] = useState("");
  const { data, isLoading } = useSWR<RoomCustomer[]>(
    `${URL_API}/api/room/customer?roomType=${typeRoom}`
  );

  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  if (!data) return <div>Không có dữ liệu phòng</div>;
  return (
    <>
      {" "}
      <div className="text-center my-12 ">
        <h1 className=" text-2xl md:text-5xl font-bold  mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Thiên đường nghỉ dưỡng
        </h1>
        <p className="text-xl text-gray-600 md:max-w-2xl mx-10 md:mx-auto ">
          Khám phá những phòng nghỉ tuyệt đẹp với thiết kế hiện đại và tiện nghi
          đẳng cấp
        </p>
      </div>
      <div className="space-y-8 text-center ">
        {/* Phòng Đơn */}
        <div>
          <div className="flex flex-col md:justify-between items-center mb-5 mx-2">
            {" "}
            <ButtonSeclectType setTypeRoom={setTypeRoom} typeRoom={typeRoom} />
            <div>
              {typeRoom && data.length > 0 && (
                <Link
                  href={`/rooms/${data[0].roomTypeId}`}
                  className="text-blue-600 font-semibold underline "
                >
                  Xem thêm các phòng của ({typeRoom})
                </Link>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 2xl:gap-3 ">
            {data && data.length > 0 ? (
              data.slice(0, 10).map((room, index) => (
                <div
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                  key={`single-${index}`}
                >
                  {" "}
                  <ListRoom roomtype={room} />
                </div>
              ))
            ) : (
              <div className="">Phòng Không Có Sẵn</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomShow;
