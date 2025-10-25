"use client";

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
    const token = localStorage.getItem("token");
    if (!token) return; // Page public sẽ không làm gì

    const remainingTime = getTokenRemainingTime(token);

    if (remainingTime <= 0) {
      localStorage.removeItem("token");
      router.push("/"); // hoặc "/" tuỳ bạn chọn 1
      return;
    }

    const timer = setTimeout(() => {
      localStorage.removeItem("token");
      router.push("/");
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [router]);

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
