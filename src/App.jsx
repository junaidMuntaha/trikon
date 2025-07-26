import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import "katex/dist/katex.min.css";
import { supabase } from "./lib/supabaseClient";

// 🎓 User Pages
import Classes from "./pages/Classes";
import AllCourses from "./pages/AllCourses";
import Exam from "./pages/Exam";
import Profile from "./pages/Profile";
import Auth from "./components/Auth";
import Notifications from "./pages/Notifications";
import Subscription from "./pages/Subscription";

// 📘 Course & Chapter Pages
import CourseDetail from "./components/CourseDetail";
import ChapterDetail from "./components/ChapterDetail";
import ExamPage from "./components/ExamPage";

// 🏠 New Home Page
import HomePage from "./pages/HomePage";

// 🔒 Protected Route
const ProtectedRoute = ({ children, session, loadingSession }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingSession && session === null) {
      navigate("/auth");
    }
  }, [session, loadingSession, navigate]);

  if (loadingSession) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold text-gray-800 dark:text-white">
        সেশন যাচাই করা হচ্ছে...
      </div>
    );
  }

  return session ? children : null;
};

// 📄 Placeholder Page Component
const Placeholder = ({ label }) => (
  <div className="text-xl font-semibold text-gray-800 dark:text-white p-6">
    {label}
  </div>
);

const App = () => {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoadingSession(false);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) navigate("/auth");
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <>
      {session && <Navbar />}
      <main className="min-h-screen p-4 pt-16 text-black dark:text-white bg-gray-50 dark:bg-gray-900">
        <Routes>
          {/* 🔓 Public Route */}
          <Route path="/auth" element={<Auth onLoggedIn={() => navigate("/profile")} />} />

          {/* 🏠 Home Page */}
          <Route path="/" element={
            <ProtectedRoute session={session} loadingSession={loadingSession}>
              <HomePage />
            </ProtectedRoute>
          } />

          {/* 🎓 User Pages */}
          <Route path="/classes" element={
            <ProtectedRoute session={session} loadingSession={loadingSession}>
              <Classes />
            </ProtectedRoute>
          } />
          <Route path="/all-courses" element={
            <ProtectedRoute session={session} loadingSession={loadingSession}>
              <AllCourses />
            </ProtectedRoute>
          } />
          <Route path="/exam" element={
            <ProtectedRoute session={session} loadingSession={loadingSession}>
              <Exam />
            </ProtectedRoute>
          } />
          <Route path="/exam/:id" element={
            <ProtectedRoute session={session} loadingSession={loadingSession}>
              <ExamPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute session={session} loadingSession={loadingSession}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute session={session} loadingSession={loadingSession}>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/subscription" element={
            <ProtectedRoute session={session} loadingSession={loadingSession}>
              <Subscription />
            </ProtectedRoute>
          } />
          <Route path="/enrolled-courses" element={
            <ProtectedRoute session={session} loadingSession={loadingSession}>
              <Placeholder label="📚 এনরোল্ড কোর্সসমূহ" />
            </ProtectedRoute>
          } />

          {/* 📘 Course Detail Page */}
          <Route path="/course/:id" element={
            <ProtectedRoute session={session} loadingSession={loadingSession}>
              <CourseDetail />
            </ProtectedRoute>
          } />

          {/* 📗 Chapter & Exam Pages */}
          <Route path="/chapter/:id" element={
            <ProtectedRoute session={session} loadingSession={loadingSession}>
              <ChapterDetail />
            </ProtectedRoute>
          } />
          <Route path="/chapter/:id/exam" element={
            <ProtectedRoute session={session} loadingSession={loadingSession}>
              <ExamPage />
            </ProtectedRoute>
          } />

          {/* ❌ 404 Page */}
          <Route
            path="*"
            element={
              <div className="text-center text-red-600 font-bold py-10 text-lg">
                ❌ ৪০৪ - পৃষ্ঠা খুঁজে পাওয়া যায়নি <br />
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  হোমপেজে ফিরে যান
                </button>
              </div>
            }
          />
        </Routes>
      </main>
    </>
  );
};

export default App;
