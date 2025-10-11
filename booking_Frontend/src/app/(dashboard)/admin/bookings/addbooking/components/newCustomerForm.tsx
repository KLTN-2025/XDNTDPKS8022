"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
export interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
}

interface ICustomerProps {
  setFormCustomer: React.Dispatch<React.SetStateAction<CustomerFormData>>;
  formCustomer: CustomerFormData;
}
const NewCustomerForm = ({ formCustomer, setFormCustomer }: ICustomerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL_API}/api/auth/createCustomer`,
        formCustomer,
        {
          withCredentials: true,
        }
      );
      if (res.data) {
        toast.success("Khách Hàng Mới Đã Được Thêm");
        setIsOpen(false);
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Lỗi Khi Thêm Khách Hàng");
    }
  };
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
          setFormCustomer({
            email: "",
            firstName: "",
            lastName: "",
            phone: "",
            idNumber: "",
          });
        }}
        className="cursor-pointer w-fit "
      >
        Khách Hàng Mới
      </Button>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          contentLabel="Thêm Khách Hàng"
          className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-6xl mx-auto mt-40 outline-none "
          overlayClassName="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-start z-50 overflow-auto"
        >
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold mb-4">
              Thông tin khách hàng mới
            </h2>
            <X
              size={30}
              className="text-red-500 hover:text-red-600 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </div>
          <form onSubmit={handleCreateCustomer} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ
                </label>
                <Input
                  type="text"
                  placeholder="Nhập họ"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formCustomer.firstName}
                  onChange={(e) =>
                    setFormCustomer((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên
                </label>
                <Input
                  type="text"
                  placeholder="Nhập tên"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formCustomer.lastName}
                  onChange={(e) =>
                    setFormCustomer((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="Nhập email"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formCustomer.email}
                  onChange={(e) =>
                    setFormCustomer((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điện Thoại
                </label>
                <Input
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formCustomer.phone}
                  onChange={(e) =>
                    setFormCustomer((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CCCD
              </label>
              <Input
                type="tel"
                placeholder="Nhập số điện thoại"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formCustomer.idNumber}
                onChange={(e) =>
                  setFormCustomer((prev) => ({
                    ...prev,
                    idNumber: e.target.value,
                  }))
                }
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Tạo Khách Hàng
            </button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default NewCustomerForm;
