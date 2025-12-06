"use client";

import React from "react";

import ProfileUser from "./components/ProfileUser";
import useAuth from "@/lib/authUser";

const Page = () => {
  const { user } = useAuth();

  return (
    <div>
      <ProfileUser user={user || {}} />
    </div>
  );
};

export default Page;
