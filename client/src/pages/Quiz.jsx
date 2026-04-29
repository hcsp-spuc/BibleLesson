import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { FaArrowLeft, FaBookOpen, FaQuestionCircle, FaCheckCircle, FaTimesCircle, FaStar, FaRocket, FaHeart } from 'react-icons/fa'
import { GiOpenBook, GiAngelWings, GiStarMedal, GiDove } from 'react-icons/gi'
import { supabase } from '../lib/supabase'

const kidChoiceColors = [
  { base: 'border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100', active: 'border-yellow-500 bg-yellow-200 text-yellow-900' },
  { base: 'border-pink-300 bg-pink-50 text-pink-800 hover:bg-pink-100',         active: 'border-pink-500 bg-pink-200 text-pink-900'         },
  { base: 'border-sky-300 bg-sky-50 text-sky-800 hover:bg-sky-100',             active: 'border-sky-500 bg-sky-200 text-sky-900'             },
  { base: 'border-purple-300 bg-purple-50 text-purple-800 hover:bg-purple-100', active: 'border-purple-500 bg-purple-200 text-purple-900'    },
]

function KidQuiz({ lesson, questions, step, maxStep, phase, answers, selected, revealed, setStep, setPhase, setSelected, setRevealed, handleNext, reviewMode, navigate }) {
  const q = questions[step]
  const total = questions.length
  const isLast = step === total - 1
  const progressPct = Math.round(((step + (phase === 'question' ? 0.5 : 0)) / total) * 100)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #e0f2fe 0%, #fef9c3 60%, #fce7f3 100%)' }}>

      {/* Top bar */}
      <div className="relative overflow-hidden shrink-0" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 40%, #ec4899 100%)' }}>
        <div className="absolute inset-0 opacity-10 select-none pointer-events-none text-white">
          {[
            { Icon: FaStar,       style: { top: '10%',  left: '5%',   fontSize: '2rem'  } },
            { Icon: GiDove,       style: { top: '20%',  left: '22%',  fontSize: '2.5rem'} },
            { Icon: FaHeart,      style: { top: '5%',   left: '45%',  fontSize: '1.8rem'} },
            { Icon: FaStar,       style: { top: '60%',  left: '55%',  fontSize: '2.2rem'} },
            { Icon: GiAngelWings, style: { top: '15%',  left: '70%',  fontSize: '3rem'  } },
            { Icon: FaStar,       style: { top: '70%',  left: '80%',  fontSize: '1.5rem'} },
            { Icon: FaHeart,      style: { top: '50%',  left: '12%',  fontSize: '2rem'  } },
            { Icon: GiDove,       style: { top: '30%',  left: '90%',  fontSize: '2.5rem'} },
          ].map(({ Icon, style }, i) => <Icon key={i} className="absolute" style={style} />)}
        </div>
        <div className="relative z-10 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => reviewMode && lesson ? navigate(`/dashboard?category=${lesson.category_id}`) : navigate('/')}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition"
          >
            <FaArrowLeft />
          </button>
          <div className="flex items-center gap-2 ml-4">
            <GiOpenBook className="text-white text-2xl" />
            <span className="text-white text-xl font-black">Bible Adventure!</span>
          </div>
          <div className="ml-auto bg-white/20 rounded-full px-4 py-1 text-white font-black text-sm">
            {step + 1} / {total}
          </div>
        </div>
        {/* Progress bar */}
        <div className="px-6 pb-3">
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #facc15, #f97316, #ec4899)' }}
            />
          </div>
        </div>
      </div>

      {/* Lesson title badge */}
      <div className="flex justify-center mt-6 px-6">
        <div className="bg-white rounded-2xl shadow-md px-6 py-3 flex items-center gap-3 border-2 border-purple-200">
          <GiStarMedal className="text-yellow-400 text-2xl" />
          <span className="text-purple-700 font-black text-lg">{lesson.title} — Guide {step + 1}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 md:px-16 py-6 max-w-3xl mx-auto w-full">

        {phase === 'discussion' ? (
          <div className="flex flex-col gap-6">
            {/* Discussion card */}
            <div className="bg-white rounded-3xl shadow-xl border-4 border-blue-200 p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 rounded-full p-4">
                  <GiOpenBook className="text-blue-500 text-4xl" />
                </div>
                <span className="text-blue-600 font-black text-2xl uppercase tracking-widest">Let's Discover!</span>
              </div>
              <p className="text-gray-700 text-2xl leading-relaxed">{q.discussion}</p>
            </div>

            {/* Next button */}
            <button
              onClick={() => setPhase('question')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xl font-black py-5 rounded-3xl shadow-lg transition flex items-center justify-center gap-3"
            >
              <FaRocket />
              {answers[q.id] ? 'Review Your Answer!' : "I'm Ready — Let's Answer!"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Question card */}
            <div className="bg-white rounded-3xl shadow-xl border-4 border-yellow-300 p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 rounded-full p-3">
                  <FaQuestionCircle className="text-yellow-500 text-2xl" />
                </div>
                <span className="text-yellow-600 font-black text-lg uppercase tracking-widest">Question Time!</span>
              </div>
              <p className="text-gray-800 text-2xl font-bold leading-snug">{q.text}</p>
            </div>

            {/* Choices */}
            <div className="grid gap-4">
              {q.choices.map((choice, ci) => {
                const colors = kidChoiceColors[ci % kidChoiceColors.length]
                const isSelected = selected === choice.id
                const isCorrect = choice.is_correct
                let cls = `${colors.base} border-2`
                if (revealed) {
                  if (isCorrect) cls = 'border-green-400 bg-green-100 text-green-800 border-2'
                  else if (isSelected && !isCorrect) cls = 'border-red-400 bg-red-100 text-red-700 border-2'
                  else cls = 'border-gray-200 bg-gray-50 text-gray-400 border-2'
                } else if (isSelected) {
                  cls = `${colors.active} border-2`
                }
                return (
                  <button
                    key={choice.id}
                    onClick={() => !revealed && !reviewMode && setSelected(choice.id)}
                    disabled={revealed || reviewMode}
                    className={`text-left px-6 py-5 rounded-2xl text-lg font-bold transition flex items-center justify-between ${cls}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center font-black text-sm shrink-0">
                        {String.fromCharCode(65 + ci)}
                      </span>
                      {choice.text}
                    </span>
                    {revealed && isCorrect && <FaCheckCircle className="text-green-500 text-xl shrink-0" />}
                    {revealed && isSelected && !isCorrect && <FaTimesCircle className="text-red-400 text-xl shrink-0" />}
                  </button>
                )
              })}
            </div>

            {/* Feedback */}
            {revealed && (() => {
              const correct = q.choices.find(c => c.id === selected)?.is_correct
              return (
                <div className={`rounded-3xl p-6 border-4 flex flex-col gap-2 ${correct ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  <div className={`flex items-center gap-3 text-xl font-black ${correct ? 'text-green-700' : 'text-red-600'}`}>
                    {correct
                      ? <><FaStar className="text-yellow-400 text-2xl" /> Awesome! That's correct! 🎉</>
                      : <><FaTimesCircle className="text-red-400 text-2xl" /> Not quite! Keep trying! 💪</>
                    }
                  </div>
                  {!correct && (
                    <p className="text-red-500 font-semibold text-base pl-9">
                      The correct answer is: <span className="font-black underline">{q.choices.find(c => c.is_correct)?.text}</span>
                    </p>
                  )}
                  {!correct && q.choices.find(c => c.is_correct)?.explanation && (
                    <p className="text-red-400 text-sm pl-9">{q.choices.find(c => c.is_correct).explanation}</p>
                  )}
                </div>
              )
            })()}

            {/* Action buttons */}
            <div className="flex flex-col gap-3 pb-8">
              {!revealed && !reviewMode ? (
                <button
                  onClick={() => setRevealed(true)}
                  disabled={!selected}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white text-xl font-black py-5 rounded-3xl shadow-lg transition disabled:opacity-40 flex items-center justify-center gap-3"
                >
                  <FaCheckCircle /> Check My Answer!
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xl font-black py-5 rounded-3xl shadow-lg transition flex items-center justify-center gap-3"
                >
                  <FaRocket /> {isLast ? (reviewMode ? 'Back to Lessons! 🏠' : 'See My Results! 🌟') : 'Next Question!'}
                </button>
              )}
              <button
                onClick={() => setPhase('discussion')}
                className="w-full bg-white border-2 border-purple-200 text-purple-500 font-bold py-3 rounded-2xl hover:bg-purple-50 transition text-base"
              >
                ← Back to Discussion
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Quiz() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const reviewMode = location.state?.reviewMode ?? false
  const [questions, setQuestions] = useState([])
  const [lesson, setLesson] = useState(null)
  const [step, setStep] = useState(0)
  const [maxStep, setMaxStep] = useState(0)
  const [phase, setPhase] = useState('discussion')
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem(`lesson_${lessonId}_answers`)
    return saved ? JSON.parse(saved) : {}
  })
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

      const { count } = await supabase
        .from('lessons')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', lessonData.category_id)
        .lt('id', lessonId)

      const { data: qData } = await supabase
        .from('questions')
        .select('id, text, discussion, choices(id, text, is_correct, explanation)')
        .eq('lesson_id', lessonId)
        .order('id')

      setLesson({ ...lessonData, lessonNumber: (count ?? 0) + 1 })
      setQuestions(qData ?? [])
      if (reviewMode && qData?.length) {
        setMaxStep(qData.length - 1)
        const saved = localStorage.getItem(`lesson_${lessonId}_answers`)
        if (saved) {
          const parsed = JSON.parse(saved)
          setAnswers(parsed)
          setSelected(parsed[qData[0].id] ?? null)
          setRevealed(!!parsed[qData[0].id])
        }
      }
      setLoading(false)
    }
    load()
  }, [lessonId])

  if (loading) return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      <div className="bg-gray-500 px-8 py-5 flex items-center gap-4 shrink-0">
        <FaBookOpen className="text-white text-2xl" />
        <h1 className="text-white text-4xl font-bold tracking-tight">Discover Bible Guides</h1>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <FaBookOpen className="text-blue-500 text-2xl" />
            </div>
          </div>
          <p className="text-gray-500 text-xl font-semibold tracking-wide">Loading your lesson…</p>
          <div className="flex gap-2">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

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
    if (reviewMode) {
      if (isLast) {
        navigate(`/dashboard?category=${lesson.category_id}`)
      } else {
        const nextStep = step + 1
        setStep(nextStep)
        setPhase('discussion')
        setSelected(answers[questions[nextStep].id] ?? null)
        setRevealed(!!answers[questions[nextStep].id])
      }
      return
    }

    const newAnswers = { ...answers, [q.id]: selected }
    setAnswers(newAnswers)
    setSelected(null)
    setRevealed(false)

    if (isLast) {
      const score = questions.reduce((acc, question) => {
        const choice = question.choices.find(c => c.id === newAnswers[question.id])
        return acc + (choice?.is_correct ? 1 : 0)
      }, 0)
      localStorage.setItem(`lesson_${lessonId}_answers`, JSON.stringify(newAnswers))
      localStorage.setItem(`lesson_${lessonId}_score`, JSON.stringify({ score, total }))
      navigate('/result', {
        state: { score, total, lessonId: parseInt(lessonId), categoryId: lesson.category_id, lessonNumber: lesson.lessonNumber, isFirst: location.state?.isFirst ?? false }
      })
    } else {
      const nextStep = step + 1
      setStep(nextStep)
      setMaxStep(prev => Math.max(prev, nextStep))
      setPhase('discussion')
    }
  }

  // Render kid-friendly layout for elementary
  if (lesson?.category_id === 1) return (
    <KidQuiz
      lesson={lesson}
      questions={questions}
      step={step}
      maxStep={maxStep}
      phase={phase}
      answers={answers}
      selected={selected}
      revealed={revealed}
      setStep={setStep}
      setPhase={setPhase}
      setSelected={setSelected}
      setRevealed={setRevealed}
      handleNext={handleNext}
      reviewMode={reviewMode}
      navigate={navigate}
    />
  )

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">

      {/* Top bar */}
      <div className="bg-gray-500 px-8 py-5 flex items-center gap-4 shrink-0">
        <button onClick={() => navigate(reviewMode && lesson ? `/dashboard?category=${lesson.category_id}` : '/')} className="text-white/80 hover:text-white text-xl transition"><FaArrowLeft /></button>
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
            <div className="absolute bottom-8 z-10 flex gap-4">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (i <= maxStep) {
                      const prevAnswer = answers[questions[i].id]
                      setStep(i)
                      setPhase(reviewMode && prevAnswer ? 'question' : 'discussion')
                      setSelected(prevAnswer ?? null)
                      setRevealed(!!prevAnswer)
                    }
                  }}
                  className={`rounded-full border-2 border-white transition-all duration-300 ${
                    i === step
                      ? `w-5 h-5 ${theme.dot}`
                      : i < maxStep
                      ? `w-4 h-4 bg-white cursor-pointer hover:scale-125`
                      : i === maxStep
                      ? `w-4 h-4 bg-white cursor-pointer hover:scale-125`
                      : 'w-4 h-4 bg-white/30 cursor-default'
                  }`}
                />
              ))}
            </div>

            {/* Question title — only shown during question phase */}
            {phase === 'question' && (
              <h2 className="relative z-10 text-white text-5xl md:text-6xl font-extrabold drop-shadow-xl pb-14 px-8 leading-tight max-w-3xl">
                {step + 1}. {q.text}
              </h2>
            )}
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
                  {answers[q.id] ? 'Review Your Answer →' : 'Answer the Question →'}
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
                        onClick={() => !revealed && !reviewMode && setSelected(choice.id)}
                        disabled={revealed || reviewMode}
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
                        : (
                          <div className="flex flex-col gap-2">
                            <span className="flex items-center gap-3">
                              <FaTimesCircle className="shrink-0 text-2xl" />
                              Not quite. The correct answer is: <span className="underline">{q.choices.find(c => c.is_correct)?.text}</span>
                            </span>
                            {q.choices.find(c => c.is_correct)?.explanation && (
                              <p className="text-base font-normal text-red-500 mt-1 pl-9">
                                {q.choices.find(c => c.is_correct).explanation}
                              </p>
                            )}
                          </div>
                        )}
                    </div>
                  )
                })()}

                {/* Continue footer */}
                <div className="bg-[#2a6496] -mx-10 md:-mx-16 -mb-12 px-10 py-10 mt-10 text-center">
                  <p className="text-green-300 text-base font-bold tracking-widest uppercase mb-5">
                    {revealed ? 'Ready to continue?' : 'Select an answer above to continue.'}
                  </p>
                  {!revealed && !reviewMode ? (
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
                      {isLast ? (reviewMode ? 'Back to Dashboard' : 'Submit Answers') : 'Continue'}
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
