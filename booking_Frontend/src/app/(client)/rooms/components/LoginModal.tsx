"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { URL_API } from "@/lib/fetcher";
import { getUser } from "@/lib/getUser";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
interface ILoginModal {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  setIsProcessing: (value: boolean) => void;
}
const LoginModal = ({ isLogin, setIsLogin, setIsProcessing }: ILoginModal) => {
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
        localStorage.setItem("token", res.data.accessToken);
        toast.success("đăng Nhập Thành Công");
        await getUser();
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Đăng nhập không thành công");
    } finally {
      setIsLogin(false);
      setIsProcessing(false);
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
      className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md mx-auto mt-20 outline-none"
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
            chua co tai khoan ?
          </Link>
        </form>
        <button
          onClick={() => {
            setIsLogin(false);
            setIsProcessing(false);
          }}
          className="mt-2 text-gray-600 hover:text-gray-800"
        >
          Đóng
        </button>
      </div>
    </Modal>
  );
};

export default LoginModal;
