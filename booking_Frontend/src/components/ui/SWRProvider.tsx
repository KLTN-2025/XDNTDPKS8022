"use client";
import { fetcher } from "@/lib/fetcher";
import { SWRConfig } from "swr";

export default function SWRProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig
      value={{
        fetcher,
        shouldRetryOnError: true,
        errorRetryCount: 3,
        errorRetryInterval: 3000,
        dedupingInterval: 2000,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}
