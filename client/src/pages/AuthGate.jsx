import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaBookOpen } from 'react-icons/fa'
import { supabase } from '../lib/supabase'
import { syncProgressFromServer } from '../lib/progress'

export default function AuthGate() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category') ?? '1'

  const [mode, setMode] = useState('signup')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignUp(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) return setError('Passwords do not match.')
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: `${firstName} ${lastName}`.trim() } },
    })
    setLoading(false)
    if (error) return setError(error.message)
    // If email confirmation is disabled, session is available immediately
    if (data.session) {
      await syncProgressFromServer(parseInt(category))
      return navigate(`/dashboard?category=${category}`)
    }
    setMessage('Account created! Check your email to confirm, then sign in.')
    setMode('signin')
  }

  async function handleSignIn(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setError(error.message)
    await syncProgressFromServer(parseInt(category))
    navigate(`/dashboard?category=${category}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Hero header — same as Home */}
      <div
        className="relative flex flex-col items-center justify-center text-center py-20 px-6 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/header-background.png')" }}
      >
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <FaBookOpen className="text-yellow-400 text-4xl" />
            <span className="text-white text-4xl font-extrabold tracking-tight">BibleLearn</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
            Grow in Faith. Learn the Word.
          </h1>
          <p className="text-blue-200 text-lg">
            Bible study for every stage of life.
          </p>
        </div>
      </div>

      {/* Form area */}
      <div className="flex-1 flex flex-col items-center px-6 py-16 bg-gray-100">
        <div className="w-full max-w-lg">

          {mode === 'signup' ? (
            <>
              <h2 className="text-3xl font-extrabold text-gray-600 uppercase tracking-widest mb-4">
                You've just begun...
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-10">
                To save your progress and continue this exciting Bible study series, enter your name and email address below to create an account.
              </p>

              {message && <p className="text-green-600 bg-green-50 rounded-lg px-4 py-3 mb-6 text-base">{message}</p>}
              {error && <p className="text-red-500 bg-red-50 rounded-lg px-4 py-3 mb-6 text-base">{error}</p>}

              <form onSubmit={handleSignUp} className="grid gap-6">
                <div>
                  <label className="block text-gray-700 text-base font-medium mb-2">* First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    className="w-full border border-gray-300 bg-white rounded px-4 py-3 text-lg focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-base font-medium mb-2">* Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                    className="w-full border border-gray-300 bg-white rounded px-4 py-3 text-lg focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-base font-medium mb-2">* Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 bg-white rounded px-4 py-3 text-lg focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-base font-medium mb-2">* Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full border border-gray-300 bg-white rounded px-4 py-3 text-lg focus:outline-none focus:border-blue-400"
                  />
                  <p className="text-gray-400 text-sm mt-1">6 characters minimum</p>
                </div>
                <div>
                  <label className="block text-gray-700 text-base font-medium mb-2">* Password confirmation</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                    className="w-full border border-gray-300 bg-white rounded px-4 py-3 text-lg focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-lg font-extrabold uppercase tracking-widest px-10 py-4 rounded transition disabled:opacity-50"
                  >
                    {loading ? 'Creating account…' : 'Sign Up'}
                  </button>
                </div>
              </form>

              <p className="mt-8 text-gray-500 text-base">
                Already have an account?{' '}
                <button onClick={() => { setMode('signin'); setError('') }} className="text-orange-500 hover:underline font-semibold">
                  Sign In
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-extrabold text-gray-600 uppercase tracking-widest mb-4">
                Welcome Back
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-10">
                Sign in to continue your Bible study journey.
              </p>

              {message && <p className="text-green-600 bg-green-50 rounded-lg px-4 py-3 mb-6 text-base">{message}</p>}
              {error && <p className="text-red-500 bg-red-50 rounded-lg px-4 py-3 mb-6 text-base">{error}</p>}

              <form onSubmit={handleSignIn} className="grid gap-6">
                <div>
                  <label className="block text-gray-700 text-base font-medium mb-2">* Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 bg-white rounded px-4 py-3 text-lg focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-base font-medium mb-2">* Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full border border-gray-300 bg-white rounded px-4 py-3 text-lg focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-lg font-extrabold uppercase tracking-widest px-10 py-4 rounded transition disabled:opacity-50"
                  >
                    {loading ? 'Signing in…' : 'Sign In'}
                  </button>
                </div>
              </form>

              <p className="mt-8 text-gray-500 text-base">
                Don't have an account?{' '}
                <button onClick={() => { setMode('signup'); setError('') }} className="text-orange-500 hover:underline font-semibold">
                  Sign Up
                </button>
              </p>
            </>
          )}

          <button onClick={() => navigate('/')} className="mt-6 text-gray-400 text-sm hover:underline">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
