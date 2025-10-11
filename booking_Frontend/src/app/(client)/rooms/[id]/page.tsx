"use client";
import React, { use } from "react";
import CardRoom from "../components/CardRoom";
import useSWR from "swr";
import { fetcher, URL_API } from "@/lib/fetcher";

type RoomPageProps = {
  params: Promise<{ id: string }>;
};
export default function Page({ params }: RoomPageProps) {
  const { id } = use(params); // Unwrap params bằng React.use()

  const { data, isLoading } = useSWR(
    `${URL_API}/api/room/roomtype/${id}`,
    fetcher
  );
  console.log("Data", data);

  if (!data || isLoading) {
    return <div>Loading...</div>;
  }
  return <div>{<CardRoom room={data ? data.room : {}} />}</div>;
}
