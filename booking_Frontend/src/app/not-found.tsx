"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold text-red-600">404</h1>
      <p className="mt-4 text-xl">Oops! This page could not be found.</p>
      <Link
        href="/"
        className="mt-6 px-4 py-2 underline underline-offset-1 text-red-600 hover:text-red-700"
      >
        Go back home
      </Link>
    </div>
  );
}
