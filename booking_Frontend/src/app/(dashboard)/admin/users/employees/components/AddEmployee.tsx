/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axios";
import { URL_API } from "@/lib/fetcher";
import { Label } from "@radix-ui/react-label";
import { UserPlus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { mutate } from "swr";
const AddEmployee = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    position: "FRONT_DESK",
    department: "FRONT_DESK",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      position: prev.department,
    }));
  }, [formData.department]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setFormData((prev) => ({
      ...prev,
      department: selectedValue,
    }));
  };
  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(`/api/auth/employee`, formData);
      if (res.data) {
        mutate(`${URL_API}/api/auth/employee`);
        toast.success("Thêm Nhân Viên Thành Công");
        setIsOpen(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          position: "",
          department: "FRONT_DESK",
        });
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "lỗi");
      console.log("lỗi là", error.response.data.message);
    }
  };
  return (
    <>
      <Button
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <UserPlus className="h-4 w-4" />
        Thêm nhân viên
      </Button>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-6xl mx-auto mt-40 outline-none"
          overlayClassName="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-start z-50"
          contentLabel="Thêm nhân viên mới"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Thêm nhân viên mới</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmitCreate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Họ</Label>
                <Input
                  name="firstName"
                  onChange={handleChange}
                  value={formData.firstName}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Tên</Label>
                <Input
                  name="lastName"
                  onChange={handleChange}
                  value={formData.lastName}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  name="phone"
                  onChange={handleChange}
                  value={formData.phone}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                name="password"
                type="password"
                onChange={handleChange}
                value={formData.password}
              />
            </div>

            <div className="grid grid-cols-1  gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Phòng ban</Label>
                <select
                  name="department"
                  onChange={handleSelect}
                  value={formData.department}
                  className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="FRONT_DESK">Lễ tân</option>
                  <option value="MAINTENANCE">Bảo trì</option>
                  <option value="MANAGEMENT">Quản lý</option>
                  <option value="ACCOUNTING">Kế toán</option>
                </select>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="position">Vị trí</Label>
                <Input name="position" onChange={handleChange} />
              </div> */}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit">Thêm nhân viên</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default AddEmployee;
