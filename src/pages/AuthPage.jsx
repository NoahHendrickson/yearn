import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export function AuthPage() {
  const { session, loading: authLoading, signIn, signUp } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('tab') === 'signup' ? 'signup' : 'signin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && session) navigate('/dashboard')
  }, [authLoading, session, navigate])

  const switchMode = (next) => {
    setMode(next)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (mode === 'signup' && password.length < 5) {
      setError('Password must be at least 5 characters.')
      return
    }
    setLoading(true)
    try {
      if (mode === 'signin') {
        await signIn(email, password)
      } else {
        await signUp(email, password, username)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const EyeButton = (
    <button
      type="button"
      onClick={() => setShowPassword(v => !v)}
      className="text-fg-tertiary hover:text-fg-primary transition-colors"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      <EyeIcon open={showPassword} />
    </button>
  )

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="relative w-full max-w-[360px] rounded-[24px] border border-white/[0.12] shadow-xs overflow-hidden">
        {/* white bg */}
        <div className="absolute inset-0 bg-bg-primary rounded-[24px] pointer-events-none" aria-hidden="true" />
        {/* skeuomorphic inner border */}
        <div className="absolute inset-0 rounded-[inherit] pointer-events-none shadow-[inset_0px_0px_0px_1px_rgba(0,0,0,0.08),inset_0px_-2px_0px_0px_rgba(0,0,0,0.04)]" aria-hidden="true" />

        <form onSubmit={handleSubmit} className="relative flex flex-col gap-8 p-8">
          {/* Wordmark */}
          <div className="flex justify-center">
            <span className="text-2xl font-semibold text-fg-brand-primary tracking-tight">Yearn</span>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-5">
            {mode === 'signup' && (
              <Input
                id="auth-username"
                label="Username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="e.g. jane_doe"
                required
                autoComplete="username"
              size="sm"
              />
            )}
            <Input
              id="auth-email"
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
              size="sm"
            />
            <Input
              id="auth-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              trailingIcon={EyeButton}
              size="sm"
            />
            {error && (
              <p className="text-sm text-fg-error-primary">{error}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            {mode === 'signin' ? (
              <>
                <Button type="submit" size="sm" loading={loading} className="w-full">
                  Login
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => switchMode('signup')}
                >
                  Sign up
                </Button>
              </>
            ) : (
              <>
                <Button type="submit" size="sm" loading={loading} className="w-full">
                  Sign up
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => switchMode('signin')}
                >
                  Sign in
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
