import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { PlusCircle, Trash2 } from 'lucide-react'

const CategoryManager = () => {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch categories
  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true })
    if (error) console.error(error)
    else setCategories(data)
  }

  // Add category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    setLoading(true)
    const { error } = await supabase.from('categories').insert([{ name: newCategory }])
    if (error) alert('Error adding category: ' + error.message)
    setNewCategory('')
    fetchCategories()
    setLoading(false)
  }

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) alert('Error deleting: ' + error.message)
    fetchCategories()
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className="p-4 bg-white/5 rounded-xl shadow border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4">📁 Manage Categories</h2>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="bg-white/10 text-white border border-white/20 rounded px-3 py-2 w-full"
        />
        <button
          onClick={handleAddCategory}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1"
        >
          <PlusCircle size={18} /> Add
        </button>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-300">No categories yet.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex justify-between items-center bg-white/10 rounded px-4 py-2 text-white hover:bg-white/20"
            >
              <span>{cat.name}</span>
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CategoryManager
