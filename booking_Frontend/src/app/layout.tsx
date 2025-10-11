import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SWRProvider from "@/components/ui/SWRProvider";
import { SidebarProvider } from "./(dashboard)/context/contextAdmin";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trang DashBoard",
  description: "danh mục quản lý ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <Toaster />
        <main className="" id="root">
          <SidebarProvider>
            <SWRProvider>{children}</SWRProvider>
          </SidebarProvider>
        </main>
      </body>
    </html>
  );
}
