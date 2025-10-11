"use client";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Article } from "../page";

interface CardBlogProps {
  data: Article[];
  slug: string;
}

const CardBlogRelation = ({ data, slug }: CardBlogProps) => {
  return (
    <div className="space-y-4 mx-5">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Bài Viết Liên Quan
      </h3>
      <div className="grid gap-4">
        {data
          .filter((item) => item.slug !== slug)
          .slice(0, 3)
          .map((item) => (
            <Link
              key={item.id}
              href={`/blog/${item.slug}`}
              className="block group"
            >
              <Card className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-0 bg-white group-hover:bg-gray-50">
                <div className="flex">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={
                        item.coverImage ||
                        "/placeholder.svg?height=100&width=100&query=related post"
                      }
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-1 left-1">
                      <Badge
                        variant="secondary"
                        className="text-xs px-1 py-0.5"
                      >
                        {item.content || "Blog"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1 p-4">
                    <CardTitle className="text-sm font-semibold line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                      {item.title}
                    </CardTitle>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {item.summary.slice(0, 80)}...
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {new Date(item.publishedAt).toLocaleDateString("vi-VN")}
                      </span>
                      <span>{item.publishedAt || 5} phút</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default CardBlogRelation;
