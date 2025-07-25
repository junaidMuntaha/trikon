// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "./components/Navbar";
import "katex/dist/katex.min.css";
import { supabase } from './lib/supabaseClient'; // Import supabase client

// 🧠 Admin Pages
import Admin from "./pages/Admin";
import Dashboard from "./pages/admin/Dashboard";
import CategoryManager from "./pages/admin/CategoryManager";
import SubjectManager from "./pages/admin/SubjectManager";
import ChapterManager from "./pages/admin/ChapterManager";
import ResourceManager from "./pages/admin/ResourceManager";
import CourseManager from "./pages/admin/CourseManager";

// 🎓 User Pages
import Classes from "./pages/Classes";
import AllCourses from "./pages/AllCourses";
import Exam from "./pages/Exam";
import Profile from "./pages/Profile";
import Auth from "./components/Auth"
import Notifications from "./pages/Notifications"; // Corrected: Ensure 'Notifications' is imported with correct casing

// 📄 Placeholder Page Component
const Placeholder = ({ label }) => (
  <div className="text-xl font-semibold text-gray-800 dark:text-white p-6">
    {label}
  </div>
);

// New component for protected routes
// This component checks if a session exists before rendering its children.
// If no session, it redirects to the /auth page.
const ProtectedRoute = ({ children, session }) => {
  const navigate = useNavigate();
  useEffect(() => {
    // If there's no session and loading is complete, redirect to auth page
    // Note: This useEffect runs on every render. Consider if you need a more
    // fine-grained check (e.g., only redirect if session changes from non-null to null)
    if (session === null) {
      navigate('/auth');
    }
  }, [session, navigate]);

  // Render children only if session exists
  return session ? children : null;
};


const App = () => {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate hook for programmatic navigation

  useEffect(() => {
    // Function to get the current Supabase session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoadingSession(false);
    };

    getInitialSession();

    // Set up a listener for authentication state changes
    // This will update the session state whenever a user logs in, logs out, etc.
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      // If the new session is null (user logged out), redirect to the authentication page
      if (!newSession) {
        navigate('/auth');
      }
    });

    // Cleanup function for the effect: unsubscribe from the auth listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]); // Add navigate to the dependency array to ensure effect re-runs if navigate changes (though it's stable)

  // Show a loading message while the session is being checked
  if (loadingSession) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold text-gray-800 dark:text-white">
        Checking session...
      </div>
    );
  }

  return (
    <>
      {/* Only render the Navbar if a user session exists (i.e., user is logged in) */}
      {session && <Navbar />}

      <main className="min-h-screen p-4 text-black dark:text-white bg-gray-50 dark:bg-gray-900">
        <Routes>
          {/* Public Route for Authentication */}
          {/* When a user successfully logs in/signs up, navigate them to the profile page */}
          <Route path="/auth" element={<Auth onLoggedIn={() => navigate('/profile')} />} />

          {/* 🏠 Main User Pages (Protected by ProtectedRoute) */}
          {/* Wrap all routes that require authentication with ProtectedRoute */}
          <Route path="/" element={<ProtectedRoute session={session}><Placeholder label="🏠 হোম পেজ" /></ProtectedRoute>} />
          <Route path="/classes" element={<ProtectedRoute session={session}><Classes /></ProtectedRoute>} />
          <Route path="/all-courses" element={<ProtectedRoute session={session}><AllCourses /></ProtectedRoute>} />
          <Route path="/exam" element={<ProtectedRoute session={session}><Exam /></ProtectedRoute>} />
          <Route path="/enrolled-courses" element={<ProtectedRoute session={session}><Placeholder label="📚 এনরোল্ড কোর্সসমূহ" /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute session={session}><Placeholder label="💳 সাবস্ক্রিপশন" /></ProtectedRoute>} />
          <Route path="/score" element={<ProtectedRoute session={session}><Placeholder label="📊 পরীক্ষার ফলাফল" /></ProtectedRoute>} />
          {/* Corrected: Uncommented and used correct component name 'Notifications' */}
          <Route path="/notifications" element={<ProtectedRoute session={session}><Notifications /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute session={session}><Profile /></ProtectedRoute>} />
          
          {/* 🛠️ Admin Panel (Protected by ProtectedRoute for general login) */}
          {/* Note: For true admin protection, you'd add role-based checks within ProtectedRoute or Admin component */}
          <Route path="/admin" element={<ProtectedRoute session={session}><Admin /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute session={session}><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute session={session}><CategoryManager /></ProtectedRoute>} />
          <Route path="/admin/subjects" element={<ProtectedRoute session={session}><SubjectManager /></ProtectedRoute>} />
          <Route path="/admin/chapters" element={<ProtectedRoute session={session}><ChapterManager /></ProtectedRoute>} />
          <Route path="/admin/resources" element={<ProtectedRoute session={session}><ResourceManager /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute session={session}><CourseManager /></ProtectedRoute>} />

          {/* ❌ 404 Not Found Page */}
          <Route
            path="*"
            element={
              <div className="text-red-500 font-semibold text-lg p-6">
                ❌ ৪০৪ - পৃষ্ঠা খুঁজে পাওয়া যায়নি
              </div>
            }
          />
        </Routes>
      </main>
    </>
  );
};

export default App;