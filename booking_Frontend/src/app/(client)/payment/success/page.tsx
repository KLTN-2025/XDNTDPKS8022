"use client";
import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import axios from "axios";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");
  const orderCode = searchParams.get("orderCode");
  console.log(status, orderCode);
  useEffect(() => {
    axios.post(`${process.env.NEXT_PUBLIC_URL_API}/api/payment/webhook/payos`, {
      status,
      orderCode,
    });
  }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/profile/bookings");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Thanh Toán Thành Công
      </h1>
      <p className="text-gray-600">...</p>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense>
      <PaymentSuccess />
    </Suspense>
  );
}
