import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AllCourses = () => {
  const [categories, setCategories] = useState([])
  const [coursesByCategory, setCoursesByCategory] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const { data: catData, error: catErr } = await supabase.from('categories').select()
      if (catErr) return console.error(catErr)

      const { data: courseData, error: courseErr } = await supabase.from('courses').select()
      if (courseErr) return console.error(courseErr)

      const grouped = {}
      catData.forEach((cat) => {
        grouped[cat.id] = {
          category: cat,
          courses: courseData.filter((c) => c.category_id === cat.id),
        }
      })

      setCategories(catData)
      setCoursesByCategory(grouped)
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen px-6 py-10 bg-zinc-900 text-white">
      <h1 className="text-3xl font-bold mb-8">📚 সমস্ত কোর্সসমূহ</h1>

      {categories.map((cat) => (
        <div key={cat.id} className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">{cat.name}</h2>

          <div className="flex flex-wrap gap-8">
            {coursesByCategory[cat.id]?.courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden shadow-xl w-[360px] h-[480px] flex flex-col"
              >
                {/* Thumbnail */}
                <div className="h-[45%] w-full bg-blue-200 flex items-center justify-center text-xl font-bold text-gray-600">
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>Course Image</span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  {/* Tag + Rating */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                      {course.department || 'বিজ্ঞান বিভাগ'}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm">
                      <span>⭐</span>
                      <span>⭐</span>
                      <span>⭐</span>
                      <span>⭐</span>
                      <span>⭐</span>
                      <span className="text-gray-600 ml-1 text-xs">(250 ratings)</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-gray-900 leading-snug mb-2">
                    {course.title || 'কোর্সের নাম'}
                  </h3>

                  {/* Stats */}
                  <div className="flex justify-between text-gray-700 text-sm mb-2">
                    <div className="flex items-center gap-1">
                      👁️ <span>{course.total_classes || '৩০০+'} ক্লাস</span>
                    </div>
                    <div className="flex items-center gap-1">
                      📝 <span>{course.total_exams || '৫০+'} পরীক্ষা</span>
                    </div>
                    <div className="flex items-center gap-1">
                      🔒 <span>{course.duration || '৬'} মাস</span>
                    </div>
                  </div>

                  {/* Enrolled */}
                  <div className="bg-indigo-50 text-indigo-700 rounded-xl py-2 text-center text-sm font-semibold mb-3">
                    👥 {course.enrolled || '৪৫০+'} জন ভর্তি হয়েছে
                  </div>

                  {/* Price */}
                  <div className="text-center text-lg font-bold text-indigo-700 mb-3">
                    ৳{course.price}
                    <span className="text-gray-400 text-sm font-medium line-through ml-2">
                      ৳{Math.floor(course.price * 1.2)}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button className="bg-indigo-100 text-indigo-700 font-semibold text-sm py-2 rounded-xl hover:bg-indigo-200 transition-all">
                      কোর্স বিবরণ
                    </button>
                    <button className="bg-indigo-600 text-white font-semibold text-sm py-2 rounded-xl hover:bg-indigo-700 transition-all">
                      ভর্তি হোন
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AllCourses
