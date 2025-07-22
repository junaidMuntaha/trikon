import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

const StudentExamList = () => {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('exams')
        .select('*, subjects(title)')
      if (!error) setExams(data)
      setLoading(false)
    }

    fetchExams()
  }, [])

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-6">📘 পরীক্ষাসমূহ</h2>

      {loading ? (
        <p>লোড হচ্ছে...</p>
      ) : exams.length === 0 ? (
        <p>কোনো পরীক্ষা পাওয়া যায়নি।</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white/10 rounded-xl p-4 backdrop-blur shadow-lg border border-white/10"
            >
              <h3 className="text-xl font-semibold mb-1">{exam.title}</h3>
              <p className="text-sm text-zinc-300 mb-2">
                বিষয়: {exam.subjects?.title || 'N/A'}
              </p>
              <p className="text-sm">মোট প্রশ্ন: {exam.total_questions}</p>
              <p className="text-sm">সময়সীমা: {exam.duration_minutes} মিনিট</p>
              <p className="text-sm text-green-400 mt-1">
                🟢 অবস্থা: সক্রিয়
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigate(`/exam/start/${exam.id}`)}
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm"
                >
                  পরীক্ষা দিন
                </button>
                <button
                  onClick={() => navigate(`/exam/details/${exam.id}`)}
                  className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded text-sm"
                >
                  বিস্তারিত
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentExamList
