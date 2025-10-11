"use client";

import React, { useEffect, useState } from "react";
import ProfileItems from "./components/ProfileItems";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LayoutProfile = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("vui lòng đăng nhập !");
      setTimeout(() => {
        router.push("/");
      }, 800);
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return <div>Loading...</div>; // Avoid SSR/client mismatch
  }

  return (
    <div className="md:mt-10 mt-0 h-[100vh] grid grid-cols-[15%_85%] md:grid-cols-[20%_80%] mx-auto container">
      <div>
        <ProfileItems />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default LayoutProfile;
