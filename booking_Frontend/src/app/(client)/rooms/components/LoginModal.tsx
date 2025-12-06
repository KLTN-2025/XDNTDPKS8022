"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/hook/useUserStore";
import { URL_API } from "@/lib/fetcher";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";

interface ILoginModal {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

const generateUUID = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const LoginModal = ({ isLogin, setIsLogin }: ILoginModal) => {
  const { login } = useUserStore();

  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${URL_API}/api/auth/login`, formData, {
        withCredentials: true,
      });

      if (res.data && res.data.accessToken) {
        const token = res.data.accessToken;

        // decode token để lấy thông tin user
        const decoded = jwtDecode(token) as {
          id: string;
          lastName: string;
          userType: string;
          role: string;
        };
        localStorage.setItem("token", token);
        localStorage.setItem("sessionId", decoded.id || generateUUID());
        login({
          id: decoded.id,
          lastName: decoded.lastName,
          userType: decoded.userType,
          role: decoded.role,
          token,
        });
        setIsLogin(false);
      }
      toast.success("Đăng nhập thành công");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Đăng nhập không thành công");
    } finally {
      setIsLogin(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  return (
    <Modal
      isOpen={isLogin}
      onRequestClose={() => setIsLogin(false)}
      contentLabel="Payment Confirmation"
      className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md mx-auto mt-20 outline-none relative"
      overlayClassName="fixed inset-0 bg-black/10 flex justify-center items-start z-50 overflow-auto"
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Đăng nhập
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label
              htmlFor="email"
              className="text-lg text-gray-700 font-medium block mb-2"
            >
              Email
            </Label>
            <Input
              name="email"
              type="email"
              className="w-full px-5 py-3 text-lg border-2  transition-all"
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="text-lg text-gray-700 font-medium block mb-2"
            >
              Mật Khẩu
            </Label>
            <Input
              name="password"
              type="password"
              className="w-full px-5 py-3 text-lg border-2  transition-all"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {message && (
            <div className="text-lg text-center text-red-500 animate-fade-in mt-4">
              {message}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Đăng nhập
          </button>
          <Link
            href={"/signUp"}
            className="text-sm text-blue-500 underline hover:text-blue-600 text-end"
          >
            chưa có tài khoản ?
          </Link>
        </form>
      </div>
      <X
        onClick={() => {
          setIsLogin(false);
        }}
        className="hover:text-red-600 cursor-pointer w-7 h-7 absolute top-2 right-2"
      />
    </Modal>
  );
};

export default LoginModal;
