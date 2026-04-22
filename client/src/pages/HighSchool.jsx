import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { syncProgressFromServer } from '../lib/progress'

export default function HighSchool() {
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await syncProgressFromServer(2)
        return navigate('/dashboard?category=2', { replace: true })
      }
      const { data } = await supabase.from('lessons').select('id').eq('category_id', 2).order('id').limit(1).single()
      if (data) navigate(`/quiz/${data.id}`, { state: { isFirst: true, categoryId: 2 }, replace: true })
    }
    load()
  }, [])

  return <p className="text-center mt-20 text-gray-500">Loading...</p>
}
