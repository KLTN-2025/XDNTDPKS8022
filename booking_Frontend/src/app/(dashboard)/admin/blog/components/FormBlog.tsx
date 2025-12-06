import { UploadButton } from "@/utils/uploadthing";
import { EditorContent } from "@tiptap/react";
import {
  Bold,
  Heading1,
  Heading2,
  ImageDownIcon,
  Italic,
  List,
  ListOrdered,
  Quote,
  X,
} from "lucide-react";
import React, { useEffect } from "react";
import { PostData } from "../add/page";
import Image from "next/image";
import PreviewButton from "./PreviewButton";

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

  useEffect(() => {
    if (!editor) return;

    // Set content ban đầu
    if (postData.content) {
      editor.commands.setContent(postData.content);
    }

    // Cập nhật postData khi editor thay đổi
    editor.on("update", () => {
      setPostData((prev) => ({
        ...prev,
        content: editor.getHTML(),
      }));
    });

    return () => {
      editor.off("update");
    };
  }, [editor, postData.content]);

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
              <div className="relative inline-block">
                <Image
                  alt=""
                  src={postData.coverImage}
                  width={300}
                  height={300}
                />
                <button
                  onClick={() =>
                    setPostData((prev) => ({
                      ...prev,
                      coverImage: "",
                    }))
                  }
                  className="absolute cursor-pointer top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <X />
                </button>
              </div>
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

      <div className="prose whitespace-pre-line">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nội dung
        </label>
        <div className="border rounded-lg overflow-hidden">
          <div className=" flex justify-between gap-1 p-2 bg-gray-50 border-b items-center ">
            <div className="flex ">
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
                  editor?.isActive("italic")
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
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
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
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
            </div>
            <PreviewButton postData={postData} />
          </div>

          <EditorContent
            editor={editor}
            className="min-h-[500px] p-4 bg-white focus:outline-none prose whitespace-pre-line"
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
