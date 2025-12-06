import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Mutate from "@/hook/Mutate";
import { URL_API } from "@/lib/fetcher";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";

interface IPublishedBlog {
  id: string;
  published: boolean;
}
const PublishedBlog = ({ id, published }: IPublishedBlog) => {
  const handlePublish = async () => {
    try {
      const res = await axios.put(`${URL_API}/api/blog/${id}`);
      if (res.data) {
        toast.success("xuất Bản Thành Công");
        Mutate(`${URL_API}/api/blog/employee`);
      }
    } catch (error: any) {
      toast.error(error?.reponse?.data.message);
    }
  };
  return (
    <DropdownMenuItem onClick={handlePublish}>
      {published === false ? "Xuất Bản" : "Hủy Xuất Bản"}
    </DropdownMenuItem>
  );
};

export default PublishedBlog;
