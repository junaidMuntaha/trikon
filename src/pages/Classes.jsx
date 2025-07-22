import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { Bookmark, BookmarkCheck, FileText, PlayCircle } from 'lucide-react'

const Classes = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [chapters, setChapters] = useState([])
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [videos, setVideos] = useState([])
  const [notes, setNotes] = useState([])
  const [bookmarked, setBookmarked] = useState(false)
  const [progress, setProgress] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select()
      setCategories(data || [])
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (!selectedCategory) return
    const fetchSubjects = async () => {
      const { data } = await supabase
        .from('subjects')
        .select()
        .eq('category_id', selectedCategory.id)
      setSubjects(data || [])
    }
    fetchSubjects()
  }, [selectedCategory])

  useEffect(() => {
    if (!selectedSubject) return
    const fetchChapters = async () => {
      const { data } = await supabase
        .from('chapters')
        .select()
        .eq('subject_id', selectedSubject.id)
      setChapters(data || [])
    }
    fetchChapters()
  }, [selectedSubject])

  useEffect(() => {
    if (!selectedChapter) return
    const fetchResources = async () => {
      const { data: videoData } = await supabase
        .from('videos')
        .select()
        .eq('chapter_id', selectedChapter.id)

      const { data: noteData } = await supabase
        .from('notes')
        .select()
        .eq('chapter_id', selectedChapter.id)

      setVideos(videoData || [])
      setNotes(noteData || [])

      setProgress(Math.floor(Math.random() * 100)) // Simulated progress
      setBookmarked(selectedChapter?.bookmarked || false)
    }
    fetchResources()
  }, [selectedChapter])

  const toggleBookmark = async () => {
    if (!selectedChapter) return
    const newStatus = !bookmarked
    setBookmarked(newStatus)
    await supabase
      .from('chapters')
      .update({ bookmarked: newStatus })
      .eq('id', selectedChapter.id)
  }

  const resetToSubject = () => {
    setSelectedChapter(null)
    setVideos([])
    setNotes([])
  }

  const resetToCategory = () => {
    setSelectedSubject(null)
    setChapters([])
  }

  const resetToHome = () => {
    setSelectedCategory(null)
    setSubjects([])
  }

  return (
    <div className="min-h-screen p-6 bg-zinc-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Classes</h1>

      {(selectedChapter || selectedSubject || selectedCategory) && (
        <button
          onClick={() => {
            if (selectedChapter) resetToSubject()
            else if (selectedSubject) resetToCategory()
            else resetToHome()
          }}
          className="text-blue-400 hover:underline mb-4 inline-block"
        >
          ← Back
        </button>
      )}

      {/* Category Cards */}
      {!selectedCategory && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className="cursor-pointer p-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition transform hover:scale-105
              bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-black backdrop-blur-sm bg-opacity-70 border border-white/20"
            >
              {cat.name}
            </div>
          ))}
        </div>
      )}

      {/* Subject Cards */}
      {selectedCategory && !selectedSubject && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Subjects in {selectedCategory.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                onClick={() => setSelectedSubject(subject)}
                className="cursor-pointer p-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition transform hover:scale-105
                bg-gradient-to-r from-green-400 via-blue-400 to-teal-400 text-black backdrop-blur-sm bg-opacity-70 border border-white/20"
              >
                {subject.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chapter Cards */}
      {selectedSubject && !selectedChapter && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Chapters in {selectedSubject.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                onClick={() => setSelectedChapter(chapter)}
                className="cursor-pointer relative p-6 rounded-xl shadow-md hover:shadow-2xl transition transform hover:scale-105
                bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 text-black backdrop-blur-sm bg-opacity-70 border border-white/20"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">
                    {chapter.title || 'Untitled Chapter'}
                  </h3>
                  <span className="text-xs text-gray-100">
                    {new Date(chapter.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-2 text-sm flex gap-2">
                  <span className="bg-black/30 px-2 py-0.5 rounded">
                    {chapter.description?.slice(0, 40) || 'No description'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Chapter Resources */}
      {selectedChapter && (
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {selectedChapter.title || 'Untitled Chapter'}
            </h2>
            <button onClick={toggleBookmark}>
              {bookmarked ? (
                <BookmarkCheck className="text-green-400" />
              ) : (
                <Bookmark className="text-white" />
              )}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="my-4 w-full bg-gray-700 h-3 rounded-full overflow-hidden">
            <div
              className="bg-green-400 h-3 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video Lectures */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-2">
                <PlayCircle size={18} />
                Video Lectures ({videos.length})
              </h3>
              {videos.length === 0 ? (
                <p className="text-sm text-gray-400">No videos available.</p>
              ) : (
                videos.map((video) => (
                  <div
                    key={video.id}
                    className="mb-4 p-4 rounded-xl shadow-xl hover:shadow-2xl transition bg-gradient-to-r from-pink-500 via-red-500 to-orange-400 text-white"
                  >
                    <p className="font-medium">{video.title}</p>
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline"
                    >
                      Watch Video
                    </a>
                  </div>
                ))
              )}
            </div>

            {/* Notes */}
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-2">
                <FileText size={18} />
                Notes ({notes.length})
              </h3>
              {notes.length === 0 ? (
                <p className="text-sm text-gray-400">No notes available.</p>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="mb-4 p-4 rounded-xl shadow-xl hover:shadow-2xl transition bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 text-white"
                  >
                    <p className="font-medium">{note.title}</p>
                    <a
                      href={note.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline"
                    >
                      Download Note
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Classes
    