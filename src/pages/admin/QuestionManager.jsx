// src/pages/admin/QuestionManager.jsx
import React, { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "@uiw/react-md-editor/markdown-editor.css";
// import "@uiw/react-markdown-preview/markdown.css";
// import "katex/dist/katex.min.css";
// import "mathlive/dist/mathlive-static.css";
// import "mathlive";

import { supabase } from "../../lib/supabaseClient";

const QuestionManager = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [questionText, setQuestionText] = useState("Type **markdown**, `code`, or $x^2 + y^2 = z^2$ here");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("Explain here with math: $E=mc^2$");
  const [questions, setQuestions] = useState([]);

  const questionMathRef = useRef(null);
  const explanationMathRef = useRef(null);

  useEffect(() => {
    const fetchExams = async () => {
      const { data } = await supabase.from("exams").select();
      setExams(data || []);
    };
    fetchExams();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedExam) return;
      const { data } = await supabase
        .from("questions")
        .select("*")
        .eq("exam_id", selectedExam);
      setQuestions(data || []);
    };
    fetchQuestions();
  }, [selectedExam]);

  const handleSubmit = async () => {
    if (!questionText || options.some((o) => !o) || !correctAnswer) {
      alert("Please fill all fields.");
      return;
    }
    const { error } = await supabase.from("questions").insert({
      exam_id: selectedExam,
      question: questionText,
      options,
      correct_answer: correctAnswer,
      explanation,
    });
    if (!error) {
      alert("Question added!");
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setExplanation("");
    } else {
      alert("Error: " + error.message);
    }
  };

  const deleteQuestion = async (id) => {
    await supabase.from("questions").delete().eq("id", id);
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleImageUpload = async (event, setMarkdown) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("question-images")
      .upload(fileName, file);

    if (error) {
      alert("Upload failed: " + error.message);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("question-images")
      .getPublicUrl(fileName);

    const imageMarkdown = `\n![${file.name}](${urlData.publicUrl})\n`;
    setMarkdown((prev) => prev + imageMarkdown);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">📘 Question Manager</h1>

      <div className="mb-4">
        <label className="block font-semibold">Select Exam:</label>
        <select
          className="w-full p-2 mt-1 bg-gray-800 border border-gray-600 rounded"
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
        >
          <option value="">-- Select Exam --</option>
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Question (Markdown + Math + Images):</label>
        <MDEditor
          value={questionText}
          onChange={setQuestionText}
          previewOptions={{
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeKatex],
          }}
          height={300}
        />
        <input
          type="file"
          accept="image/*"
          className="mt-2"
          onChange={(e) => handleImageUpload(e, setQuestionText)}
        />
        <math-field
          ref={questionMathRef}
          className="mt-2 w-full p-2 rounded border border-gray-700 bg-gray-900 text-white"
          style={{ minHeight: "40px" }}
          virtual-keyboard-mode="onfocus"
        ></math-field>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {options.map((opt, idx) => (
          <input
            key={idx}
            className="p-2 bg-gray-800 border border-gray-600 rounded"
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChange={(e) => {
              const newOpts = [...options];
              newOpts[idx] = e.target.value;
              setOptions(newOpts);
            }}
          />
        ))}
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Correct Answer:</label>
        <input
          className="w-full p-2 mt-1 bg-gray-800 border border-gray-600 rounded"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Explanation (Markdown + Math + Images):</label>
        <MDEditor
          value={explanation}
          onChange={setExplanation}
          previewOptions={{
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeKatex],
          }}
          height={300}
        />
        <input
          type="file"
          accept="image/*"
          className="mt-2"
          onChange={(e) => handleImageUpload(e, setExplanation)}
        />
        <math-field
          ref={explanationMathRef}
          className="mt-2 w-full p-2 rounded border border-gray-700 bg-gray-900 text-white"
          style={{ minHeight: "40px" }}
          virtual-keyboard-mode="onfocus"
        ></math-field>
      </div>

      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
      >
        + Add Question
      </button>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Existing Questions</h2>
        {questions.map((q) => (
          <div
            key={q.id}
            className="mb-4 p-4 rounded bg-gray-800 border border-gray-700"
          >
            <p className="font-semibold">Q:</p>
            <ReactMarkdown
              className="prose prose-invert"
              children={q.question}
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
            />
            <ul className="list-disc list-inside text-sm mt-1">
              {q.options.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
            <p className="text-green-400 text-sm mt-1">✅ Correct: {q.correct_answer}</p>
            <div className="mt-2">
              <p className="text-sm font-medium">Explanation:</p>
              <ReactMarkdown
                className="prose prose-invert"
                children={q.explanation}
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
              />
            </div>
            <button
              onClick={() => deleteQuestion(q.id)}
              className="mt-2 text-red-400 text-sm hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionManager;
