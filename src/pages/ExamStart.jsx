// src/pages/ExamStart.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ExamStart = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await supabase
        .from("questions")
        .select("*")
        .eq("exam_id", id);
      setQuestions(data || []);
    };
    fetchQuestions();
  }, [id]);

  const handleOptionChange = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
  };

  const handleSubmit = () => {
    let total = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) total += 1;
    });
    setScore(total);
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">📘 পরীক্ষা শুরু</h1>
      {!submitted ? (
        <>
          {questions.map((q, i) => (
            <div key={q.id} className="mb-6">
              <p className="font-semibold mb-2">
                প্রশ্ন {i + 1}: {q.question}
              </p>
              {q.options.map((opt, j) => (
                <label key={j} className="block">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleOptionChange(q.id, opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded font-semibold"
          >
            ✅ সাবমিট করুন
          </button>
        </>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">📊 আপনার স্কোর: {score} / {questions.length}</h2>
          <p className="text-gray-300">পরীক্ষা শেষ হয়েছে।</p>
        </div>
      )}
    </div>
  );
};

export default ExamStart;
