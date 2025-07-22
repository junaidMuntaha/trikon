import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const ExamManager = () => {
  const [exams, setExams] = useState([])
  const [selectedExam, setSelectedExam] = useState(null)
  const [questions, setQuestions] = useState([])

  const [examForm, setExamForm] = useState({
    title: '',
    description: '',
    duration_minutes: '',
    start_time: '',
    end_time: '',
  })

  const [questionForm, setQuestionForm] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'a',
  })

  useEffect(() => {
    const fetchExams = async () => {
      const { data } = await supabase.from('exams').select()
      setExams(data || [])
    }
    fetchExams()
  }, [])

  useEffect(() => {
    if (selectedExam?.id) {
      const fetchQuestions = async () => {
        const { data } = await supabase
          .from('questions')
          .select()
          .eq('exam_id', selectedExam.id)
        setQuestions(data || [])
      }
      fetchQuestions()
    } else {
      setQuestions([])
    }
  }, [selectedExam])

  const handleAddExam = async () => {
    const { error } = await supabase.from('exams').insert([examForm])
    if (!error) {
      setExamForm({
        title: '',
        description: '',
        duration_minutes: '',
        start_time: '',
        end_time: '',
      })
      const { data } = await supabase.from('exams').select()
      setExams(data || [])
    }
  }

  const handleDeleteExam = async (id) => {
    await supabase.from('exams').delete().eq('id', id)
    setSelectedExam(null)
    const { data } = await supabase.from('exams').select()
    setExams(data || [])
  }

  const handleAddQuestion = async () => {
    const { error } = await supabase.from('questions').insert([
      {
        ...questionForm,
        exam_id: selectedExam.id,
      },
    ])
    if (!error) {
      setQuestionForm({
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 'a',
      })
      const { data } = await supabase
        .from('questions')
        .select()
        .eq('exam_id', selectedExam.id)
      setQuestions(data || [])
    }
  }

  const handleDeleteQuestion = async (id) => {
    await supabase.from('questions').delete().eq('id', id)
    const { data } = await supabase
      .from('questions')
      .select()
      .eq('exam_id', selectedExam.id)
    setQuestions(data || [])
  }

  return (
    <div className="text-white p-6">
      <h1 className="text-2xl font-bold mb-6">📘 Exam & Question Manager</h1>

      {/* Exam Form */}
      <div className="bg-zinc-800 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Exam</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['title', 'description', 'duration_minutes', 'start_time', 'end_time'].map((field) => (
            <div key={field}>
              <label className="block mb-1 capitalize">{field.replace('_', ' ')}</label>
              <input
                type={field.includes('time') ? 'datetime-local' : 'text'}
                value={examForm[field]}
                onChange={(e) => setExamForm({ ...examForm, [field]: e.target.value })}
                className="w-full p-2 bg-zinc-700 rounded"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleAddExam}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
        >
          ➕ Add Exam
        </button>
      </div>

      {/* Exam List */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Select Exam</h2>
        <select
          value={selectedExam?.id || ''}
          onChange={(e) => {
            const found = exams.find((ex) => ex.id === parseInt(e.target.value))
            setSelectedExam(found)
          }}
          className="w-full p-2 bg-zinc-800 rounded"
        >
          <option value="">-- Select Exam --</option>
          {exams.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.title}
            </option>
          ))}
        </select>
        {selectedExam && (
          <button
            onClick={() => handleDeleteExam(selectedExam.id)}
            className="mt-2 text-red-400 hover:underline text-sm"
          >
            Delete Selected Exam
          </button>
        )}
      </div>

      {/* Question Form */}
      {selectedExam && (
        <div className="bg-zinc-800 p-4 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Add Question to: {selectedExam.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <textarea
              placeholder="Question Text"
              value={questionForm.question_text}
              onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
              className="w-full bg-zinc-700 p-2 rounded col-span-2"
            />
            {['a', 'b', 'c', 'd'].map((opt) => (
              <input
                key={opt}
                type="text"
                placeholder={`Option ${opt.toUpperCase()}`}
                value={questionForm[`option_${opt}`]}
                onChange={(e) =>
                  setQuestionForm({ ...questionForm, [`option_${opt}`]: e.target.value })
                }
                className="w-full bg-zinc-700 p-2 rounded"
              />
            ))}
            <select
              value={questionForm.correct_option}
              onChange={(e) =>
                setQuestionForm({ ...questionForm, correct_option: e.target.value })
              }
              className="w-full bg-zinc-700 p-2 rounded"
            >
              <option value="a">Correct: A</option>
              <option value="b">Correct: B</option>
              <option value="c">Correct: C</option>
              <option value="d">Correct: D</option>
            </select>
          </div>
          <button
            onClick={handleAddQuestion}
            className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
          >
            ➕ Add Question
          </button>
        </div>
      )}

      {/* Question List */}
      {questions.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Questions in: {selectedExam?.title}</h2>
          <ul className="space-y-4">
            {questions.map((q, i) => (
              <li key={q.id} className="bg-zinc-800 p-3 rounded shadow">
                <div className="mb-1 font-medium">{i + 1}. {q.question_text}</div>
                <div className="text-sm text-zinc-300">
                  <p>A. {q.option_a}</p>
                  <p>B. {q.option_b}</p>
                  <p>C. {q.option_c}</p>
                  <p>D. {q.option_d}</p>
                  <p className="text-green-400 mt-1">✔ Correct: {q.correct_option.toUpperCase()}</p>
                </div>
                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="mt-1 text-red-400 hover:underline text-sm"
                >
                  Delete Question
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ExamManager
