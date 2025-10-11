/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import useAuth from "@/lib/authUser";
import axiosInstance from "@/lib/axios";

import { useState, ChangeEvent } from "react";
import { toast } from "react-hot-toast";

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileChangePassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("mật khẩu không khớp");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post(
        `/api/auth/user/changePassword`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data) {
        toast.success("Thay Đổi Mật Khẩu Thành Công");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white ">
      {/* Header */}
      <div className="bg-amber-600 p-6 text-center">
        <h2 className="text-3xl font-bold text-white">Đổi Mật Khẩu</h2>
        <p className="text-amber-100 mt-2">
          Vui lòng nhập thông tin để thay đổi mật khẩu
        </p>

        <ul className="text-white text-sm mt-4 list-disc list-inside text-left mx-auto max-w-md">
          <li>Mật khẩu phải có ít nhất 6 ký tự</li>
          <li>Chứa ít nhất 1 chữ cái viết hoa</li>
          <li>Chứa ít nhất 1 số</li>
          <li>Mật khẩu mới và xác nhận phải trùng khớp</li>
        </ul>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="animate-fade-in">
            <label
              htmlFor="currentPassword"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              required
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>

          <div className="animate-slide-in-left">
            <label
              htmlFor="newPassword"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Mật khẩu mới
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              required
              placeholder="Nhập mật khẩu mới"
            />
          </div>

          <div className="animate-slide-in-right">
            <label
              htmlFor="confirmPassword"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              required
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl shadow-lg text-lg font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] ${
              loading
                ? "bg-amber-400 cursor-not-allowed"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              "Đổi Mật Khẩu"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileChangePassword;
