'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
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

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    await new Promise(resolve => setTimeout(resolve, 1000))

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role === 'admin') {
      router.push('/dashboard/admin')
    } else {
      router.push('/dashboard/user')
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        {/* Logo / Brand */}
<div className="mb-10 text-center">
  <img src="/logo.png" alt="FerbShield" className="h-40 w-auto mx-auto mb-[-6]" />
  <h1 className="text-white text-2xl font-semibold">Welcome back</h1>
  <p className="text-slate-400 text-sm mt-1">Sign in to your account to continue</p>
</div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-[#111827] border border-slate-700/50 rounded-2xl p-8 space-y-5 shadow-xl">

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

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
              placeholder="••••••••"
              className="w-full bg-[#0a0f1e] border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-sm mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-slate-400 text-sm pt-2">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}
