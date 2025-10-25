import Image from "next/image";
import TitleText from "../common/TitleText";

export default function BeanHotel() {
  return (
    <div className="flex flex-col xl:flex-row items-center justify-center gap-5  xl:my-30  py-5 mx-4 xl:mx-10">
      {/* images cycle  rounder  */}
      <div className="relative flex justify-center px-4 lg:px-0">
        {/* Outer border circle */}
        <div className="border-4 border-red-700 rounded-full xl:w-150 xl:h-150 lg:h-120 lg:w-120 w-70 h-70 flex items-center justify-center relative max-w-full">
          {/* Main circular image - stays in center */}
          <div className="relative xl:w-125 lg:w-100 lg:h-100 xl:h-125 w-60 h-60 rounded-full overflow-hidden">
            <img
              src={"/image/about.webp"}
              alt="Company team"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Rotating dots container - */}
          <div className="absolute inset-0 animate-orbit overflow-hidden">
            <div className="absolute lg:top-4 lg:left-6 lg:w-32 lg:h-32 w-12 h-12 top-2 left-8 bg-red-400 rounded-full opacity-50"></div>
            <div className="absolute lg:top-10 lg:right-24 lg:w-10 lg:h-10 w-6 h-6 top-4 right-11 bg-red-400 rounded-full "></div>
            <div className="absolute lg:bottom-5 lg:right-25 lg:w-13 lg:h-13 h-8 w-8 bottom-2 right-13 bg-red-400 rounded-full "></div>
          </div>
        </div>
      </div>
      <div className="w-full  p-5  rounded-lg  mx-10 md:mx-0">
        <TitleText title="DTU Hotel" tilteSub="Giới thiệu về chúng tôi" />
        <p className="text-gray-600 md:my-10 leading-relaxed whitespace-pre-line">
          <strong>DTU Hotel</strong> — điểm dừng chân lý tưởng giữa trái tim TP.
          Hồ Chí Minh. Với vị trí chiến lược tại giao điểm của bốn quận trung
          tâm, khách sạn kết nối thuận tiện tới các khu thương mại, giải trí và
          văn hóa hàng đầu của thành phố.{"\n\n"}
          Mỗi phòng nghỉ tại <strong>DTU</strong> được thiết kế tỉ mỉ theo tiêu
          chuẩn quốc tế, trang bị nội thất cao cấp, tiện nghi hiện đại và dịch
          vụ phòng 24/7 để đảm bảo mọi nhu cầu của quý khách được chăm sóc tận
          tâm.{"\n\n"}
          Kiến trúc và không gian được chế tác hài hoà giữa phong cách đương đại
          và nét trang nhã Á — Âu, tạo nên bầu không khí thanh lịch nhưng vẫn ấm
          cúng.{"\n\n"}
          Tại <strong>DTU Hotel</strong>, chúng tôi cam kết mang đến trải nghiệm
          thực sự khác biệt: từ <strong>ẩm thực tinh tế</strong> tại nhà hàng,{" "}
          <strong>dịch vụ spa thư giãn</strong>,
          <strong>phòng gym hiện đại</strong> đến{" "}
          <strong>phòng hội nghị tiện nghi</strong> cho các sự kiện doanh
          nghiệp.{"\n\n"}
          Đến với chúng tôi, quý khách sẽ cảm nhận được
          <strong>
            {" "}
            sự chuyên nghiệp, tận tâm và tinh thần hiếu khách đúng chuẩn quốc
            tế.
          </strong>
        </p>

        <button className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-600 transition cursor-pointer">
          Xem thêm
        </button>
      </div>
    </div>
  );
}
