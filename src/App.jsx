import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
// In your main.jsx or App.jsx
import 'katex/dist/katex.min.css';

// Pages
import Admin from './pages/Admin'
import Classes from './pages/Classes'
import AllCourses from './pages/AllCourses'

const App = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen p-4 bg-zinc-950 text-white">
        <Routes>
          <Route path="/" element={<div className="text-xl font-semibold">Home Page</div>} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/all-courses" element={<AllCourses />} />
          <Route path="/enrolled-courses" element={<div className="text-xl font-semibold">Enrolled Courses Page</div>} />
          <Route path="/exam" element={<div className="text-xl font-semibold">Exam Page</div>} />
          <Route path="/subscription" element={<div className="text-xl font-semibold">Subscription Page</div>} />
          <Route path="/score" element={<div className="text-xl font-semibold">Score Page</div>} />
          <Route path="/notifications" element={<div className="text-xl font-semibold">Notifications Page</div>} />
          <Route path="/profile" element={<div className="text-xl font-semibold">Profile Page</div>} />
          <Route path="/admin" element={<Admin />} />

          {/* Fallback route (optional) */}
          <Route path="*" element={<div className="text-red-400 font-semibold text-lg">404 - Page Not Found</div>} />
        </Routes>
      </main>
    </>
  )
}

export default App
