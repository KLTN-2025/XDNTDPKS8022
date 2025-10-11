"use client";
import React from "react";
import useSWR from "swr";
import CardBlog from "./components/CardBlog";
import { Button } from "@/components/ui/button";

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  published: boolean;
  publishedAt: string;
}

const Page = () => {
  const { data, isLoading } = useSWR(`/api/blog`);
  if (isLoading) {
    <div>loading.....</div>;
  }
  return (
    <div className="mt-5 text-center">
      <section className="relative py-20 px-4 text-center bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance">
            Khám Phá Thế Giới
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Blogs
            </span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto text-pretty">
            Chia sẻ kiến thức, kinh nghiệm và những xu hướng mới nhất trong du
            lịch khách sạn
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3"
          >
            Khám Phá Ngay
          </Button>
        </div>
      </section>
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bài Viết Mới Nhất
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Cập nhật những kiến thức và xu hướng mới nhất trong những chuyến
              du lịch
            </p>
          </div>
          <CardBlog data={data || []} />
        </div>
      </section>
    </div>
  );
};

export default Page;
