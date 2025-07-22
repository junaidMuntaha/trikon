import { useState } from 'react'
import CategoryManager from './CategoryManager'
import SubjectManager from './SubjectManager'
import ChapterManager from './ChapterManager'
import ResourceManager from './ResourceManager'
import CourseManager from './CourseManager'
import ExamManager from './ExamManager'
import QuestionManager from './QuestionManager' // ✅ Import

const Dashboard = () => {
  const [tab, setTab] = useState('category')

  const renderTab = () => {
    switch (tab) {
      case 'category':
        return <CategoryManager />
      case 'subject':
        return <SubjectManager />
      case 'chapter':
        return <ChapterManager />
      case 'resource':
        return <ResourceManager />
      case 'course':
        return <CourseManager />
      case 'exam':
        return <ExamManager />
      case 'question':
        return <QuestionManager /> // ✅ Add case
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          ['category', 'Categories'],
          ['subject', 'Subjects'],
          ['chapter', 'Chapters'],
          ['resource', 'Resources'],
          ['course', 'Courses'],
          ['exam', 'Exams'],
          ['question', 'Questions'], // ✅ Add button
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded ${
              tab === key ? 'bg-blue-600' : 'bg-zinc-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div>{renderTab()}</div>
    </div>
  )
}

export default Dashboard
