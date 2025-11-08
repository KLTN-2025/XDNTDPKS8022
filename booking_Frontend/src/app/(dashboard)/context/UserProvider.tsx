"use client";
import { useEffect } from "react";
import { useUserStore } from "@/hook/useUserStore";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "@/lib/axios";
import { useRouter } from "next/navigation";
export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initUser, logout } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const handleToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // public page

      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        try {
          const newToken = await refreshAccessToken();
          localStorage.setItem("token", newToken);
          initUser(); // cập nhật user store
        } catch (err) {
          console.error("Refresh token thất bại:", err);
          logout();
          router.push("/login");
        }
      } else {
        initUser(); // token còn hạn, khởi tạo store
      }
    };

    handleToken();
  }, [initUser, logout, router]);

  return <>{children}</>;
}
