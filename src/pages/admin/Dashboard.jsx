import { useState } from "react";
import CategoryManager from "./CategoryManager";
import SubjectManager from "./SubjectManager";
import ChapterManager from "./ChapterManager";
import ResourceManager from "./ResourceManager";
import CourseManager from "./CourseManager";
import QuestionManager from "./QuestionManager"; // ✅ New import

const Dashboard = () => {
  const [tab, setTab] = useState("category");

  const tabs = [
    { key: "category", label: "📂 ক্যাটেগরি" },
    { key: "subject", label: "📘 বিষয়সমূহ" },
    { key: "chapter", label: "📖 অধ্যায়" },
    { key: "resource", label: "📎 রিসোর্স" },
    { key: "course", label: "🎓 কোর্স" },
    { key: "question", label: "❓ প্রশ্নব্যবস্থাপনা" }, // ✅ New tab
  ];

  const renderTab = () => {
    switch (tab) {
      case "category":
        return <CategoryManager />;
      case "subject":
        return <SubjectManager />;
      case "chapter":
        return <ChapterManager />;
      case "resource":
        return <ResourceManager />;
      case "course":
        return <CourseManager />;
      case "question":
        return <QuestionManager />; // ✅ Render QuestionManager
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🛠️ অ্যাডমিন ড্যাশবোর্ড</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            aria-selected={tab === key}
            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200
              ${tab === key ? "bg-blue-600 text-white" : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"}
            `}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4 shadow">
        {renderTab()}
      </div>
    </div>
  );
};

export default Dashboard;
