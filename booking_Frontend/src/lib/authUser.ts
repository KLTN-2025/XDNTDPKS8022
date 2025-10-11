"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/getUser";

export default function useAuth(
  expectedRole?: ("CUSTOMER" | "EMPLOYEE" | "ADMIN")[]
) {
  const [user, setUser] = useState<any>(null);
  const [loadingLog, setLoadingLog] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
      }
      const data = await getUser();

      if (!data) {
        setLoadingLog(false);
        router.push("/");
        return;
      }

      if (expectedRole && !expectedRole.includes(data.userType)) {
        router.push("/");
        return;
      }

      setUser(data);
      setLoadingLog(false);
    };
    console.log("useAuth effect chạy lại");
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, loadingLog };
}
