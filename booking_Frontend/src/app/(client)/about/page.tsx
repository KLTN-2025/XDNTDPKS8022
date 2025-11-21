import Image from "next/image";
import React from "react";

const AboutPage = () => {
  return (
    <section className="  py-7 lg:py-20 bg-gray-50 px-4 md:px-0">
      {/* Heading */}
      <h1 className="text-center text-sm md:text-2xl font-bold text-yellow-600 mb-6 uppercase tracking-widest">
        Về chúng tôi
      </h1>
      <p className="text-lg md:text-xl font-semibold text-yellow-600 text-left lg:text-center">
        HÃY ĐẾN BEAN HOTEL ĐỂ TRẢI NGHIỆM SỰ KHÁC BIỆT!
      </p>
      <br />
      {/* Intro Paragraph */}
      <p className="text-center text-sm md:text-base text-gray-700 max-w-2xl mx-auto mb-10 tracking-tight">
        Là khách sạn 5 sao đẳng cấp quốc tế, tọa lạc tại giao điểm của bốn quận{" "}
        <span className="font-bold">chính</span>, nơi được xem như trái tim và
        trung tâm của TP. Hồ Chí Minh.
      </p>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
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
        </div>
        <div>
          {/* images cycle  rounder  */}
          <div className="relative flex justify-center px-4 lg:px-0">
            {/* Outer border circle */}
            <div className="border-4 border-red-500 rounded-full lg:w-150 lg:h-150 w-80 h-80 flex items-center justify-center relative max-w-full">
              {/* Main circular image - stays in center */}
              <div className="relative lg:w-125 lg:h-125 w-64 h-64 rounded-full overflow-hidden">
                <img
                  src={"/image/alper-gio-thieu.webp"}
                  alt="Company team"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Rotating dots container - */}
              <div className="absolute inset-0 animate-orbit overflow-hidden">
                <div className="absolute lg:top-4 lg:left-6 lg:w-32 lg:h-32 w-12 h-12 top-2 left-8 bg-red-500 rounded-full opacity-50"></div>
                <div className="absolute lg:top-10 lg:right-24 lg:w-10 lg:h-10 w-6 h-6 top-6 right-11 bg-red-500 rounded-full"></div>
                <div className="absolute lg:bottom-5 lg:right-25 lg:w-13 lg:h-13 h-8 w-8 bottom-2 right-13 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
