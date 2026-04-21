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
      .select('id, title, description')
      .eq('category_id', categoryId)
      .order('id')
      .then(({ data }) => {
        setLessons(data ?? [])
        setLoading(false)
      })
  }, [categoryId])

  if (loading) return <p className="text-center mt-20 text-gray-500 text-xl">Loading...</p>

  const completedCount = lessons.filter((_, i) => isLessonDone(i)).length
  const progressPct = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0
  const lesson1 = lessons[0]
  const restLessons = lessons.slice(1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

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

      {/* Progress card */}
      <div className="max-w-4xl mx-auto px-6 mt-10 mb-10">
        <div className="bg-white rounded-2xl shadow-lg px-8 py-6 border border-gray-100 flex items-center gap-8">
          <div className="flex-1">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Your Progress</p>
            <p className="text-3xl font-extrabold text-gray-800 mb-4">
              {completedCount} of {lessons.length} Lessons Completed
            </p>
            <div className="bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex flex-col items-center justify-center shadow-lg shrink-0">
            <span className="text-white text-3xl font-black leading-none">{progressPct}%</span>
            <span className="text-green-100 text-xs font-semibold mt-1">Done</span>
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-gray-800">All Lessons</h2>
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-600 text-base font-semibold transition"
          >
            ← Back to Home
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Lesson 1 — always completed */}
          {lesson1 && (
            <div
              onClick={() => navigate(`/quiz/${lesson1.id}`, { state: { reviewMode: true } })}
              className="group flex flex-col rounded-2xl border-2 border-green-400 bg-white shadow-sm overflow-hidden cursor-pointer hover:shadow-xl transition"
            >
              <div className="bg-green-500 px-6 py-4 flex items-center justify-between">
                <span className="text-white text-base font-extrabold uppercase tracking-widest">Lesson 1</span>
                <FaCheckCircle className="text-white text-xl" />
              </div>
              <div className="flex flex-col items-center text-center px-6 py-8 flex-1">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                  <FaCheckCircle className="text-green-500 text-3xl" />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest text-green-600 mb-2">Completed</p>
                <p className="text-2xl font-extrabold text-gray-800 mb-3">{lesson1.title}</p>
                {lesson1.description && (
                  <p className="text-gray-400 text-base leading-relaxed flex-1">{lesson1.description}</p>
                )}
              </div>
              <div className="px-6 pb-6">
                <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-300 text-green-700 rounded-xl py-4 font-bold text-base group-hover:bg-green-100 transition">
                  <span>Review Lesson</span>
                  <FaChevronRight />
                </div>
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
                className={`group flex flex-col rounded-2xl border-2 overflow-hidden transition ${
                  locked
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                    : done
                    ? 'border-green-400 bg-white shadow-sm cursor-pointer hover:shadow-xl'
                    : `${meta.border} bg-white shadow-sm cursor-pointer hover:shadow-xl`
                }`}
              >
                {/* Card header bar */}
                <div className={`px-6 py-4 flex items-center justify-between ${
                  locked ? 'bg-gray-300' : done ? 'bg-green-500' : meta.accent
                }`}>
                  <span className="text-white text-base font-extrabold uppercase tracking-widest">
                    Lesson {lessonIndex + 1}
                  </span>
                  {locked
                    ? <FaLock className="text-white text-lg" />
                    : done
                    ? <FaCheckCircle className="text-white text-xl" />
                    : <FaChevronRight className="text-white text-lg" />
                  }
                </div>

                {/* Card body */}
                <div className="flex flex-col items-center text-center px-6 py-8 flex-1">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${
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
                    {done ? 'Completed' : locked ? 'Locked' : 'Available'}
                  </p>
                  <p className={`text-2xl font-extrabold mb-3 ${locked ? 'text-gray-400' : 'text-gray-800'}`}>
                    {lesson.title}
                  </p>
                  <p className={`text-base leading-relaxed flex-1 ${locked ? 'text-gray-300' : 'text-gray-400'}`}>
                    {locked
                      ? 'Complete the previous lesson to unlock this one.'
                      : lesson.description || (done ? 'Tap to review your answers.' : 'Ready to begin? Start this lesson now.')}
                  </p>
                </div>

                {/* CTA button */}
                <div className="px-6 pb-6">
                  {locked ? (
                    <div className="flex items-center justify-center gap-2 bg-gray-100 border border-gray-200 text-gray-400 rounded-xl py-4 font-bold text-base">
                      <FaLock className="text-sm" />
                      <span>Locked</span>
                    </div>
                  ) : done ? (
                    <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-300 text-green-700 rounded-xl py-4 font-bold text-base group-hover:bg-green-100 transition">
                      <span>Review Lesson</span>
                      <FaChevronRight />
                    </div>
                  ) : (
                    <div className={`flex items-center justify-center gap-2 ${meta.bg} border ${meta.border} ${meta.color} rounded-xl py-4 font-bold text-base group-hover:opacity-80 transition`}>
                      <span>Start Lesson</span>
                      <FaChevronRight />
                    </div>
                  )}
                </div>
              </div>
            )
          })}

        </div>

        {restLessons.some((_, i) => !isLessonDone(i + 1) && isLessonDone(i)) && (
          <p className="text-center text-gray-400 text-base mt-8">
            Complete each lesson to unlock the next one.
          </p>
        )}
      </div>
    </div>
  )
}
