// src/components/DiamondPoints.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Gem } from 'lucide-react'

const DiamondPoints = () => {
  const [points, setPoints] = useState(0)

  useEffect(() => {
    const fetchPoints = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('diamond_points')
        .eq('id', user.id)
        .single()

      if (!error && data) {
        setPoints(data.diamond_points || 0)
      }
    }

    fetchPoints()
  }, [])

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-100 rounded-full shadow text-indigo-700 text-sm font-semibold">
      <Gem size={16} className="text-indigo-500" />
      <span>{points} পয়েন্ট</span>
    </div>
  )
}

export default DiamondPoints
