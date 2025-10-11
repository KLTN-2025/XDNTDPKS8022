"use client";

import React from "react";

import ProfileUser from "./components/ProfileUser";
import useAuth from "@/lib/authUser";

const Page = () => {
  // const { data, isLoading, error } = useSWR(
  //   `${process.env.NEXT_PUBLIC_URL_API}/api/auth/user`,
  //   fetcher
  // );
  const { user } = useAuth();

  return (
    <div>
      <ProfileUser user={user || {}} />
    </div>
  );
};

export default Page;
