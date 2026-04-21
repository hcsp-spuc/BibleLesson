import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaBookOpen, FaSchool, FaUserGraduate, FaLock, FaCheckCircle, FaChevronRight } from 'react-icons/fa'
import { supabase } from '../lib/supabase'

const categoryMeta = {
  1: { label: 'Elementary',      icon: <FaBookOpen />,     color: 'text-blue-600',   border: 'border-blue-300',   bg: 'bg-blue-50',   accent: 'bg-blue-600'   },
  2: { label: 'High School',     icon: <FaSchool />,       color: 'text-green-700',  border: 'border-green-300',  bg: 'bg-green-50',  accent: 'bg-green-700'  },
  3: { label: 'Adult / College', icon: <FaUserGraduate />, color: 'text-purple-700', border: 'border-purple-300', bg: 'bg-purple-50', accent: 'bg-purple-700' },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const categoryId = parseInt(searchParams.get('category') ?? '1')
  const meta = categoryMeta[categoryId] ?? categoryMeta[1]

  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)

  function isLessonDone(index) {
    if (index === 0) return true
    return localStorage.getItem(`cat${categoryId}_lesson${index + 1}_done`) === 'true'
  }

  useEffect(() => {
    supabase
      .from('lessons')
      .select('id, title')
      .eq('category_id', categoryId)
      .order('id')
      .then(({ data }) => {
        setLessons(data ?? [])
        setLoading(false)
      })
  }, [categoryId])

  if (loading) return <p className="text-center mt-20 text-gray-500 text-xl">Loading...</p>

  const lesson1 = lessons[0]
  const restLessons = lessons.slice(1)

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Hero */}
      <div
        className="relative flex flex-col items-center justify-center text-center py-20 px-6 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/header-background.png')" }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <FaBookOpen className="text-yellow-400 text-4xl" />
            <span className="text-white text-4xl font-extrabold tracking-tight">BibleLearn</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">{meta.label} Lessons</h1>
          <p className="text-blue-100 text-xl">Continue your Bible study journey.</p>
        </div>
      </div>

      {/* Lesson list */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Lesson 1 — always completed */}
        {lesson1 && (
          <div
            onClick={() => navigate(`/quiz/${lesson1.id}`, { state: { reviewMode: true } })}
            className="group flex flex-col items-center rounded-2xl border-2 border-green-400 bg-white shadow-sm px-6 py-8 cursor-pointer hover:shadow-lg transition text-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <FaCheckCircle className="text-green-500 text-3xl" />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-green-600 mb-2">Lesson 1 — Completed</p>
            <p className="text-2xl font-bold text-gray-800 mb-6 flex-1">{lesson1.title}</p>
            <div className="flex items-center gap-2 text-green-600">
              <span className="text-base font-semibold">Review</span>
              <FaChevronRight className="text-sm" />
            </div>
          </div>
        )}

        {/* Lessons 2+ */}
        {restLessons.map((lesson, i) => {
          const lessonIndex = i + 1
          const done = isLessonDone(lessonIndex)
          const locked = !isLessonDone(lessonIndex - 1)

          return (
            <div
              key={lesson.id}
              onClick={() => !locked && navigate(`/quiz/${lesson.id}`, done ? { state: { reviewMode: true } } : undefined)}
              className={`group flex flex-col items-center rounded-2xl border-2 px-6 py-8 transition text-center ${
                locked
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                  : done
                  ? 'border-green-400 bg-white shadow-sm cursor-pointer hover:shadow-lg'
                  : `${meta.border} bg-white shadow-sm cursor-pointer hover:shadow-lg`
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                locked ? 'bg-gray-100' : done ? 'bg-green-100' : meta.bg
              }`}>
                {locked
                  ? <FaLock className="text-gray-400 text-2xl" />
                  : done
                  ? <FaCheckCircle className="text-green-500 text-3xl" />
                  : <span className={`text-2xl ${meta.color}`}>{meta.icon}</span>
                }
              </div>
              <p className={`text-sm font-bold uppercase tracking-widest mb-2 ${
                locked ? 'text-gray-400' : done ? 'text-green-600' : meta.color
              }`}>
                Lesson {lessonIndex + 1}{done ? ' — Completed' : locked ? ' — Locked' : ''}
              </p>
              <p className={`text-2xl font-bold mb-6 flex-1 ${
                locked ? 'text-gray-400' : 'text-gray-800'
              }`}>
                {lesson.title}
              </p>
              {!locked && (
                <div className={`flex items-center gap-2 ${
                  done ? 'text-green-600' : meta.color
                }`}>
                  <span className="text-base font-semibold">{done ? 'Review' : 'Start'}</span>
                  <FaChevronRight className="text-sm" />
                </div>
              )}
            </div>
          )
        })}

        </div>

        {restLessons.some((_, i) => !isLessonDone(i) && !isLessonDone(i + 1)) && (
          <p className="text-center text-gray-400 text-base mt-6">
            Complete each lesson to unlock the next.
          </p>
        )}
      </div>
    </div>
  )
}
