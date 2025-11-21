"use client";
import React from "react";
import ArticleDetail from "../components/ArticleDetail";
import CardBlogRelation from "../components/CardBlogRelation";
import useSWR from "swr";
import { Article } from "../page";

const Page = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = React.use(params);
  const { data, isLoading } = useSWR<Article[]>(`/api/blog`);
  if (isLoading) {
    <div>loading.....</div>;
  }
  return (
    <div className=" grid grid-cols-1 md:grid-cols-4 ">
      <div className="col-span-3">
        <ArticleDetail slug={slug} />
      </div>
      <div className="mt-15 space-y-10 ">
        {data
          ?.filter((item) => item.slug !== slug)
          .map((article) => (
            <CardBlogRelation article={article} key={article.slug} />
          ))}
      </div>
    </div>
  );
};

export default Page;
