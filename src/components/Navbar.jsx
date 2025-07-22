import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Bell, UserCircle } from 'lucide-react'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)

    const navItems = [
        { name: 'Classes', path: '/classes' },
        { name: 'All Courses', path: '/all-courses' },
        { name: 'Enrolled', path: '/enrolled-courses' },
        { name: 'Exam', path: '/exam' },
        { name: 'Subscription', path: '/subscription' },
        { name: 'Score', path: '/score' },
        { name: 'Notifications', path: '/notifications', icon: <Bell className="w-5 h-5" /> },
        { name: 'Profile', path: '/profile', icon: <UserCircle className="w-5 h-5" /> },
    ]

    const navLinkStyle = ({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition duration-300
     ${isActive
            ? 'text-cyan-400 bg-white/10 shadow'
            : 'text-white/80 hover:text-white hover:bg-white/5'}`

    return (
        <nav className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl shadow-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

                {/* Glowing Logo */}
                <div className="relative">
                    <div className="absolute -inset-1 blur-md opacity-40 bg-gradient-to-r from-fuchsia-500 via-sky-400 to-cyan-400 rounded-lg animate-pulse"></div>
                    <Link
                        to="/"
                        className="relative z-10 text-3xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-sky-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm hover:drop-shadow-lg transition duration-300"
                    >
                        Vector <span className="bg-gradient-to-r from-yellow-300 via-green-400 to-teal-400 bg-clip-text text-transparent">Academy</span>
                    </Link>
                </div>



                {/* Desktop Menu */}
                <div className="hidden md:flex gap-1">
                    {navItems.map((item) => (
                        <NavLink key={item.name} to={item.path} className={navLinkStyle}>
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
                    {isOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="md:hidden px-4 pb-4 space-y-2 animate-fadeInDown">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={navLinkStyle}
                            onClick={() => setIsOpen(false)}
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                </div>
            )}
        </nav>
    )
}

export default Navbar
