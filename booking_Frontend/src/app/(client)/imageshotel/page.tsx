import Image from "next/image";
import React from "react";

const GalleryPage = () => {
  // Array of image filenames (anh1.jpg to anh9.jpg)
  const images = Array.from(
    { length: 9 },
    (_, index) => `/image/anh${index + 1}.jpg`
  );

  return (
    <section className="my-5 px-4 md:px-10 lg:px-16 bg-gray-50">
      {/* Heading */}

      {/* Video */}
      <div className=" mb-12 h-screen rounded-xl overflow-hidden shadow-lg">
        <video
          src="/video/2406638-uhd_3840_2160_24fps.mp4"
          loop
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover z-10"
        />
      </div>

      {/* Image Gallery */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 max-w-7xl mx-auto">
        {images.map((src, index) => (
          <div key={index} className="mb-6 break-inside-avoid">
            <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <Image
                src={src}
                alt={`Bean Hotel Gallery Image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center hover:scale-105 transition-transform duration-300"
                priority={index < 3} // Prioritize first 3 images for faster loading
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GalleryPage;
