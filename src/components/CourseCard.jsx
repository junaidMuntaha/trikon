import React from 'react';

const CourseCard = ({
  thumbnail,
  department,
  rating,
  liveClasses,
  exams,
  validity,
  enrolled,
  totalSeats,
  price,
  originalPrice,
  level,
  title,
  onDetails,
  onEnroll,
}) => {
  const progress = Math.min(100, Math.round((enrolled / totalSeats) * 100));

  return (
    <div className="w-[480px] h-[360px] rounded-3xl shadow-lg bg-white/5 border border-white/10 backdrop-blur-md p-2 flex flex-col justify-between group hover:shadow-2xl transition-all duration-300 overflow-hidden">
      
      {/* Thumbnail */}
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">
        <img
          src={thumbnail}
          alt="Course thumbnail"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-2 left-2 bg-black/60 text-white px-3 py-1 text-xs rounded-full">{department}</span>
        <span className="absolute top-2 right-2 bg-yellow-400/90 text-black px-3 py-1 text-xs font-bold rounded-full">⭐ {rating}</span>
      </div>

      {/* Title and Level */}
      <div className="px-2 mt-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white truncate">{title}</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 font-bold">{level}</span>
      </div>

      {/* Stats */}
      <div className="flex justify-between px-2 text-xs text-gray-300 mt-1 font-medium">
        <div>
          <div className="text-white text-sm font-bold">{liveClasses}+</div>
          <div>লাইভ ক্লাস</div>
        </div>
        <div>
          <div className="text-white text-sm font-bold">{exams}+</div>
          <div>পরীক্ষা</div>
        </div>
        <div>
          <div className="text-white text-sm font-bold">{validity}</div>
          <div>মেয়াদ</div>
        </div>
      </div>

      {/* Enrollment Progress */}
      <div className="px-2 mt-2">
        <p className="text-sm text-gray-200">ভর্তি হয়েছে: {enrolled} / {totalSeats} জন</p>
        <div className="w-full h-2 bg-gray-700 rounded-full mt-1">
          <div
            className="h-full bg-green-400 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Price and Buttons */}
      <div className="flex justify-between items-center px-2 mt-2">
        <div>
          <div className="text-xl text-white font-bold">৳{price}</div>
          {originalPrice && (
            <div className="text-sm text-gray-400 line-through">৳{originalPrice}</div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onDetails}
            className="px-3 py-2 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-xl hover:bg-indigo-200 transition"
          >
            বিস্তারিত
          </button>
          <button
            onClick={onEnroll}
            className="px-3 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition shadow"
          >
            ভর্তি হোন
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
