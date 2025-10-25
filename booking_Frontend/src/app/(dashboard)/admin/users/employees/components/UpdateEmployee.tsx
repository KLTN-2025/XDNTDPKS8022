import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { Employee } from "./TableEmployee";
import axios from "axios";
import { URL_API } from "@/lib/fetcher";
import toast from "react-hot-toast";
import Mutate from "@/hook/Mutate";
interface IUpdateEmployee {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  employee: Employee | null;
}

const UpdateEmployee = ({ isOpen, setIsOpen, employee }: IUpdateEmployee) => {
  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    position: "FRONT_DESK",
    department: "FRONT_DESK",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        phone: employee.phone || "",
        position: employee.employee?.position || "FRONT_DESK",
        department: employee.employee?.department || "FRONT_DESK",
      });
    }
  }, [employee]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${URL_API}/api/auth/employee/${employee?.employee?.id}`,
        formData,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setIsOpen(false);
        Mutate(`${URL_API}/api/auth/employee`);
        toast.success("Cập nhật nhân viên thành công");
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Cập nhật nhân viên thất bại");
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-6xl mx-auto mt-40 outline-none"
        overlayClassName="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-start z-50"
        contentLabel="Thêm nhân viên mới"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Chỉnh sửa nhân viên</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Họ</Label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Tên</Label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                type="email"
                value={employee?.email}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                name="phone"
                value={formData?.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1  gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Phòng ban</Label>
              <select
                name="department"
                value={formData?.department}
                onChange={handleSelect}
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
            <Button type="submit">Cập nhật nhân viên</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default UpdateEmployee;
