import { useLocation, useNavigate } from 'react-router-dom'

export default function Result() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { score = 0, total = 0, categoryId, isFirst = false } = state ?? {}
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0

  const categoryPaths = { 1: '/lessons/1', 2: '/lessons/2', 3: '/lessons/3' }
  const nextPath = categoryPaths[categoryId] ?? '/'

  function handleContinue() {
    if (isFirst) {
      navigate(`/auth-gate?next=${encodeURIComponent(nextPath)}`)
    } else {
      navigate(nextPath)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm w-full">
        <div className="text-5xl mb-4">{percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '📖'}</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
        <p className="text-gray-500 mb-6">Here's how you did</p>
        <div className="text-6xl font-extrabold text-blue-500 mb-2">{percentage}%</div>
        <p className="text-gray-600 mb-8">{score} out of {total} correct</p>

        {isFirst && (
          <p className="text-sm text-gray-400 mb-4">
            Sign in or create an account to unlock the next lesson.
          </p>
        )}

        <button
          onClick={handleContinue}
          className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition mb-3"
        >
          {isFirst ? 'Continue to Sign In →' : 'Back to Lessons'}
        </button>
        <button onClick={() => navigate('/')} className="text-gray-400 text-sm hover:underline">
          Back to Home
        </button>
      </div>
    </div>
  )
}
