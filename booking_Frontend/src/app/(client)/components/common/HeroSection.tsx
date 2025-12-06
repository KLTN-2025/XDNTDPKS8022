"use client";

import MarkDown from "@/hook/MarkDown";
import { useParams } from "next/navigation";
import { ReactNode } from "react";

interface HeroSectionProps {
  title: string;
  description?: string;
  children?: ReactNode;
  backgroundImage?: string;
  className?: string;
  locale?: string;
  variant?: "default" | "gradient" | "minimal";
  overlayOpacity?: "light" | "medium" | "dark";
}

export function HeroSection({
  title,
  description,
  children,
  backgroundImage,
  className = "",
  variant = "default",
  overlayOpacity = "medium",
}: HeroSectionProps) {
  // Độ mờ của overlay tùy theo brightness của ảnh
  const overlayConfigs = {
    light: "bg-black/30",
    medium: "bg-black/50",
    dark: "bg-black/70",
  };

  const gradientOverlay =
    variant === "gradient"
      ? "bg-gradient-to-br from-blue-600/90 via-purple-600/80 to-pink-600/90"
      : overlayConfigs[overlayOpacity];

  return (
    <section
      className={`
        relative pt-24 pb-20 lg:pt-10 lg:pb-28
        bg-cover bg-center bg-no-repeat 
        min-h-screen flex items-center justify-center
        overflow-hidden
        ${
          !backgroundImage && variant === "gradient"
            ? "bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"
            : "bg-gray-900"
        }
        ${className}
      `}
      style={{
        backgroundImage: backgroundImage
          ? `url('${backgroundImage}')`
          : undefined,
      }}
    >
      {/* Multi-layer Overlay với blur cho readability tốt hơn */}
      {backgroundImage && (
        <>
          {/* Layer 1: Dark overlay */}
          <div className={`absolute inset-0 ${gradientOverlay}`} />

          {/* Layer 2: Backdrop blur - tạo frosted glass effect */}
          <div className="absolute inset-0 backdrop-blur-xs" />

          {/* Layer 3: Gradient overlay từ bottom để tạo depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </>
      )}

      {/* Animated gradient orbs (decorative) */}
      {variant === "gradient" && !backgroundImage && (
        <>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        </>
      )}

      {/* Content Container với backdrop blur riêng */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl">
          {/* Title với text shadow cho readability */}
          <h1
            className="
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl
              font-extrabold tracking-tight 
              text-white
              mb-6 lg:mb-8
              leading-tight whitespace-pre-line
              animate-fade-in-up
              [text-shadow:_0_2px_10px_rgb(0_0_0_/_40%)]
            "
          >
            {title}
          </h1>

          {/* Description với background blur để dễ đọc hơn */}
          {description && (
            <div className="backdrop-blur-md bg-black/20 rounded-2xl p-6 mb-8 lg:mb-10 animate-fade-in-up animation-delay-200">
              <p
                className="
                  text-lg sm:text-xl md:text-2xl
                  text-white
                  max-w-3xl
                  leading-relaxed
                  [text-shadow:_0_1px_8px_rgb(0_0_0_/_30%)]
                  whitespace-pre-line
                  
                "
              >
                {description}
              </p>
            </div>
          )}

          {/* CTA Buttons với backdrop blur */}
          {children && (
            <div className="animate-fade-in-up animation-delay-400">
              {children}
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator với backdrop blur */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-white/90 animate-bounce backdrop-blur-sm bg-black/20 rounded-full p-3">
          <span className="text-sm font-medium hidden sm:block">Scroll</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
