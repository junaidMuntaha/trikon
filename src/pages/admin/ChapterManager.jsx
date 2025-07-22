import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const ChapterManager = () => {
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [chapters, setChapters] = useState([])
  const [newChapter, setNewChapter] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      const { data, error } = await supabase.from('subjects').select()
      if (error) {
        console.error('Error fetching subjects:', error)
      } else {
        setSubjects(data)
      }
    }
    fetchSubjects()
  }, [])

  // Fetch chapters for selected subject
  useEffect(() => {
    if (!selectedSubject) return

    const fetchChapters = async () => {
      console.log('Selected Subject ID:', selectedSubject)

      const { data, error } = await supabase
        .from('chapters')
        .select()
        .eq('subject_id', selectedSubject)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching chapters:', error)
      } else {
        console.log('Chapters:', data)
        setChapters(data)
      }
    }

    fetchChapters()
  }, [selectedSubject])

  // Add new chapter
  const handleAddChapter = async () => {
    if (!newChapter || !selectedSubject) return
    setLoading(true)

    const { error } = await supabase.from('chapters').insert([
      {
        title: newChapter,
        subject_id: selectedSubject,
      },
    ])

    if (error) {
      console.error('Error adding chapter:', error)
    } else {
      const { data } = await supabase
        .from('chapters')
        .select()
        .eq('subject_id', selectedSubject)
        .order('created_at', { ascending: false })
      setChapters(data)
      setNewChapter('')
    }

    setLoading(false)
  }

  // Delete chapter
  const handleDelete = async (id) => {
    const { error } = await supabase.from('chapters').delete().eq('id', id)
    if (error) {
      console.error('Error deleting chapter:', error)
    } else {
      setChapters((prev) => prev.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="bg-white/5 p-4 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">📑 Manage Chapters</h2>

      {/* Subject Selector */}
      <select
        className="mb-4 p-2 bg-zinc-800 text-white rounded w-full"
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
      >
        <option value="">Select a subject</option>
        {subjects.map((subj) => (
          <option key={subj.id} value={subj.id}>
            {subj.title || subj.name}
          </option>
        ))}
      </select>

      {/* Add New Chapter */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 p-2 rounded bg-zinc-800 text-white"
          placeholder="Enter chapter name"
          value={newChapter}
          onChange={(e) => setNewChapter(e.target.value)}
        />
        <button
          onClick={handleAddChapter}
          disabled={loading}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>

      {/* Chapter List */}
      <ul className="space-y-2">
        {chapters.length > 0 ? (
          chapters.map((chapter) => (
            <li
              key={chapter.id}
              className="bg-white/10 p-3 rounded flex justify-between items-center"
            >
              <span>{chapter.title}</span>
              <button
                onClick={() => handleDelete(chapter.id)}
                className="text-red-400 hover:text-red-600 transition"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-400">No chapters yet for this subject.</p>
        )}
      </ul>
    </div>
  )
}

export default ChapterManager
