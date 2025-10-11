"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, MoreHorizontalIcon } from "lucide-react";
import PublishedBlog from "./PublishedBlog";

// Define interfaces based on Prisma schema
interface Employee {
  user: { firstName: string; lastName: string };
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  publishedAt?: string | null;
  createdAt: string;
  employee: Employee | null;
}

interface TableBlogProps {
  posts: BlogPost[];
}

const TableBlog = ({ posts }: TableBlogProps) => {
  return (
    <div className="container mx-auto p-6 rounded-2xl bg-white">
      <h2 className="text-2xl font-bold mb-4">Blog Post Management</h2>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người Đăng</TableHead>
              <TableHead>Tiêu Đề</TableHead>
              <TableHead>Xuất Bản</TableHead>
              <TableHead>Ngày Xuất Bản</TableHead>
              <TableHead>Hành Động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  {(post.employee?.user.firstName || "") +
                    " " +
                    post.employee?.user.lastName || ""}
                </TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>
                  {post.published ? (
                    <span className="text-green-600">Đã Xuất Bản</span>
                  ) : (
                    <span className="text-red-600">Chưa Xuất Bản</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="">
                    {" "}
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : "bản chưa được xuất"}
                  </div>
                </TableCell>

                <TableCell className="">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="ml-6">
                      <MoreHorizontalIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Thực Hiện</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <PublishedBlog id={post.id} published={post.published} />
                      <DropdownMenuItem>Xóa Bài Viết</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableBlog;
