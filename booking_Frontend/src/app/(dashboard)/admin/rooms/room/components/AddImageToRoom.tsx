import { UploadButton } from "@/utils/uploadthing";
import axios from "axios";
import { ImageDownIcon } from "lucide-react";

import React from "react";
import toast from "react-hot-toast";
import Mutate from "../../../../../../../hook/Mutate";

interface AddImageToRoomProps {
  roomId: string;
}
const AddImageToRoom = ({ roomId }: AddImageToRoomProps) => {
  return (
    <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-4 h-[200px] relative">
      <UploadButton
        className=" text-black py-2 px-4 rounded cursor-pointer text-2xl w-60 h-20 border-2 border-dashed border-black hover:bg-black/10 z-20"
        endpoint="imageUploader"
        onClientUploadComplete={async (res) => {
          if (res && res.length > 0) {
            const urls = res.map((file) => file.ufsUrl);
            if (urls) {
              try {
                const response = await axios.post(
                  `${process.env.NEXT_PUBLIC_URL_API}/api/room/images/${roomId}`,
                  { imageUrls: urls }
                );
                if (response.data) {
                  toast.success("Ảnh đã được lưu !");
                  Mutate(`${process.env.NEXT_PUBLIC_URL_API}/api/room`);
                }
              } catch (error) {
                toast.error("Lưu ảnh thất bại!");
                console.error("Lỗi lưu ảnh:", error);
              }
            }
          }
        }}
        onUploadError={(error) => {
          toast.error(
            `Upload failed. ${error.message}` || "Tải lên không thành công!"
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
      <p className="absolute top-6 text-black text-lg ">Thêm Ảnh Tại Đây</p>
    </div>
  );
};

export default AddImageToRoom;
