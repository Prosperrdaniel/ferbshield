'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        email,
        role: 'user',
      })
    }

    router.push('/dashboard/user')
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">FerbShield</span>
          </div>
          <h1 className="text-white text-2xl font-semibold">Create your account</h1>
          <p className="text-slate-400 text-sm mt-1">Join the platform to report and track cyber incidents</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-[#111827] border border-slate-700/50 rounded-2xl p-8 space-y-5 shadow-xl">

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Full Name</label>
            <input
              name="fullName"
              type="text"
              required
              placeholder="John Doe"
              className="w-full bg-[#0a0f1e] border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Email Address</label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full bg-[#0a0f1e] border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="Min. 8 characters"
              minLength={8}
              className="w-full bg-[#0a0f1e] border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-sm mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-slate-400 text-sm pt-2">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}
