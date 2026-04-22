import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { markLessonDone } from '../lib/progress'

const categoryThemes = {
  1: { sideImage: '/images/elementary.png', heroBg: '/images/background-elem.png' },
  2: { sideImage: '/images/high-school.png', heroBg: '/images/background-high.png' },
  3: { sideImage: '/images/college.png',     heroBg: '/images/background-adult.png' },
}

const decisions = [
  'I would like to say "Thank You" to God for creating me and the wonderful world around me. I want to thank Him for His great love for me personally.',
  'I believe that God designed me with a purpose, and I want to discover that purpose through His Word.',
  'I choose to trust God\'s plan for my life and commit to studying the Bible further.',
]

export default function Result() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { score = 0, total = 0, categoryId = 1, lessonNumber = 1, isFirst = false } = state ?? {}
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0

  const [checked, setChecked] = useState([])
  const theme = categoryThemes[categoryId] ?? categoryThemes[1]

  const categoryPaths = { 1: '/lessons/1', 2: '/lessons/2', 3: '/lessons/3' }
  const nextPath = categoryPaths[categoryId] ?? '/'

  function toggleCheck(i) {
    setChecked(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])
  }

  async function handleComplete() {
    if (isFirst) {
      await markLessonDone(categoryId, lessonNumber)
      navigate(`/auth-gate?category=${categoryId}`)
    } else {
      await markLessonDone(categoryId, lessonNumber)
      navigate(`/dashboard?category=${categoryId}`)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">

      {/* Top bar */}
      <div className="bg-gray-500 px-8 py-5 flex items-center gap-4 shrink-0">
        <button onClick={() => navigate('/')} className="text-white/80 hover:text-white text-xl transition">←</button>
        <h1 className="text-white text-4xl font-bold tracking-tight">Discover Bible Guides</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Left side image */}
        <div className="hidden md:block w-44 lg:w-56 shrink-0 relative overflow-hidden">
          <img src={theme.sideImage} alt="" className="absolute h-full blur-[2px]" style={{ width: 'auto', maxWidth: 'none', left: 0, top: 0 }} />
          <div className="absolute inset-0 bg-white/60" />
          <div className="absolute top-0 left-0 bg-white text-center px-5 py-3 shadow-md">
            <p className="text-xs font-extrabold tracking-widest text-gray-500 uppercase">Guide</p>
            <p className="text-6xl font-black text-gray-800 leading-none">1</p>
          </div>
        </div>

        {/* Center */}
        <div className="flex-1 overflow-y-auto flex flex-col">

          {/* Hero */}
          <div
            className="relative flex flex-col items-center justify-end text-center bg-cover bg-center shrink-0"
            style={{ minHeight: '300px', backgroundImage: `url('${theme.heroBg}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/50" />
            <h2 className="relative z-10 text-white text-5xl md:text-6xl font-extrabold drop-shadow-xl pb-14 px-8 leading-tight">
              Decision &amp; Prayer
            </h2>
          </div>

          {/* White card */}
          <div className="bg-white -mt-8 rounded-t-3xl shadow-2xl px-10 md:px-16 py-12 relative z-10 flex-1 flex flex-col">

            {/* Score summary */}
            <div className="flex items-center justify-center gap-6 mb-10 pb-8 border-b border-gray-100">
              <div className="text-center">
                <p className="text-5xl font-black text-green-500">{percentage}%</p>
                <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest mt-1">Your Score</p>
              </div>
              <div className="w-px h-14 bg-gray-200" />
              <div className="text-center">
                <p className="text-5xl font-black text-gray-800">{score}<span className="text-2xl text-gray-400">/{total}</span></p>
                <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest mt-1">Correct</p>
              </div>
            </div>

            {/* Prayer section */}
            <p className="text-green-600 text-base font-extrabold uppercase tracking-widest text-center mb-6">My Prayer</p>
            <p className="text-gray-700 text-2xl leading-loose mb-6">
              If you've never prayed before, that's okay. Here is a short prayer to get you started, if you want to read these words aloud to God or say them silently in your head to Him. You can also take this prayer and make it your own by paraphrasing or add your own words to it.
            </p>
            <p className="text-gray-700 text-2xl leading-loose indent-8 mb-8">
              Try to think of talking to God like you would talk to a friend, saying whatever is on your heart.
            </p>
            <div className="bg-green-50 rounded-2xl px-8 py-7 mb-10">
              <p className="text-gray-800 text-2xl leading-loose text-justify font-medium">
                Father, thank You for creating this world for me to enjoy; thank You for creating me and loving me so much, that You are willing to guide my life. I ask You to meet my personal needs and to lead me as I read the Bible. I ask this in the name of Jesus, Amen.
              </p>
            </div>

            <hr className="border-gray-200 mb-10" />

            {/* Decision section */}
            <p className="text-green-600 text-base font-extrabold uppercase tracking-widest text-center mb-4">My Decision</p>
            <p className="text-gray-700 text-2xl leading-loose mb-8">
              Take a moment to reflect on the following statements, placing a check mark next to each statement you relate to.
            </p>
            <div className="grid gap-5 mb-10">
              {decisions.map((text, i) => (
                <button
                  key={i}
                  onClick={() => toggleCheck(i)}
                  className={`flex items-start gap-4 text-left px-6 py-5 rounded-2xl border-2 transition ${
                    checked.includes(i)
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`mt-1 w-7 h-7 shrink-0 rounded border-2 flex items-center justify-center transition ${
                    checked.includes(i) ? 'border-green-500 bg-white' : 'border-gray-300'
                  }`}>
                    {checked.includes(i) && (
                      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <p className={`text-2xl font-medium leading-snug ${checked.includes(i) ? 'text-green-700' : 'text-gray-700'}`}>
                    {text}
                  </p>
                </button>
              ))}
            </div>

            {/* Complete button */}
            <button
              onClick={handleComplete}
              className="bg-green-500 hover:bg-green-600 text-white text-2xl font-extrabold uppercase tracking-widest py-6 rounded-2xl w-full transition mt-auto"
            >
              Complete Lesson
            </button>
          </div>
        </div>

        {/* Right side image */}
        <div className="hidden lg:block w-44 lg:w-56 shrink-0 relative overflow-hidden">
          <img src={theme.sideImage} alt="" className="absolute h-full blur-[2px]" style={{ width: 'auto', maxWidth: 'none', right: 0, top: 0 }} />
          <div className="absolute inset-0 bg-white/60" />
        </div>
      </div>
    </div>
  )
}
