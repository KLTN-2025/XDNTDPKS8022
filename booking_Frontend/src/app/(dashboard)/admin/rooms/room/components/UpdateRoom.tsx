/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Pencil, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import AddImageToRoom from "./AddImageToRoom";
import ImageToRoom from "./DeleteImageToRoom";
import Mutate from "../../../../../../../hook/Mutate";

interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  notes: string;
  roomTypeId: string;
  images: { id: string; imageUrl: string }[];
}

interface RoomProps {
  data: any[];
  rooms: Room;
}
const UpdateRoom = ({ data, rooms }: RoomProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    roomNumber: rooms.roomNumber || "",
    floor: rooms.floor,
    status: rooms.status,
    notes: rooms.notes,
    roomTypeId: rooms.roomTypeId,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "floor" ? Number(value) : value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_URL_API}/api/room/${rooms.id}`,
        formData
      );
      if (res.data) {
        toast.success("Cập nhật thành công!");
        setIsOpen(false);
        Mutate(`${process.env.NEXT_PUBLIC_URL_API}/api/room`);
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Cập nhật không thành công!");
    }
  };
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="cursor-pointer text-blue-500 hover:text-blue-600 mr-2"
        onClick={() => setIsOpen(true)}
      >
        <Pencil className="h-4 w-4 " />
      </Button>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          contentLabel="Cập nhật phòng"
          className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-6xl mx-auto mt-10 outline-none "
          overlayClassName="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-start z-50 overflow-y-auto"
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Image
                  alt="ảnh"
                  src={rooms.images[0].imageUrl}
                  width={70}
                  height={70}
                  className="rounded-full h-10 w-10 "
                />{" "}
                <h2 className="text-xl font-bold">Room #{rooms.roomNumber}</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Room Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số phòng
                  </label>
                  <Input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Floor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tầng
                  </label>
                  <Input
                    type="number"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="AVAILABLE">Trống</option>
                    <option value="OCCUPIED">Đang sử dụng</option>
                    <option value="MAINTENANCE">Bảo trì</option>
                  </select>
                </div>

                {/* Room Type ID */}

                <div className="">
                  <label
                    htmlFor="roomTypeId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Loại phòng
                  </label>
                  <select
                    id="roomTypeId"
                    name="roomTypeId"
                    value={formData.roomTypeId}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Chọn Loại Phòng
                    </option>
                    {data.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  name="notes"
                  value={formData.notes || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Image URLs */}
              <ImageToRoom rooms={rooms} />
              <AddImageToRoom roomId={rooms.id} />
              {/* Submit Button */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant={"ghost"}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-red-500  cursor-pointer"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600  cursor-pointer"
                >
                  Cập Nhập
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UpdateRoom;
