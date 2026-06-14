'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ReportIncident() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('reports').insert({
      user_id: user.id,
      title: formData.get('title'),
      type: formData.get('type'),
      description: formData.get('description'),
      date_of_incident: formData.get('date'),
      evidence: formData.get('evidence'),
      status: 'pending',
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
        <div className="bg-[#111827] border border-slate-700/50 rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">Report Submitted!</h2>
          <p className="text-slate-400 text-sm mb-6">Your incident report has been received and is under review.</p>
          <div className="flex gap-3">
            <button
              onClick={() => setSuccess(false)}
              className="flex-1 border border-slate-700 text-slate-300 hover:text-white py-2.5 rounded-lg text-sm transition-colors"
            >
              New Report
            </button>
            <button
              onClick={() => router.push('/dashboard/user')}
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white py-2.5 rounded-lg text-sm transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Topbar */}
      <nav className="border-b border-slate-700/50 px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">FerbShield</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-2">Report an Incident</h1>
        <p className="text-slate-400 mb-8">Fill in the details below to file a cybercrime incident report.</p>

        <form onSubmit={handleSubmit} className="bg-[#111827] border border-slate-700/50 rounded-2xl p-8 space-y-6">

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Incident Type */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Incident Type</label>
            <select
              name="type"
              required
              className="w-full bg-[#0a0f1e] border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="">Select incident type</option>
              <option value="Phishing">Phishing</option>
              <option value="Identity Theft">Identity Theft</option>
              <option value="Ransomware">Ransomware</option>
              <option value="Fraud">Fraud</option>
              <option value="Hacking">Hacking</option>
              <option value="Cyberbullying">Cyberbullying</option>
              <option value="Data Breach">Data Breach</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Title</label>
            <input
              name="title"
              type="text"
              required
              placeholder="Brief title of the incident"
              className="w-full bg-[#0a0f1e] border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Date of Incident</label>
            <input
              name="date"
              type="date"
              required
              className="w-full bg-[#0a0f1e] border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              required
              rows={5}
              placeholder="Describe what happened in detail..."
              className="w-full bg-[#0a0f1e] border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            />
          </div>

          {/* Evidence */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Evidence <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              name="evidence"
              type="text"
              placeholder="Link to screenshot, document, or other evidence"
              className="w-full bg-[#0a0f1e] border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 border border-slate-700 text-slate-300 hover:text-white py-3 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}