"use client";
import React from "react";
import TableBlog from "./components/TableBlog";
import useSWR from "swr";

import { fetcher, URL_API } from "@/lib/fetcher";

const Page = () => {
  const { data, isLoading } = useSWR(`${URL_API}/api/blog/employee`, fetcher);

  if (isLoading) return <>...</>;
  return (
    <div>
      <TableBlog posts={data || []} />
    </div>
  );
};

export default Page;
