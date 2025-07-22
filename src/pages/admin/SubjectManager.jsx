import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'


const SubjectManager = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [subjects, setSubjects] = useState([])
  const [newSubject, setNewSubject] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select()
      if (!error) setCategories(data)
    }
    fetchCategories()
  }, [])

  // Fetch subjects for selected category
  useEffect(() => {
    if (!selectedCategory) return
    const fetchSubjects = async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select()
        .eq('category_id', selectedCategory)
        .order('created_at', { ascending: false })
      if (!error) setSubjects(data)
    }
    fetchSubjects()
  }, [selectedCategory])

  // Add new subject
  const handleAddSubject = async () => {
    if (!newSubject || !selectedCategory) return
    setLoading(true)
    const { error } = await supabase.from('subjects').insert({
      name: newSubject,
      category_id: selectedCategory,
    })
    setNewSubject('')
    setLoading(false)
    if (!error) {
      const { data } = await supabase
        .from('subjects')
        .select()
        .eq('category_id', selectedCategory)
      setSubjects(data)
    }
  }

  // Delete subject
  const handleDelete = async (id) => {
    await supabase.from('subjects').delete().eq('id', id)
    setSubjects((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📘 Manage Subjects</h2>

      {/* Category Selector */}
      <select
        className="mb-4 p-2 bg-zinc-800 text-white rounded w-full"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Add Subject */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 p-2 rounded bg-zinc-800 text-white"
          placeholder="Enter subject name"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
        />
        <button
          onClick={handleAddSubject}
          disabled={loading}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>

      {/* Subjects List */}
      <ul className="space-y-2">
        {subjects.map((subject) => (
          <li
            key={subject.id}
            className="bg-white/10 p-3 rounded flex justify-between items-center"
          >
            <span>{subject.name}</span>
            <button
              onClick={() => handleDelete(subject.id)}
              className="text-red-400 hover:text-red-600 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SubjectManager
