import { useState } from 'react'
import Dashboard from './admin/Dashboard' // ✅ Import Dashboard, not CategoryManager

const Admin = () => {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const correctPassword = '1234' // Change later for .env

  const handleLogin = () => {
    if (password === correctPassword) setIsAuthenticated(true)
    else alert('Incorrect password')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <div className="bg-white/10 p-8 rounded-xl shadow-xl backdrop-blur-lg w-full max-w-sm">
          <h2 className="text-xl font-semibold text-white mb-4 text-center">Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full p-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  // ✅ Render the full tabbed dashboard now
  return (
    <Dashboard />
  )
}

export default Admin
