import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaBookOpen, FaSchool, FaUserGraduate, FaLock, FaCheckCircle, FaChevronRight, FaStar, FaRocket, FaHeart } from 'react-icons/fa'
import { GiDove, GiOpenBook, GiStarSwirl, GiSunflower, GiButterflyFlower, GiAngelWings, GiCandleLight, GiFishingBoat, GiPalmTree, GiStarMedal } from 'react-icons/gi'
import { supabase } from '../lib/supabase'
import { syncProgressFromServer } from '../lib/progress'

const categoryMeta = {
  1: { label: 'Elementary',      icon: <FaBookOpen />,     color: 'text-blue-600',   border: 'border-blue-300',   bg: 'bg-blue-50',   accent: 'bg-blue-600',   image: '/images/elementary.png'   },
  2: { label: 'High School',     icon: <FaSchool />,       color: 'text-green-700',  border: 'border-green-300',  bg: 'bg-green-50',  accent: 'bg-green-700',  image: '/images/highschool.png'   },
  3: { label: 'Adult / College', icon: <FaUserGraduate />, color: 'text-purple-700', border: 'border-purple-300', bg: 'bg-purple-50', accent: 'bg-purple-700', image: '/images/college.png'      },
}

const kidCardColors = [
  { border: 'border-yellow-400', accent: 'bg-yellow-400', bg: 'bg-yellow-50', text: 'text-yellow-700', btn: 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900' },
  { border: 'border-pink-400',   accent: 'bg-pink-400',   bg: 'bg-pink-50',   text: 'text-pink-700',   btn: 'bg-pink-400 hover:bg-pink-500 text-white'          },
  { border: 'border-sky-400',    accent: 'bg-sky-400',    bg: 'bg-sky-50',    text: 'text-sky-700',    btn: 'bg-sky-400 hover:bg-sky-500 text-white'            },
  { border: 'border-green-400',  accent: 'bg-green-400',  bg: 'bg-green-50',  text: 'text-green-700',  btn: 'bg-green-400 hover:bg-green-500 text-white'        },
  { border: 'border-purple-400', accent: 'bg-purple-400', bg: 'bg-purple-50', text: 'text-purple-700', btn: 'bg-purple-400 hover:bg-purple-500 text-white'      },
  { border: 'border-orange-400', accent: 'bg-orange-400', bg: 'bg-orange-50', text: 'text-orange-700', btn: 'bg-orange-400 hover:bg-orange-500 text-white'      },
]

const kidIcons = [GiDove, GiOpenBook, GiStarSwirl, GiSunflower, GiButterflyFlower, GiAngelWings, GiCandleLight, GiFishingBoat, GiPalmTree, GiStarMedal]

const kidCardImages = [
  'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80', // colorful crayons
  'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&q=80', // happy puppy
  'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&q=80', // rainbow clouds
  'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=400&q=80', // sunflower field
  'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80', // kids playing
  'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&q=80', // colorful balloons
  'https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=400&q=80', // butterfly on flower
  'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=400&q=80', // starry night sky
  'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=400&q=80', // golden sunrise
  'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&q=80', // cute animals
]

function KidDashboard({ lessons, completedCount, progressPct, isLessonDone, navigate }) {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #e0f2fe 0%, #fef9c3 60%, #fce7f3 100%)' }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 40%, #ec4899 100%)' }}>
        {/* Floating background icons */}
        <div className="absolute inset-0 select-none pointer-events-none overflow-hidden">
          {[
            { Icon: FaStar,        cls: 'text-yellow-300 opacity-30 text-5xl absolute top-4 left-8'   },
            { Icon: GiDove,        cls: 'text-white opacity-20 text-6xl absolute top-2 left-1/4'      },
            { Icon: FaHeart,       cls: 'text-pink-300 opacity-30 text-4xl absolute top-8 left-1/2'  },
            { Icon: GiAngelWings,  cls: 'text-white opacity-20 text-7xl absolute top-3 right-1/4'    },
            { Icon: FaStar,        cls: 'text-yellow-200 opacity-25 text-6xl absolute top-6 right-10'},
            { Icon: GiSunflower,   cls: 'text-yellow-300 opacity-20 text-5xl absolute bottom-6 left-12'},
            { Icon: GiStarSwirl,   cls: 'text-white opacity-20 text-6xl absolute bottom-4 left-1/3' },
            { Icon: FaHeart,       cls: 'text-pink-200 opacity-25 text-4xl absolute bottom-8 right-1/3'},
            { Icon: GiDove,        cls: 'text-white opacity-15 text-7xl absolute bottom-2 right-16'  },
            { Icon: GiStarMedal,   cls: 'text-yellow-300 opacity-20 text-5xl absolute top-1/2 left-6'},
          ].map(({ Icon, cls }, i) => <Icon key={i} className={cls} />)}
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center text-center pt-6 pb-10 px-6">
          {/* Icon badge */}
          <div className="flex items-center justify-center mb-5">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 shadow-lg">
              <GiOpenBook className="text-white text-5xl" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg mb-3 tracking-tight">
            Bible Adventure!
          </h1>
          <p className="text-purple-100 text-xl font-semibold flex items-center justify-center gap-2 mb-6">
            Let's learn about God's amazing stories!
            <FaHeart className="text-pink-300 text-lg" />
          </p>

        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12" style={{ display: 'block' }}>
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
              fill="#e0f2fe" />
          </svg>
        </div>
      </div>

      {/* Progress card */}
      <div className="max-w-2xl mx-auto px-6 mt-5 mb-5">
        <div className="bg-white rounded-3xl shadow-xl px-6 py-4 border-4 border-yellow-300 text-center">
          <p className="text-xl font-black text-yellow-500 mb-1 flex items-center justify-center gap-2"><FaStar /> Your Stars <FaStar /></p>
          <p className="text-3xl font-black text-gray-800 mb-2">{completedCount} <span className="text-xl text-gray-400">/ {lessons.length}</span></p>
          <div className="flex gap-1 justify-center mb-3 flex-wrap">
            {lessons.map((_, i) => (
              <FaStar key={i} className={`text-2xl ${isLessonDone(i) ? 'text-yellow-400' : 'text-gray-200'}`} />
            ))}
          </div>
          <div className="bg-gray-100 rounded-full h-5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #facc15, #f97316, #ec4899)' }}
            />
          </div>
          <p className="text-gray-500 font-semibold mt-2 flex items-center justify-center gap-1">{progressPct}% complete — Keep going, Bible Explorer! <FaRocket className="text-orange-400" /></p>
        </div>
      </div>

      {/* Lesson cards */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-black text-center text-purple-600 mb-8 flex items-center justify-center gap-2"><GiAngelWings /> Choose Your Adventure! <GiAngelWings /></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {lessons.map((lesson, i) => {
            const done = isLessonDone(i)
            const locked = i > 0 && !isLessonDone(i - 1)
            const colors = kidCardColors[i % kidCardColors.length]
            const CardIcon = kidIcons[i % kidIcons.length]
            const cardImage = kidCardImages[i % kidCardImages.length]

            return (
              <div
                key={lesson.id}
                onClick={() => !locked && navigate(`/quiz/${lesson.id}`, (done && i === 0) || done ? { state: { reviewMode: true } } : undefined)}
                className={`group flex flex-col rounded-3xl border-4 overflow-hidden transition-all duration-200 ${
                  locked
                    ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                    : `${colors.border} bg-white cursor-pointer hover:scale-105 hover:shadow-2xl shadow-lg`
                }`}
              >
                {/* Card top banner */}
                <div className={`px-5 py-3 flex items-center justify-between ${locked ? 'bg-gray-300' : done ? 'bg-green-400' : colors.accent}`}>
                  <span className="text-white text-sm font-black uppercase tracking-widest">Lesson {i + 1}</span>
                  <span className="text-xl text-white">{locked ? <FaLock /> : done ? <FaCheckCircle /> : <CardIcon />}</span>
                </div>

                {/* Card body */}
                <div
                  className="relative flex flex-col items-center text-center px-5 py-6 flex-1 bg-cover bg-center"
                  style={{ backgroundImage: `url(${cardImage})` }}
                >
                  <div className={`absolute inset-0 ${locked ? 'bg-black/60' : done ? 'bg-green-900/50' : 'bg-black/45'}`} />
                  <div className="relative z-10 flex flex-col items-center w-full flex-1">
                    <div className="text-5xl mb-3 flex items-center justify-center text-white">{locked ? <FaLock /> : done ? <FaStar className="text-yellow-300" /> : <CardIcon />}</div>
                    <p className="text-lg font-black mb-2 text-white drop-shadow">
                      {lesson.title}
                    </p>
                    <p className="text-sm text-gray-200 leading-relaxed flex-1">
                      {locked
                        ? 'Finish the last lesson to unlock! 🔑'
                        : done
                        ? 'Amazing job! Tap to review! 🎉'
                        : lesson.description || 'Ready for a Bible adventure? Let\'s go! 🚀'}
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div className="px-5 pb-5 mt-3">
                  {locked ? (
                    <div className="flex items-center justify-center gap-2 bg-gray-200 text-gray-400 rounded-2xl py-3 font-black text-sm">
                      <FaLock /> Locked
                    </div>
                  ) : done ? (
                    <div className="flex items-center justify-center gap-2 bg-green-400 hover:bg-green-500 text-white rounded-2xl py-3 font-black text-sm transition">
                      <FaStar /> Review Again!
                    </div>
                  ) : (
                    <div className={`flex items-center justify-center gap-2 ${colors.btn} rounded-2xl py-3 font-black text-sm transition`}>
                      <FaRocket /> Start Lesson!
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {lessons.some((_, i) => !isLessonDone(i) && (i === 0 || isLessonDone(i - 1))) && (
          <p className="text-center text-purple-400 font-bold text-lg mt-8">Complete each lesson to unlock the next one!</p>
        )}
      </div>
    </div>
  )
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
    Promise.allSettled([
      syncProgressFromServer(categoryId),
      supabase.from('lessons').select('id, title, description').eq('category_id', categoryId).order('id')
    ]).then(([, lessonsResult]) => {
      setLessons(lessonsResult.value?.data ?? [])
      setLoading(false)
    })
  }, [categoryId])

  if (loading) return <p className="text-center mt-20 text-gray-500 text-xl">{categoryId === 1 ? '✨ Loading your Bible Adventure... 🚀' : 'Loading...'}</p>

  const completedCount = lessons.filter((_, i) => isLessonDone(i)).length
  const progressPct = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0
  const lesson1 = lessons[0]
  const restLessons = lessons.slice(1)

  if (categoryId === 1) return (
    <KidDashboard
      lessons={lessons}
      completedCount={completedCount}
      progressPct={progressPct}
      isLessonDone={isLessonDone}
      navigate={navigate}
    />
  )

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
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-gray-800">All Lessons</h2>
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
              <div
                className="relative flex flex-col items-center text-center px-6 py-8 flex-1 bg-cover bg-center"
                style={{ backgroundImage: `url(${meta.image})` }}
              >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex flex-col items-center w-full flex-1">
                  <div className="w-16 h-16 rounded-full bg-green-500/80 flex items-center justify-center mb-5">
                    <FaCheckCircle className="text-white text-3xl" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest text-green-300 mb-2">Completed</p>
                  <p className="text-2xl font-extrabold text-white mb-3">{lesson1.title}</p>
                  {lesson1.description && (
                    <p className="text-gray-200 text-base leading-relaxed flex-1">{lesson1.description}</p>
                  )}
                </div>
              </div>
              <div className="px-6 pb-6 mt-4">
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
                <div
                  className="relative flex flex-col items-center text-center px-6 py-8 flex-1 bg-cover bg-center"
                  style={{ backgroundImage: `url(${meta.image})` }}
                >
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="relative z-10 flex flex-col items-center w-full flex-1">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${
                      locked ? 'bg-gray-500/80' : done ? 'bg-green-500/80' : 'bg-white/20'
                    }`}>
                      {locked
                        ? <FaLock className="text-white text-2xl" />
                        : done
                        ? <FaCheckCircle className="text-white text-3xl" />
                        : <span className="text-white text-2xl">{meta.icon}</span>
                      }
                    </div>
                    <p className={`text-sm font-bold uppercase tracking-widest mb-2 ${
                      locked ? 'text-gray-300' : done ? 'text-green-300' : 'text-white'
                    }`}>
                      {done ? 'Completed' : locked ? 'Locked' : 'Available'}
                    </p>
                    <p className="text-2xl font-extrabold mb-3 text-white">
                      {lesson.title}
                    </p>
                    <p className="text-base leading-relaxed flex-1 text-gray-200">
                      {locked
                        ? 'Complete the previous lesson to unlock this one.'
                        : lesson.description || (done ? 'Tap to review your answers.' : 'Ready to begin? Start this lesson now.')}
                    </p>
                  </div>
                </div>

                {/* CTA button */}
                <div className="px-6 pb-6 mt-4">
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
