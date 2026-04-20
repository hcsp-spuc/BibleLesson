import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { FaArrowLeft, FaBookOpen, FaQuestionCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { supabase } from '../lib/supabase'

export default function Quiz() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [questions, setQuestions] = useState([])
  const [lesson, setLesson] = useState(null)
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState('discussion')
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('id, title, category_id')
        .eq('id', lessonId)
        .single()

      const { data: qData } = await supabase
        .from('questions')
        .select('id, text, discussion, choices(id, text, is_correct)')
        .eq('lesson_id', lessonId)
        .order('id')

      setLesson(lessonData)
      setQuestions(qData ?? [])
      setLoading(false)
    }
    load()
  }, [lessonId])

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>
  if (!questions.length) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="text-gray-400 mb-4">No questions available for this lesson.</p>
      <button onClick={() => navigate(-1)} className="text-blue-500 hover:underline">← Back</button>
    </div>
  )

  const q = questions[step]
  const total = questions.length
  const isLast = step === total - 1

  const themes = {
    1: { border: 'border-blue-500', text: 'text-blue-600', btn: 'bg-blue-600 hover:bg-blue-700', selectedBg: 'bg-blue-50', dot: 'bg-blue-500', sideImage: '/images/elementary.png', heroBg: '/images/background-elem.png' },
    2: { border: 'border-green-600', text: 'text-green-700', btn: 'bg-green-700 hover:bg-green-800', selectedBg: 'bg-green-50', dot: 'bg-green-500', sideImage: '/images/high-school.png', heroBg: '/images/background-high.png' },
    3: { border: 'border-purple-500', text: 'text-purple-600', btn: 'bg-purple-600 hover:bg-purple-700', selectedBg: 'bg-purple-50', dot: 'bg-purple-500', sideImage: '/images/college.png', heroBg: '/images/background-adult.png' },
  }
  const theme = themes[lesson?.category_id] ?? themes[1]

  function handleNext() {
    const newAnswers = { ...answers, [q.id]: selected }
    setAnswers(newAnswers)
    setSelected(null)
    setRevealed(false)

    if (isLast) {
      const score = questions.reduce((acc, question) => {
        const choice = question.choices.find(c => c.id === newAnswers[question.id])
        return acc + (choice?.is_correct ? 1 : 0)
      }, 0)
      navigate('/result', {
        state: { score, total, lessonId: parseInt(lessonId), categoryId: lesson.category_id, isFirst: location.state?.isFirst ?? false }
      })
    } else {
      setStep(step + 1)
      setPhase('discussion')
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">

      {/* Top bar */}
      <div className="bg-gray-500 px-8 py-5 flex items-center gap-4 shrink-0">
        <button onClick={() => navigate('/')} className="text-white/80 hover:text-white text-xl transition"><FaArrowLeft /></button>
        <h1 className="text-white text-4xl font-bold tracking-tight">Discover Bible Guides</h1>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left sticky side image — shows left portion */}
        <div className="hidden md:block w-44 lg:w-56 shrink-0 relative overflow-hidden">
          <img src={theme.sideImage} alt="" className="absolute h-full blur-[2px]" style={{ width: 'auto', maxWidth: 'none', left: 0, top: 0 }} />
          <div className="absolute inset-0 bg-white/60" />
          {/* GUIDE badge */}
          <div className="absolute top-0 left-0 bg-white text-center px-5 py-3 shadow-md">
            <p className="text-xs font-extrabold tracking-widest text-gray-500 uppercase">Guide</p>
            <p className="text-6xl font-black text-gray-800 leading-none">{step + 1}</p>
          </div>
        </div>

        {/* Center scrollable content */}
        <div className="flex-1 overflow-y-auto flex flex-col">

          {/* Hero section */}
          <div
            className="relative flex flex-col items-center justify-end text-center bg-cover bg-center shrink-0"
            style={{ minHeight: '380px', backgroundImage: `url('${theme.heroBg}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/50" />

            {/* Dot navigation */}
            <div className="relative z-10 flex gap-4 mb-8">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setStep(i); setPhase('discussion'); setSelected(null) }}
                  className={`rounded-full border-2 border-white transition-all duration-300 ${
                    i === step ? `w-5 h-5 ${theme.dot}` : 'w-4 h-4 bg-white/40'
                  }`}
                />
              ))}
            </div>

            {/* Question title */}
            <h2 className="relative z-10 text-white text-5xl md:text-6xl font-extrabold drop-shadow-xl pb-14 px-8 leading-tight max-w-3xl">
              {step + 1}. {q.text}
            </h2>
          </div>

          {/* White content card — fills remaining height */}
          <div className="bg-white -mt-8 rounded-t-3xl shadow-2xl px-10 md:px-16 py-12 relative z-10 flex-1 flex flex-col">

            {phase === 'discussion' ? (
              <div className="flex flex-col flex-1">
                <p className="text-gray-500 text-base font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><FaBookOpen /> Discussion</p>
                <p className="text-gray-800 text-2xl leading-loose flex-1">{q.discussion}</p>
                <button
                  onClick={() => setPhase('question')}
                  className={`${theme.btn} text-white text-2xl font-bold px-10 py-6 rounded-2xl w-full transition mt-10`}
                >
                  Answer the Question →
                </button>
              </div>
            ) : (
              <div className="flex flex-col flex-1">
                <p className="text-gray-500 text-base font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><FaQuestionCircle /> Choose your answer</p>
                <div className="grid gap-5 flex-1">
                  {q.choices.map((choice) => {
                    const isSelected = selected === choice.id
                    const isCorrect = choice.is_correct
                    let choiceStyle = 'border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                    if (revealed) {
                      if (isCorrect) choiceStyle = 'border-green-500 bg-green-50 text-green-700'
                      else if (isSelected && !isCorrect) choiceStyle = 'border-red-400 bg-red-50 text-red-600'
                      else choiceStyle = 'border-gray-200 text-gray-400'
                    } else if (isSelected) {
                      choiceStyle = `${theme.border} ${theme.selectedBg} ${theme.text}`
                    }
                    return (
                      <button
                        key={choice.id}
                        onClick={() => !revealed && setSelected(choice.id)}
                        disabled={revealed}
                        className={`text-left px-7 py-6 rounded-2xl border-2 text-2xl font-semibold transition ${choiceStyle}`}
                      >
                        <span className="flex items-center justify-between">
                          {choice.text}
                          {revealed && isCorrect && <FaCheckCircle className="text-green-500 shrink-0 ml-3" />}
                          {revealed && isSelected && !isCorrect && <FaTimesCircle className="text-red-400 shrink-0 ml-3" />}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Feedback message */}
                {revealed && (() => {
                  const selectedChoice = q.choices.find(c => c.id === selected)
                  const correct = selectedChoice?.is_correct
                  return (
                    <div className={`mt-6 px-6 py-4 rounded-2xl text-xl font-bold flex items-center gap-3 ${
                      correct ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'
                    }`}>
                      {correct
                        ? <><FaCheckCircle className="shrink-0 text-2xl" /> That's correct! Well done.</>  
                        : <><FaTimesCircle className="shrink-0 text-2xl" /> Not quite. The correct answer is: <span className="underline">{q.choices.find(c => c.is_correct)?.text}</span></>}
                    </div>
                  )
                })()}

                {/* Continue footer */}
                <div className="bg-[#2a6496] -mx-10 md:-mx-16 -mb-12 px-10 py-10 mt-10 text-center">
                  <p className="text-green-300 text-base font-bold tracking-widest uppercase mb-5">
                    {revealed ? 'Ready to continue?' : 'Select an answer above to continue.'}
                  </p>
                  {!revealed ? (
                    <button
                      onClick={() => setRevealed(true)}
                      disabled={!selected}
                      className="bg-white text-gray-800 text-2xl font-bold px-20 py-5 rounded-xl hover:bg-gray-100 transition disabled:opacity-40"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="bg-white text-gray-800 text-2xl font-bold px-20 py-5 rounded-xl hover:bg-gray-100 transition"
                    >
                      {isLast ? 'Submit Answers' : 'Continue'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right sticky side image — shows right portion */}
        <div className="hidden lg:block w-44 lg:w-56 shrink-0 relative overflow-hidden">
          <img src={theme.sideImage} alt="" className="absolute h-full blur-[2px]" style={{ width: 'auto', maxWidth: 'none', right: 0, top: 0 }} />
          <div className="absolute inset-0 bg-white/60" />
        </div>
      </div>
    </div>
  )
}
