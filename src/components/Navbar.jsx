import { useState, useEffect } from "react"
import { Link, NavLink } from "react-router-dom"
import { Menu, X, Bell, UserCircle } from "lucide-react"
import { supabase } from "../lib/supabaseClient"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
    }

    getUser()
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
  }, [])

  const navItems = [
    { name: "Classes", path: "/classes" },
    { name: "All Courses", path: "/all-courses" },
    { name: "Exam", path: "/exam" },
    { name: "Subscription", path: "/subscription" },
    { name: "Score", path: "/score" },
  ]

  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition duration-300
     ${isActive ? "text-cyan-400 bg-white/10 shadow" : "text-black/80 hover:text-white hover:bg-white/5"}`

  return (
    <nav className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl shadow-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center relative">

        {/* Glowing Logo */}
        <div className="relative">
          <div className="absolute -inset-1 blur-md opacity-40 bg-gradient-to-r from-fuchsia-500 via-sky-400 to-cyan-400 rounded-lg animate-pulse"></div>
          <Link
            to="/"
            className="relative z-10 text-3xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-sky-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm hover:drop-shadow-lg transition duration-300"
          >
            Tri<span className="bg-gradient-to-r from-yellow-300 via-green-400 to-teal-400 bg-clip-text text-transparent">kon</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={navLinkStyle}>
              {item.name}
            </NavLink>
          ))}

          {/* Profile icon instead of Login (for testing) */}
          <NavLink
            to="/profile"
            className="flex items-center gap-1 text-gray-600 hover:text-cyan-400 transition text-sm"
          >
            <UserCircle className="w-6 h-6" />
          </NavLink>

          {user?.email === "admin@example.com" && (
            <NavLink to="/admin/dashboard" className={navLinkStyle}>Admin</NavLink>
          )}
        </div>

        {/* Right side: Notification & Profile for logged-in users */}
        <div className="hidden md:flex items-center gap-3 absolute right-4 top-1/2 -translate-y-1/2">
          {user && (
            <>
              <NavLink to="/notifications" className="text-gray-600 hover:text-cyan-400 transition">
                <Bell className="w-5 h-5" />
              </NavLink>
              <NavLink to="/profile" className="text-gray-600 hover:text-cyan-400 transition">
                <UserCircle className="w-6 h-6" />
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 transition-all duration-300">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkStyle}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}

          {/* Profile icon instead of Login */}
          <NavLink
            to="/profile"
            className={navLinkStyle}
            onClick={() => setIsOpen(false)}
          >
            <UserCircle className="w-5 h-5" />
          </NavLink>

          {user && (
            <NavLink to="/notifications" className={navLinkStyle} onClick={() => setIsOpen(false)}>
              <Bell className="w-5 h-5" /> Notifications
            </NavLink>
          )}

          {user?.email === "admin@example.com" && (
            <NavLink to="/admin/dashboard" className={navLinkStyle} onClick={() => setIsOpen(false)}>
              Admin
            </NavLink>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
