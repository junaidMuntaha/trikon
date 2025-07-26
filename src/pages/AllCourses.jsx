import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import SearchInput from './SearchInput'
import CategoryFilter from './CategoryFilter'
import CourseCard from './CourseCard'

const AllCourses = () => {
  const [categories, setCategories] = useState([])
  const [allCourses, setAllCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)

  // 🧠 Fetch all categories
  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*').order('id')
    if (error) console.error('Error fetching categories:', error)
    else setCategories(data)
  }

  // 📦 Fetch all courses and join with category name
  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*, categories(name)')
      .order('id')
    if (error) console.error('Error fetching courses:', error)
    else {
      // Flatten category name for easier access
      const coursesWithCategory = data.map((c) => ({
        ...c,
        category_name: c.categories?.name || '',
      }))
      setAllCourses(coursesWithCategory)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchCourses()
  }, [])

  // 🧪 Filtered & grouped by visible categories
  const filteredCategories = activeCategory
    ? categories.filter((cat) => cat.id === activeCategory)
    : categories

  const getCoursesByCategory = (catId) => {
    return allCourses
      .filter((course) => course.category_id === catId)
      .filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50 text-gray-900 font-['Hind Siliguri',sans-serif]">
      {/* 🔰 Header */}
      <header className="mb-6 bg-gray-800 rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-48 h-48 bg-indigo-500 rounded-full opacity-10"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-48 h-48 bg-teal-500 rounded-full opacity-10"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold text-white tracking-tight">সকল কোর্স</h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            আপনার প্রয়োজন অনুযায়ী সেরা কোর্সটি বেছে নিয়ে শিক্ষাযাত্রা শুরু করুন।
          </p>
        </div>
      </header>

      {/* 🔍 Search Bar */}
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="কোর্স সার্চ করুন..."
      />

      {/* 🧭 Filter Buttons */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onChangeCategory={setActiveCategory}
      />

      {/* 🎓 Course Grid by Category */}
      {filteredCategories.map((cat) => {
        const courses = getCoursesByCategory(cat.id)
        return (
          <div key={cat.id} className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-center">{cat.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            {courses.length === 0 && (
              <p className="text-center text-gray-500 italic mt-4">
                এই বিভাগে কোনো কোর্স পাওয়া যায়নি।
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default AllCourses
