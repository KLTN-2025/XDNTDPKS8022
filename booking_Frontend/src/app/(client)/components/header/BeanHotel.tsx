import Image from "next/image";

export default function BeanHotel() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-5 mt-6  py-4">
      {/* Left Section: Image */}

      <Image
        src="/image/about.webp"
        alt="Hotel Reception"
        width={400}
        height={400}
        className="rounded-sm shadow-md object-cover w-sm md:w-xl h-64 md:h-full "
      />

      <div className="w-full  md:w-1/2 p-5 bg-white rounded-lg shadow-lg mx-10 md:mx-0">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Bean Hotel</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Giới thiệu về chúng tôi
        </h2>
        <p className="text-gray-600 mb-6">
          Là khách sạn 5 sao đẳng cấp quốc tế, tọa lạc tại giao điểm của bốn
          quận chính, nội khu vực trung tâm TP. Hồ Chí Minh. Với hệ thống phòng
          tiện nghi chuẩn quốc tế và phong cách thiết kế đẹp mắt và trang nhã
          được trình bày từ chi tiết nhỏ nhất để đem lại sự tiện nghi và thoải
          mái nhất cho quý khách trong thời gian nghỉ ngơi tại đây. Chúng tôi
          luôn sẵn sàng phục vụ với sự tận tâm và chuyên nghiệp...
        </p>
        <button className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-600 transition cursor-pointer">
          Xem thêm
        </button>
      </div>
    </div>
  );
}
