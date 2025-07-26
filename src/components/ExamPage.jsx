import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ExamPage = () => {
  const { id } = useParams(); // chapter_id
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(900); // 15 minutes
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('exams')
        .select('id, question, options, correct_answer')
        .eq('chapter_id', id);

      if (error) console.error(error);
      else setQuestions(data);
      setLoading(false);
    };

    fetchQuestions();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (submitted) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [submitted]);

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    let count = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) {
        count += 1;
      }
    });
    setScore(count);
    setSubmitted(true);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) return <div className="text-center py-10">Loading Exam...</div>;

  if (!questions.length)
    return <div className="text-center py-10 text-gray-500">No questions found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Chapter Exam</h1>
        <div
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            timer <= 60 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          ⏳ {formatTime(timer)}
        </div>
      </div>

      {/* Questions */}
      {questions.map((q, i) => (
        <div key={q.id} className="border rounded-lg p-4 shadow-sm">
          <p className="font-medium mb-2">
            {i + 1}. {q.question}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {q.options.map((opt, idx) => {
              const isSelected = answers[q.id] === opt;
              const isCorrect = submitted && opt === q.correct_answer;
              const isWrong =
                submitted && isSelected && opt !== q.correct_answer;

              return (
                <button
                  key={idx}
                  onClick={() => !submitted && handleSelect(q.id, opt)}
                  className={`text-left px-4 py-2 rounded border transition-all duration-150 ${
                    isCorrect
                      ? 'bg-green-100 border-green-400'
                      : isWrong
                      ? 'bg-red-100 border-red-400'
                      : isSelected
                      ? 'bg-blue-100 border-blue-400'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Submit or Results */}
      {!submitted ? (
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit Exam
          </button>
        </div>
      ) : (
        <div className="text-center mt-6">
          <p className="text-xl font-semibold">
            ✅ You scored {score} out of {questions.length}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 underline"
          >
            ⬅ Back to Chapter
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
