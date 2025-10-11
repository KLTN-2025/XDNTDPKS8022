/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";

import { UploadButton } from "@/utils/uploadthing";
import axios from "axios";
import { ImageDownIcon, PlusCircle, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import Mutate from "../../../../../../../hook/Mutate";

type RoomFormData = {
  roomNumber: string;
  floor: number;
  status: string;
  notes: string;
  roomTypeId: string;
  imageUrls: string[];
};

interface RoomProps {
  data: any[];
}
const CreateRoom = ({ data }: RoomProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [formData, setFormData] = useState<RoomFormData>({
    roomNumber: "",
    floor: 1,
    status: "AVAILABLE",
    notes: "",
    roomTypeId: "",
    imageUrls: [],
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
  const handleRemoveImageIndex = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL_API}/api/room`,
        formData
      );
      if (res.data) {
        toast.success("Tạo Phòng Thành Công");
        setIsOpen(false);
        setFormData({
          roomNumber: "",
          floor: 1,
          status: "AVAILABLE",
          notes: "",
          roomTypeId: "",
          imageUrls: [],
        });
        Mutate(`${process.env.NEXT_PUBLIC_URL_API}/api/room`);
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Lỗi");
    }
  };
  return (
    <>
      <Button
        variant="default"
        className=" px-3 py-2 mb-2 cursor-pointer flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md shadow-sm mt-2.5"
        onClick={() => setIsOpen(true)}
      >
        <PlusCircle className="h-4 w-4" />
        <span className="ml-2">Thêm phòng</span>
      </Button>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          contentLabel="Thêm phòng"
          className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-6xl mx-auto mt-5 outline-none"
          overlayClassName="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-start z-50"
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Thêm phòng mới</h2>
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
                  <input
                    type="text"
                    placeholder="nhập số phòng ...."
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
                  <input
                    type="number"
                    name="floor"
                    placeholder="nhập số tầng ...."
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
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-green-600">
                    {formData.status && (
                      <p className="font-semibold text-base">SẴN SÀNG</p>
                    )}
                  </div>
                </div>

                {/* Room Type ID */}
                <div className="">
                  <div className="w-full max-w-md">
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
                      {data.map((item: any) => (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  name="notes"
                  placeholder="Nhập Thông Tin Phòng Tại Đây...."
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="h-[200px]">
                {formData.imageUrls.length > 0 ? (
                  <div className="relative mb-4 flex items-center gap-20 justify-center">
                    {formData.imageUrls
                      .filter((url) => url)
                      .map((url, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={url}
                            alt="Ảnh Phòng"
                            height={200}
                            width={200}
                            className="w-40 h-40 rounded-md object-cover"
                          />
                          <Button
                            variant={"ghost"}
                            className="cursor-pointer absolute -top-2.5 -right-[12px] hover:shadow-2xl rounded-full"
                            onClick={() => handleRemoveImageIndex(index)}
                          >
                            <X className="text-red-600 h-7 w-7 bg-white rounded-4xl" />
                          </Button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-4 h-[200px] relative">
                    <UploadButton
                      className=" text-black py-2 px-4 rounded cursor-pointer text-2xl w-60 h-20 border-2 border-dashed border-black hover:bg-black/10 z-20"
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res && res.length > 0) {
                          const urls = res.map((file) => file.ufsUrl);
                          setFormData((prev) => ({
                            ...prev,
                            imageUrls: [...urls, ...prev.imageUrls],
                          }));
                        }
                      }}
                      onUploadError={(error) => {
                        toast.error(
                          `Upload failed. ${error.message}` ||
                            "Tải lên không thành công!"
                        );
                      }}
                      content={{
                        button({ isUploading }) {
                          return isUploading ? (
                            <div className="text-black">Đang tải lên...</div>
                          ) : (
                            <>
                              <ImageDownIcon className="text-black w-8 h-8" />
                            </>
                          );
                        },
                      }}
                    />
                    <p className="absolute top-6 text-black text-lg ">
                      Up Ảnh Tại Đây
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setFormData({
                      roomNumber: "",
                      floor: 1,
                      status: "AVAILABLE",
                      notes: "",
                      roomTypeId: "",
                      imageUrls: [],
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Thêm Mới
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CreateRoom;
