"use client";
import React from "react";
import ArticleDetail from "../components/ArticleDetail";
import CardBlogRelation from "../components/CardBlogRelation";
import useSWR from "swr";

const Page = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = React.use(params);
  const { data, isLoading } = useSWR(`/api/blog`);
  if (isLoading) {
    <div>loading.....</div>;
  }
  return (
    <div className="mt-12 md:flex ">
      <div className="md:w-4/6 ">
        <ArticleDetail slug={slug} />
      </div>
      <div className="md:w-2/6 mt-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">
          Có thể bạn sẽ thích
        </h2>
        <CardBlogRelation data={data || []} slug={slug} />
      </div>
    </div>
  );
};

export default Page;
