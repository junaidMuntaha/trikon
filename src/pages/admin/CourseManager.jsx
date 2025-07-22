// src/pages/admin/CourseManager.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const CourseManager = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [courses, setCourses] = useState([])

  const [form, setForm] = useState({
    title: '',
    description: '',
    thumbnail_url: '',
    price: '',
    discounted_price: '',
    duration: '',
    instructor: '',
    syllabus: '',
    level: 'Beginner',
    department: '',
    rating: '',
    rating_count: '',
    total_classes: '',
    total_exams: '',
    enrolled: '',
  })

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select()
      if (error) {
        console.error('Category fetch error:', error)
      } else {
        setCategories(data || [])
      }
    }
    fetchCategories()
  }, [])

  // Fetch courses for selected category
  useEffect(() => {
    const fetchCourses = async () => {
      if (!selectedCategory) return
      const { data, error } = await supabase
        .from('courses')
        .select()
        .eq('category_id', selectedCategory.id)
      if (!error) setCourses(data || [])
    }
    fetchCourses()
  }, [selectedCategory])

  // Add new course
  const handleAddCourse = async () => {
    if (!selectedCategory) return alert('Select a category first')

    const { error } = await supabase.from('courses').insert({
      ...form,
      category_id: selectedCategory.id,
      price: Number(form.price),
      discounted_price: Number(form.discounted_price),
      rating: Number(form.rating),
      rating_count: Number(form.rating_count),
      total_classes: Number(form.total_classes),
      total_exams: Number(form.total_exams),
      enrolled: Number(form.enrolled),
    })

    if (!error) {
      setForm({
        title: '',
        description: '',
        thumbnail_url: '',
        price: '',
        discounted_price: '',
        duration: '',
        instructor: '',
        syllabus: '',
        level: 'Beginner',
        department: '',
        rating: '',
        rating_count: '',
        total_classes: '',
        total_exams: '',
        enrolled: '',
      })
      const { data } = await supabase
        .from('courses')
        .select()
        .eq('category_id', selectedCategory.id)
      setCourses(data || [])
    }
  }

  const handleDeleteCourse = async (id) => {
    await supabase.from('courses').delete().eq('id', id)
    const { data } = await supabase
      .from('courses')
      .select()
      .eq('category_id', selectedCategory.id)
    setCourses(data || [])
  }

  return (
    <div className="text-white px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">📚 Course Manager</h2>

      {/* Select Category */}
      <div className="mb-6">
        <label className="block mb-1">Select Category</label>
        <select
          value={selectedCategory?.id || ''}
          onChange={(e) => {
            const selectedId = e.target.value
            const cat = categories.find((c) => String(c.id) === selectedId)
            setSelectedCategory(cat || null)
          }}
          className="w-full bg-zinc-800 p-2 rounded"
        >
          <option value="">-- Select --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Course Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          ['title', 'Course Title'],
          ['description', 'Description'],
          ['thumbnail_url', 'Thumbnail URL'],
          ['department', 'Department'],
          ['instructor', 'Instructor'],
          ['syllabus', 'Syllabus'],
          ['duration', 'Course Duration'],
          ['price', 'Price (₹)'],
          ['discounted_price', 'Discounted Price (₹)'],
          ['rating', 'Rating (1–5)'],
          ['rating_count', 'Rating Count'],
          ['total_classes', 'Total Classes'],
          ['total_exams', 'Total Exams'],
          ['enrolled', 'Enrolled Students'],
        ].map(([field, label]) => (
          <div key={field}>
            <label className="block text-sm mb-1">{label}</label>
            <input
              type="text"
              value={form[field]}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, [field]: e.target.value }))
              }
              className="w-full bg-zinc-800 p-2 rounded"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm mb-1">Level</label>
          <select
            value={form.level}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, level: e.target.value }))
            }
            className="w-full bg-zinc-800 p-2 rounded"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleAddCourse}
        className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white mb-6"
      >
        ➕ Add Course
      </button>

      {/* Course List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white/10 backdrop-blur-lg p-4 rounded-xl shadow-xl"
          >
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-40 object-cover rounded-lg mb-2"
            />
            <h3 className="text-lg font-bold">{course.title}</h3>
            <p className="text-sm text-gray-300 mb-1">
              {course.description?.slice(0, 60)}...
            </p>
            <p className="text-xs text-zinc-400 mb-1">
              {course.duration} · {course.level}
            </p>
            <p className="text-sm text-yellow-300">
              ₹{course.discounted_price}{' '}
              <span className="line-through text-red-400 ml-2">
                ₹{course.price}
              </span>
            </p>
            <button
              onClick={() => handleDeleteCourse(course.id)}
              className="text-sm mt-2 text-red-400 hover:underline"
            >
              🗑 Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CourseManager
