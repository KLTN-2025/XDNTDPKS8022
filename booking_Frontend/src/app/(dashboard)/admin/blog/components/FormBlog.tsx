import { UploadButton } from "@/utils/uploadthing";
import { EditorContent } from "@tiptap/react";
import {
  Bold,
  Heading1,
  Heading2,
  ImageDownIcon,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import React from "react";
import { PostData } from "../add/page";
import Image from "next/image";

interface IFormBlog {
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  postData: PostData;
  setPostData: React.Dispatch<React.SetStateAction<PostData>>;
  editor: any;
}
const FormBlog = ({
  handleSubmit,
  postData,
  setPostData,
  editor,
}: IFormBlog) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tiêu đề
        </label>
        <input
          type="text"
          name="title"
          value={postData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập tiêu đề bài viết"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bảng Tóm Tắt
          </label>
          <textarea
            name="summary"
            value={postData.summary}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập mô tả ngắn"
            rows={5}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ảnh bìa
          </label>
          <div className="flex flex-col items-start">
            {postData.coverImage ? (
              <Image
                alt=""
                src={postData.coverImage}
                width={300}
                height={300}
              />
            ) : (
              <UploadButton
                className="text-black py-2 px-4 rounded cursor-pointer text-2xl w-full h-[140px] border-2 border-dashed border-gray-300 hover:bg-gray-50"
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setPostData((prev) => ({
                    ...prev,
                    coverImage: res[0].ufsUrl,
                  }));
                }}
                content={{
                  button({ isUploading }) {
                    if (isUploading) {
                      return (
                        <div className="text-gray-500">Đang tải lên...</div>
                      );
                    }
                    return (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ImageDownIcon className="text-gray-500 w-8 h-8" />
                        <span className="text-sm text-gray-500">
                          Tải lên ảnh bìa
                        </span>
                      </div>
                    );
                  },
                }}
              />
            )}
            {postData.coverImage && (
              <div className="mt-2 text-sm text-gray-500">
                Ảnh đã tải lên thành công!
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nội dung
        </label>
        <div className="border rounded-lg overflow-hidden">
          <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-2 rounded ${
                editor?.isActive("bold") ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              title="In đậm"
            >
              <Bold className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-2 rounded ${
                editor?.isActive("italic") ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              title="In nghiêng"
            >
              <Italic className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`p-2 rounded ${
                editor?.isActive("heading", { level: 1 })
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
              }`}
              title="Tiêu đề 1"
            >
              <Heading1 className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`p-2 rounded ${
                editor?.isActive("heading", { level: 2 })
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
              }`}
              title="Tiêu đề 2"
            >
              <Heading2 className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded ${
                editor?.isActive("bulletList")
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
              }`}
              title="Danh sách không thứ tự"
            >
              <List className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded ${
                editor?.isActive("orderedList")
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
              }`}
              title="Danh sách có thứ tự"
            >
              <ListOrdered className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded ${
                editor?.isActive("blockquote")
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
              }`}
              title="Trích dẫn"
            >
              <Quote className="w-5 h-5" />
            </button>

            <UploadButton
              className="mt-4"
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res[0].url) {
                  editor?.chain().focus().setImage({ src: res[0].url }).run();
                }
              }}
              onUploadError={(error: Error) => {
                console.error("Upload error:", error);
              }}
              content={{
                button({ isUploading }) {
                  if (isUploading) {
                    return (
                      <div className="text-gray-500 text-sm px-2">
                        Đang tải lên...
                      </div>
                    );
                  }
                  return (
                    <ImageIcon className="p-2 rounded w-full h-full hover:bg-gray-100 text-black " />
                  );
                },
              }}
            />
          </div>

          <EditorContent
            editor={editor}
            className="min-h-[500px] p-4 bg-white focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end mr-6">
        {" "}
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-end"
        >
          Đăng bài viết
        </button>
      </div>
    </form>
  );
};

export default FormBlog;
