"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Review } from "@/app/(dashboard)/admin/reviews/components/CheckReviewUser";
import { URL_API } from "@/lib/fetcher";
import useSWR from "swr";
import { Star } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function TestimonialCarousel() {
  const { data } = useSWR<Review[]>(`${URL_API}/api/review/all`);

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-300 text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full py-16 md:py-32 bg-gray-100">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={16}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 12,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
          }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet !bg-gray-300",
            bulletActiveClass: "swiper-pagination-bullet-active !bg-red-600",
          }}
          className="!pb-12 md:!pb-16"
        >
          {data
            ?.filter((item) => item.rating === 5)
            .map((item, index) => (
              <SwiperSlide key={index} className="!h-auto">
                <div className="relative pt-5 pb-16 h-full">
                  {/* Number indicator */}
                  <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-[linear-gradient(295.99deg,#801518_-5.48%,#CC1F26_80%)] rounded-full flex items-center justify-center text-white font-bold z-10">
                    {index + 1}
                  </div>

                  {/* Card content */}
                  <div
                    className="bg-white rounded-3xl shadow-lg px-4 sm:px-6 py-10 md:py-10 h-full flex flex-col justify-center"
                    title={item.comment}
                  >
                    <p className="text-brand-gray text-justify text-sm sm:text-base line-clamp-4 sm:line-clamp-5">
                      {item.comment}
                    </p>
                  </div>

                  {/* Avatar and user info */}
                  <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2">
                    <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-semibold bg-white shadow-md">
                      {item.customer.user.lastName?.trim()[0]?.toUpperCase()}
                    </div>

                    <h3 className="text-xs sm:text-sm font-semibold text-brand-gray whitespace-nowrap">
                      {item.customer.user.firstName +
                        " " +
                        item.customer.user.lastName}
                    </h3>

                    <StarRating rating={item.rating} />
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
}
