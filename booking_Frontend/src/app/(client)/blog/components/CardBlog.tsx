"use client";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Article } from "../page";

interface CardBlogProps {
  data: Article[];
}

const CardBlog = ({ data }: CardBlogProps) => {
  const route = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.map((item) => (
        <Card
          className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0"
          key={item.id}
        >
          {/* Phần hình ảnh */}
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={
                item.coverImage ||
                "/placeholder.svg?height=200&width=300&query=blog post"
              }
              alt={item.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-3 left-3">
              <Badge className="bg-blue-600 text-white text-xs">
                {item?.content || "Blog"}
              </Badge>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Phần nội dung */}
          <CardHeader className="p-6">
            <CardTitle className="text-lg font-bold line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200 text-balance">
              {item.title}
            </CardTitle>
            <p className="text-gray-600 text-sm line-clamp-2 mt-2">
              {item.summary}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
              <span>
                {new Date(item.publishedAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </CardHeader>

          {/* Phần footer với nút xem thêm */}
          <CardFooter className="p-6 pt-0">
            <Button
              variant="outline"
              className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-200 font-medium bg-transparent"
              onClick={() => route.push(`/blog/${item.slug}`)}
            >
              Đọc Thêm
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CardBlog;
