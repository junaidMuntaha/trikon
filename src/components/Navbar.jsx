import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faUserCircle,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { Gem } from 'lucide-react';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndPoints = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('diamond_points')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setPoints(data.diamond_points || 0);
        }
      }
    };

    fetchUserAndPoints();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        supabase
          .from('profiles')
          .select('diamond_points')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setPoints(data.diamond_points || 0);
          });
      } else {
        setPoints(0);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error.message);
      const messageBox = document.createElement('div');
      messageBox.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-[1000]';
      messageBox.innerText = 'Failed to log out.';
      document.body.appendChild(messageBox);
      setTimeout(() => {
        document.body.removeChild(messageBox);
      }, 3000);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinkClass = ({ isActive }) =>
    `relative text-gray-700 hover:text-indigo-600 font-medium py-2 px-2 transition-colors duration-200 group
    ${isActive ? 'text-indigo-600' : ''}
    transform hover:scale-110`;

  const navLinkUnderline = `absolute bottom-0 left-1/2 w-0 h-[2px] bg-indigo-600 transition-all duration-300 transform -translate-x-1/2 group-hover:w-full group-[.active]:w-full`;

  const iconClass = "text-gray-600 hover:text-indigo-600 transition-colors duration-200 transform hover:scale-125";

  return (
    <>
      <style>{`
        .premium-gradient-text {
          background: linear-gradient(to right, #9333ea, #4f46e5, #0ea5e9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      <nav className="fixed top-0 sm:top-4 left-1/2 transform -translate-x-1/2 z-50
                      bg-white/80 backdrop-blur-md shadow-xl
                      rounded-2xl sm:rounded-full px-4 py-2 sm:px-8 sm:py-3 flex items-center justify-between
                      space-x-4 sm:space-x-8 border border-white/20 max-w-screen-lg w-full sm:w-[95%]">
        <Link to="/" className="text-xl sm:text-2xl font-bold premium-gradient-text hover:opacity-80 transition-opacity duration-200">
          Trikon
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          
          <NavLink to="/all-courses" className={navLinkClass}>
            All Courses
            <span className={navLinkUnderline}></span>
          </NavLink>
          <NavLink to="/classes" className={navLinkClass}>
            Classroom
            <span className={navLinkUnderline}></span>
          </NavLink>
          <NavLink to="/exam" className={navLinkClass}>
            Exam Hall
            <span className={navLinkUnderline}></span>
          </NavLink>
          <NavLink to="/subscription" className={navLinkClass}>
            Subscription
            <span className={navLinkUnderline}></span>
          </NavLink>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {user && (
            <div className="flex items-center gap-1 px-2 py-1 bg-white border border-indigo-100 rounded-full text-indigo-700 text-sm font-semibold shadow-sm">
              <Gem size={14} className="text-indigo-500" />
              <span>{points}</span>
            </div>
          )}

          <Link to="/notifications" className={iconClass}>
            <FontAwesomeIcon icon={faBell} size="lg" />
          </Link>
          {user ? (
            <Link to="/profile" className={iconClass}>
              <FontAwesomeIcon icon={faUserCircle} size="lg" />
            </Link>
          ) : (
            <Link to="/auth" className="bg-indigo-500 text-white px-3 py-1.5 text-sm sm:px-4 sm:py-2 rounded-full hover:bg-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Login
            </Link>
          )}
          <button className="md:hidden text-gray-700 hover:text-indigo-600 transition-colors duration-200" onClick={toggleMobileMenu}>
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} size="lg" />
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-6 sm:space-y-8 transform transition-transform duration-300 ease-in-out">
            <button className="absolute top-4 right-4 text-gray-700 hover:text-indigo-600 transition-colors duration-200" onClick={toggleMobileMenu}>
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            <NavLink to="/classes" className="text-gray-700 hover:text-indigo-600 font-medium text-xl sm:text-2xl py-2" onClick={toggleMobileMenu}>Classes</NavLink>
            <NavLink to="/all-courses" className="text-gray-700 hover:text-indigo-600 font-medium text-xl sm:text-2xl py-2" onClick={toggleMobileMenu}>All Courses</NavLink>
            <NavLink to="/exam" className="text-gray-700 hover:text-indigo-600 font-medium text-xl sm:text-2xl py-2" onClick={toggleMobileMenu}>Exam</NavLink>
            <NavLink to="/subscription" className="text-gray-700 hover:text-indigo-600 font-medium text-xl sm:text-2xl py-2" onClick={toggleMobileMenu}>Subscription</NavLink>
            {user && (
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-medium text-xl sm:text-2xl py-2 transition-colors duration-200">Logout</button>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
