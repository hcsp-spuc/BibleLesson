import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Lessons() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const [lessons, setLessons] = useState([])
  const [categoryName, setCategoryName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLessons() {
      const { data: cat } = await supabase
        .from('categories')
        .select('name')
        .eq('id', categoryId)
        .single()

      const { data } = await supabase
        .from('lessons')
        .select('id, title, description')
        .eq('category_id', categoryId)

      setCategoryName(cat?.name ?? '')
      setLessons(data ?? [])
      setLoading(false)
    }
    fetchLessons()
  }, [categoryId])

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate('/')} className="text-blue-500 mb-4 hover:underline">← Back</button>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{categoryName} Lessons</h2>
      {lessons.length === 0 ? (
        <p className="text-gray-400">No lessons available yet.</p>
      ) : (
        <div className="grid gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => navigate(`/quiz/${lesson.id}`)}
              className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-700">{lesson.title}</h3>
              {lesson.description && <p className="text-gray-400 text-sm mt-1">{lesson.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
