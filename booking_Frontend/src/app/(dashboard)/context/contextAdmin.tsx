"use client";

import socket from "@/lib/socket";
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
  waitingCustomers: string[];
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [countCustomer, setCountCustomer] = useState(0);
  const [waitingCustomers, setWaitingCustomers] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("waiting_customers") || "[]");
    } catch {
      return [];
    }
  });
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

  // đếm
  useEffect(() => {
    const waitingCustomerStr = localStorage.getItem("waiting_customers");
    if (waitingCustomerStr) {
      try {
        const waitingCustomerArr: string[] = JSON.parse(waitingCustomerStr);
        setCountCustomer(waitingCustomerArr.length || 0);
      } catch {
        setCountCustomer(0);
      }
    }
  }, [waitingCustomers]);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleWaitingList = (customers: string[]) => {
      setWaitingCustomers((prev) => {
        const merged = Array.from(new Set([...prev, ...customers]));
        localStorage.setItem("waiting_customers", JSON.stringify(merged));
        return merged;
      });
    };

    const handleNewMessage = (msg: { senderId: string }) => {
      setWaitingCustomers((prev) => {
        if (prev.includes(msg.senderId)) return prev;
        const updated = [...prev, msg.senderId];
        localStorage.setItem("waiting_customers", JSON.stringify(updated));
        return updated;
      });
    };

    socket.on("waiting_customers", handleWaitingList);
    socket.on("receive_message", handleNewMessage);

    return () => {
      socket.off("waiting_customers", handleWaitingList);
      socket.off("receive_message", handleNewMessage);
    };
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleCollapse,
        setCountCustomer,
        countCustomer,
        waitingCustomers,
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
