import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { URL_API } from "@/lib/fetcher";
import { PlusCircle, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import useSWR from "swr";
const RoleAdd = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roleName, setRoleName] = useState("");
  const { data: roles = [], mutate } = useSWR(`${URL_API}/api/role`);
  useEffect(() => {
    Modal.setAppElement("#root");
  });
  const handleChange = (permission: string) => {
    setPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRole = {
      id: Date.now(),
      name: roleName,
      permissions,
    };
    const optimisticRoles = [...roles, newRole];
    mutate(optimisticRoles, false);
    try {
      await axiosInstance.post("/api/role", {
        name: roleName,
        permissions,
      });
      await mutate();
      setIsOpen(false);
      setPermissions([]);
      toast.success("thêm quyền truy cập thành công");
    } catch (error: any) {
      console.error("Submit error", error);
      toast.error(error?.response.data.message);
      mutate(roles, false); // rollback nếu lỗi
    }
  };

  return (
    <>
      <Button
        className="flex items-center gap-2 cursor-pointer text-end"
        onClick={() => setIsOpen(!isOpen)}
      >
        <PlusCircle className="h-4 w-4" />
        Thêm Quyền Truy Cập
      </Button>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-6xl mx-auto mt-5 outline-none max-h-screen overflow-y-auto  "
        overlayClassName="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-start z-50"
        contentLabel="Thêm nhân viên mới"
      >
        <div className="space-y-4 mb-6 ">
          <div className="flex justify-between items-center mt-3">
            {" "}
            <h2 className="text-2xl font-bold ">Thêm Quyền Truy Cập Mới</h2>
            <X
              className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-700"
              onClick={() => setIsOpen(false)}
            />
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div className="space-y-2">
                <label htmlFor="roleName" className="text-sm font-medium">
                  Tên vai trò
                </label>
                <select
                  id="roleName"
                  className="w-full border rounded px-2 py-1"
                  onChange={(e) => setRoleName(e.target.value)}
                  value={roleName}
                >
                  <option value="" disabled>
                    chọn tên quyền
                  </option>
                  <option value="Quản Lý">Quản lý</option>
                  <option value="Bảo Trì">Bảo trì</option>
                  <option value="Lễ Tân">Lễ tân</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="permissions" className="text-sm font-medium">
                Phân Quyền
              </label>
              <div className="space-y-4">
                {/* --- BOOKING --- */}
                <div>
                  <label className="text-sm font-semibold block mb-2">
                    Đặt phòng (Booking)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "BOOKING_READ",
                      "BOOKING_CREATE",
                      "BOOKING_UPDATE",
                      "BOOKING_DELETE",
                    ].map((perm) => (
                      <label key={perm} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={perm}
                          className="rounded"
                          checked={permissions.includes(perm)}
                          onChange={() => handleChange(perm)}
                        />
                        <span>
                          {perm.split("_")[1].toLowerCase() === "read"
                            ? "Xem"
                            : perm.split("_")[1].toLowerCase() === "create"
                            ? "Tạo mới"
                            : perm.split("_")[1].toLowerCase() === "update"
                            ? "Cập nhật"
                            : "Xóa"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* --- CUSTOMER --- */}
                <div>
                  <label className="text-sm font-semibold block mb-2">
                    Khách hàng (Customer)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "CUSTOMER_READ",
                      "CUSTOMER_CREATE",
                      "CUSTOMER_UPDATE",
                      "CUSTOMER_DELETE",
                    ].map((perm) => (
                      <label key={perm} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={perm}
                          className="rounded"
                          checked={permissions.includes(perm)}
                          onChange={() => handleChange(perm)}
                        />
                        <span>
                          {perm.split("_")[1].toLowerCase() === "read"
                            ? "Xem"
                            : perm.split("_")[1].toLowerCase() === "create"
                            ? "Tạo mới"
                            : perm.split("_")[1].toLowerCase() === "update"
                            ? "Cập nhật"
                            : "Xóa"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* --- ROOM --- */}
                <div>
                  <label className="text-sm font-semibold block mb-2">
                    Phòng (Room)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "ROOM_READ",
                      "ROOM_CREATE",
                      "ROOM_UPDATE",
                      "ROOM_DELETE",
                    ].map((perm) => (
                      <label key={perm} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={perm}
                          className="rounded"
                          checked={permissions.includes(perm)}
                          onChange={() => handleChange(perm)}
                        />
                        <span>
                          {perm.split("_")[1].toLowerCase() === "read"
                            ? "Xem"
                            : perm.split("_")[1].toLowerCase() === "create"
                            ? "Tạo mới"
                            : perm.split("_")[1].toLowerCase() === "update"
                            ? "Cập nhật"
                            : "Xóa"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* --- MAINTENANCE --- */}
                <div>
                  <label className="text-sm font-semibold block mb-2">
                    Bảo trì (Maintenance)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["MAINTENANCE_READ", "MAINTENANCE_UPDATE"].map((perm) => (
                      <label key={perm} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={perm}
                          className="rounded"
                          checked={permissions.includes(perm)}
                          onChange={() => handleChange(perm)}
                        />
                        <span>
                          {perm.endsWith("READ") ? "Xem" : "Cập nhật"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* --- USER --- */}
                <div>
                  <label className="text-sm font-semibold block mb-2">
                    Nhân viên / Người dùng (User)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "USER_READ",
                      "USER_CREATE",
                      "USER_UPDATE",
                      "USER_DELETE",
                    ].map((perm) => (
                      <label key={perm} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={perm}
                          className="rounded"
                          checked={permissions.includes(perm)}
                          onChange={() => handleChange(perm)}
                        />
                        <span>
                          {perm.split("_")[1].toLowerCase() === "read"
                            ? "Xem"
                            : perm.split("_")[1].toLowerCase() === "create"
                            ? "Tạo mới"
                            : perm.split("_")[1].toLowerCase() === "update"
                            ? "Cập nhật"
                            : "Xóa"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* --- ROLE & REPORT --- */}
                <div>
                  <label className="text-sm font-semibold block mb-2">
                    Quyền & Báo cáo
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["ROLE_MANAGE", "REPORT_VIEW"].map((perm) => (
                      <label key={perm} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={perm}
                          className="rounded"
                          checked={permissions.includes(perm)}
                          onChange={() => handleChange(perm)}
                        />
                        <span>
                          {perm === "ROLE_MANAGE"
                            ? "Phân quyền"
                            : "Xem báo cáo"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Hủy
              </Button>
              <Button>Lưu</Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default RoleAdd;
