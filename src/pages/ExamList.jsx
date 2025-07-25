// src/pages/ExamList.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ExamList = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      const { data } = await supabase.from("exams").select("*");
      setExams(data || []);
    };
    fetchExams();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">📝 এক্সাম তালিকা</h1>
      <div className="grid gap-4">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-gray-800 p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{exam.title}</h2>
            <p className="text-sm text-gray-300 mb-2">{exam.description}</p>
            <Link
              to={`/exam/start/${exam.id}`}
              className="inline-block mt-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              পরীক্ষা দিন
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamList;
