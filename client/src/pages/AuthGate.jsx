import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaBookOpen } from 'react-icons/fa'
import { supabase } from '../lib/supabase'

export default function AuthGate() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') ?? '/'

  const [tab, setTab] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignIn(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setError(error.message)
    navigate(next)
  }

  async function handleSignUp(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    setLoading(false)
    if (error) return setError(error.message)
    setMessage('Account created! Check your email to confirm, then sign in.')
    setTab('signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 text-blue-600 rounded-full w-14 h-14 flex items-center justify-center text-2xl mb-3">
            <FaBookOpen />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Unlock the Next Lesson</h1>
          <p className="text-gray-400 text-sm mt-1 text-center">
            Create a free account or sign in to continue your Bible study journey.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            onClick={() => { setTab('signin'); setError(''); setMessage('') }}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${tab === 'signin' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('signup'); setError(''); setMessage('') }}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${tab === 'signup' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
          >
            Sign Up
          </button>
        </div>

        {message && <p className="text-green-600 text-sm bg-green-50 rounded-lg px-4 py-3 mb-4">{message}</p>}
        {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-4 py-3 mb-4">{error}</p>}

        {tab === 'signin' ? (
          <form onSubmit={handleSignIn} className="grid gap-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In & Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="grid gap-4">
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create Account & Continue'}
            </button>
          </form>
        )}

        <button onClick={() => navigate('/')} className="mt-5 text-gray-400 text-xs hover:underline w-full text-center">
          ← Back to Home
        </button>
      </div>
    </div>
  )
}
