import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import { Pagination } from "swiper/modules";
// import "./Home.css"; // for custom font (see below)

const HomePage = () => {
  return (
    <div className="font-bangla min-h-screen bg-gradient-to-b from-[#F2F6FF] to-white text-gray-800">
      {/* Header */}
      <header className="bg-white shadow p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-center text-[#21409A]">আমার ড্যাশবোর্ড</h1>
      </header>

      {/* Banner */}
      <section className="text-center mt-6 px-4">
        <h2 className="text-xl font-semibold text-[#21409A]">স্বাগতম, শেখার জগতে</h2>
        <p className="text-gray-600 mt-1">তোমার শিক্ষাজীবনের সেরা সঙ্গী</p>
      </section>

      {/* Swiper Carousel */}
      <section className="mt-6 px-4">
        <Swiper
          spaceBetween={16}
          slidesPerView={1.2}
          pagination={{ clickable: true }}
          modules={[Pagination]}
        >
          <SwiperSlide>
            <div className="bg-[#21409A] text-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold">নতুন কোর্স</h3>
              <p className="text-sm mt-2">এই সপ্তাহের নতুন সংযোজন দেখো</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="bg-[#F58220] text-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold">লাইভ ক্লাস</h3>
              <p className="text-sm mt-2">আজকের লাইভ ক্লাসে যোগ দাও</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="bg-[#008060] text-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold">পরীক্ষা প্রস্তুতি</h3>
              <p className="text-sm mt-2">MCQ দিয়ে নিজেকে যাচাই করো</p>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* Main Buttons or Grid Section */}
      <section className="grid grid-cols-2 gap-4 px-4 mt-8 mb-16">
        <DashboardCard title="ক্লাস" color="bg-[#21409A]" />
        <DashboardCard title="অধ্যায়" color="bg-[#F58220]" />
        <DashboardCard title="ভিডিও" color="bg-[#008060]" />
        <DashboardCard title="পরীক্ষা" color="bg-[#AF1F24]" />
      </section>
    </div>
  );
};

const DashboardCard = ({ title, color }) => (
  <div className={`${color} rounded-xl p-5 text-white shadow`}>
    <h4 className="text-lg font-bold">{title}</h4>
  </div>
);

export default HomePage;
