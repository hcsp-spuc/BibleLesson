import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Quiz() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchQuestions() {
      const { data } = await supabase
        .from('questions')
        .select('id, text, choices(id, text, is_correct)')
        .eq('lesson_id', lessonId)

      setQuestions(data ?? [])
      setLoading(false)
    }
    fetchQuestions()
  }, [lessonId])

  function handleSelect(questionId, choiceId) {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }))
  }

  function handleSubmit() {
    const score = questions.reduce((acc, q) => {
      const selected = q.choices.find((c) => c.id === answers[q.id])
      return acc + (selected?.is_correct ? 1 : 0)
    }, 0)
    navigate('/result', { state: { score, total: questions.length } })
  }

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-blue-500 mb-4 hover:underline">← Back</button>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Quiz</h2>
      <div className="grid gap-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-xl shadow p-5">
            <p className="font-semibold text-gray-700 mb-3">{idx + 1}. {q.text}</p>
            <div className="grid gap-2">
              {q.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleSelect(q.id, choice.id)}
                  className={`text-left px-4 py-2 rounded-lg border transition ${
                    answers[q.id] === choice.id
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={Object.keys(answers).length !== questions.length}
        className="mt-8 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-40 transition"
      >
        Submit
      </button>
    </div>
  )
}
