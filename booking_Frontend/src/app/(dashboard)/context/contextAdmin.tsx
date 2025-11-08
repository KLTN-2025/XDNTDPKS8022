"use client";

import { useUserStore } from "@/hook/useUserStore";
import { refreshAccessToken } from "@/lib/axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  countCustomer: number;
  setCountCustomer: (value: number) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const { initUser } = useUserStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [countCustomer, setCountCustomer] = useState(0);

  const router = useRouter();

  // thay đổi
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  // Trả về số mili giây còn lại của token, hoặc 0 nếu token không tồn tại / hết hạn
  function getTokenRemainingTime(token: string | null): number {
    if (!token) return 0;
    const decoded: { exp: number } = jwtDecode(token);
    const remaining = decoded.exp * 1000 - Date.now();
    return remaining > 0 ? remaining : 0;
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleToken = async () => {
      let token = localStorage.getItem("token");
      if (!token) return;

      let remainingTime = getTokenRemainingTime(token);

      if (remainingTime <= 0) {
        try {
          const newToken = await refreshAccessToken();
          token = newToken;
          initUser(); // cập nhật store sau khi refresh
          remainingTime = getTokenRemainingTime(token);
        } catch (err) {
          console.error("Refresh token thất bại:", err);
          localStorage.removeItem("token");
          router.push("/login"); // redirect về login nếu refresh thất bại
          return;
        }
      }

      // set timer cho lần refresh tiếp theo
      timer = setTimeout(handleToken, remainingTime - 1000); // refresh 1s trước khi hết hạn
    };

    handleToken();

    return () => clearTimeout(timer);
  }, [router, initUser]);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleCollapse,
        setCountCustomer,
        countCustomer,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
