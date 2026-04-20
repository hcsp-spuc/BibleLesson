import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Elementary() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase
      .from('lessons')
      .select('id')
      .eq('category_id', 1)
      .order('id')
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) navigate(`/quiz/${data.id}`, { state: { isFirst: true, categoryId: 1 }, replace: true })
        else setLoading(false)
      })
  }, [])

  return <p className="text-center mt-20 text-gray-500">Loading...</p>
}
