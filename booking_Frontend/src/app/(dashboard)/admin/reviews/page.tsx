"use client";
import React from "react";
import CheckReviewUser from "./components/CheckReviewUser";
import useSWR from "swr";
import { URL_API } from "@/lib/fetcher";

const Page = () => {
  const { data } = useSWR(`${URL_API}/api/review/all`);

  return (
    <>
      <CheckReviewUser reviews={data || []} />
    </>
  );
};

export default Page;
