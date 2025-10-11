"use client";
import React from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Utensils, Wifi, Car, Waves, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
interface Highlight {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  features: string[];
}

const highlights: Highlight[] = [
  {
    id: 1,
    title: "Nhà Hàng Cao Cấp",
    description:
      "Thưởng thức ẩm thực đẳng cấp quốc tế với đầu bếp Michelin Star",
    image: "/image/khong-gian-akuna-8225.jpg",
    icon: <Utensils className="w-6 h-6" />,
    features: ["Buffet sáng miễn phí", "Menu đa dạng", "Phục vụ 24/7"],
  },
  {
    id: 2,
    title: "Tiện Nghi Hiện Đại",
    description: "Wifi tốc độ cao và các tiện ích công nghệ tiên tiến",
    image: "/image/standard-hotel-room-with-garden-view.png",
    icon: <Wifi className="w-6 h-6" />,
    features: ["Wifi miễn phí", "Smart TV", "Sạc không dây"],
  },
  {
    id: 3,
    title: "Bãi Đỗ Xe Rộng Rãi",
    description: "Khu vực đỗ xe an toàn và thuận tiện cho khách hàng",
    image: "/image/bai-do-xe-ngoai-troi.jpg",
    icon: <Car className="w-6 h-6" />,
    features: ["Bảo vệ 24/7", "Miễn phí đỗ xe", "Valet parking"],
  },
  {
    id: 4,
    title: "Hồ Bơi & Spa",
    description: "Thư giãn tại hồ bơi vô cực và spa cao cấp",
    image: "/image/4-ho-boi-vo-cuc-o-da-nang-len-hinh-sang-chanh-ivivu-2.jpg",
    icon: <Waves className="w-6 h-6" />,
    features: ["Hồ bơi vô cực", "Spa trị liệu", "Jacuzzi"],
  },
  {
    id: 5,
    title: "Quán Cà Phê Thư Giãn",
    description: "Không gian yên tĩnh để thưởng thức cà phê và làm việc",
    image: "/image/cafe-Đà-Nẵng-view-biển.jpg",
    icon: <Coffee className="w-6 h-6" />,
    features: ["Cà phê premium", "Wifi tốc độ cao", "Không gian yên tĩnh"],
  },
];
const HotelHighlightsCarousel = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 animate-fade-in-up">
            Tiện Nghi Đẳng Cấp
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up">
            Khám phá những tiện ích và dịch vụ cao cấp tại khách sạn của chúng
            tôi
          </p>
        </div>
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={true}
          modules={[EffectCoverflow, Pagination]}
          className="mySwiper max-w-5xl"
        >
          {highlights.map((highlight) => (
            <SwiperSlide
              key={highlight.id}
              className="relative max-w-6xl mx-auto"
            >
              <div key={highlight.id} className="w-full flex-shrink-0">
                <div className="grid md:grid-cols-2 gap-0 min-h-[500px]">
                  {/* Image section */}
                  <div className="relative overflow-hidden group">
                    <Image
                      width={500}
                      height={500}
                      src={highlight.image || "/placeholder.svg"}
                      alt={highlight.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Content section */}
                  <div className="p-8 md:p-12 flex flex-col justify-center bg-card">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-full bg-primary text-primary-foreground">
                        {highlight.icon}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-card-foreground animate-slide-in-right">
                        {highlight.title}
                      </h3>
                    </div>

                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed animate-slide-in-right">
                      {highlight.description}
                    </p>

                    <div className="space-y-3 mb-8">
                      {highlight.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 animate-slide-in-right"
                        >
                          <div className="w-2 h-2 rounded-full bg-accent" />
                          <span className="text-card-foreground">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button className="self-start bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 relative overflow-hidden">
                      Tìm Hiểu Thêm
                    </Button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HotelHighlightsCarousel;
