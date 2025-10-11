import Image from "next/image";
import React from "react";

const AboutPage = () => {
  return (
    <section className=" my-5 px-4 md:px-8 lg:px-16 pt-2 bg-gray-50">
      {/* Heading */}
      <h1 className="text-center text-sm md:text-2xl font-bold text-yellow-600 mb-6 uppercase tracking-widest">
        Về chúng tôi
      </h1>

      {/* Intro Paragraph */}
      <p className="text-center text-sm md:text-base text-gray-700 max-w-2xl mx-auto mb-10 tracking-tight">
        Là khách sạn 5 sao đẳng cấp quốc tế, tọa lạc tại giao điểm của bốn quận{" "}
        <span className="font-bold">chính</span>, nơi được xem như trái tim và
        trung tâm của TP. Hồ Chí Minh.
      </p>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Image */}
        <div className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg">
          <Image
            src="/image/alper-gio-thieu.webp"
            alt="Bean Hotel"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Text Content */}
        <div className="space-y-6 text-gray-700 text-sm md:text-base leading-relaxed">
          <p>
            Với hệ thống phòng tiêu chuẩn và phòng hạng sang thiết kế đẹp mắt và
            trang nhã, được chú trọng tới từng chi tiết, Bean Hotel mang lại sự
            tiện nghi và thoải mái tối đa cho quý khách, dù là thời gian nghỉ
            ngơi thư giãn hay trong chuyến công tác.
          </p>
          <p>
            Bean Hotel tích hợp đầy đủ các dịch vụ tiện ích như nhà hàng, phòng
            hội nghị, hồ bơi, dịch vụ đón tiễn sân bay, các tour du lịch, chơi
            golf, và vé máy bay với chất lượng tốt nhất. Đội ngũ nhân viên
            chuyên nghiệp của chúng tôi cam kết mang đến trải nghiệm hoàn hảo,
            tạo nên sự khác biệt cho hệ thống Khách sạn Bean Hotel.
          </p>
          <p>
            Cùng với đội ngũ nhân viên được tuyển chọn và đào tạo chuyên nghiệp,
            chu đáo và thân thiện, Bean Hotel hứa hẹn mang đến cho quý khách sự
            thoải mái và hài lòng nhất.
          </p>
          <p>
            Đến với Bean Hotel là đến với sự tinh tế nhất về chất lượng, dịch vụ
            và sự thân thiện như chính ngôi nhà của bạn.
          </p>
          {/* Call to Action */}
          <p className="text-lg md:text-xl font-semibold text-yellow-600 text-center lg:text-left">
            HÃY ĐẾN BEAN HOTEL ĐỂ TRẢI NGHIỆM SỰ KHÁC BIỆT!
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
