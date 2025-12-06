"use client";
import React from "react";
import Link from "next/link";
import AccountUser from "./AccountUser";
import { useUserStore } from "@/hook/useUserStore";

const HeaderTop = () => {
  const { user } = useUserStore(); // lấy user global từ store

  return (
    <div className="h-8 bg-black shadow-md">
      <div className="container mx-auto px-4 md:px-8 lg:px-52">
        <div className="flex justify-center lg:justify-between items-center h-full text-white">
          <div className="hidden lg:block text-xs md:text-sm font-medium tracking-wide mt-2">
            Chào Mừng Bạn Đến Với Khách Sạn Của Chúng Tôi
          </div>

          <div className="flex items-center space-x-4 text-sm mt-2">
            {user ? (
              <AccountUser userType={user.userType} lastName={user.lastName} />
            ) : (
              <div className="flex items-center space-x-4">
                <Link href={"/signIn"}>
                  <button className="hover:text-yellow-200 transition-colors duration-200 hover:cursor-pointer">
                    Đăng Nhập
                  </button>
                </Link>
                <div className="h-4 border-r border-white" />
                <Link href={"/signUp"}>
                  <button className="hover:text-yellow-200 transition-colors duration-200 hover:cursor-pointer">
                    Đăng Kí
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;
