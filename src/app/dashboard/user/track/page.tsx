'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Report = {
  id: string
  title: string
  type: string
  description: string
  date_of_incident: string
  evidence: string
  status: string
  created_at: string
}

export default function TrackReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [filtered, setFiltered] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Report | null>(null)
  const [filter, setFilter] = useState('all')
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) {
        setReports(data)
        setFiltered(data)
      }
      setLoading(false)
    }
    load()
  }, [router])

  useEffect(() => {
    if (filter === 'all') {
      setFiltered(reports)
    } else {
      setFiltered(reports.filter(r => r.status === filter))
    }
  }, [filter, reports])

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    under_review: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
    closed: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  }

  const statusSteps = ['pending', 'under_review', 'resolved']

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">

      {/* Topbar */}
      <nav className="border-b border-slate-700/50 px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.push('/dashboard/user')} className="text-slate-400 hover:text-white transition-colors">
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

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-2">Track Reports</h1>
        <p className="text-slate-400 mb-8">View and monitor the status of your filed reports.</p>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'pending', 'under_review', 'resolved', 'closed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#111827] border border-slate-700/50 text-slate-400 hover:text-white'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Reports List */}
        {filtered.length === 0 ? (
          <div className="bg-[#111827] border border-slate-700/50 rounded-xl p-10 text-center">
            <p className="text-slate-500 text-sm">No reports found for this filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelected(report)}
                className="bg-[#111827] border border-slate-700/50 rounded-xl p-5 cursor-pointer hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white font-medium">{report.title}</p>
                    <p className="text-slate-400 text-xs mt-1">{report.type} · {new Date(report.created_at).toLocaleDateString()}</p>
                    <p className="text-slate-500 text-sm mt-2 line-clamp-2">{report.description}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border shrink-0 ${statusColor[report.status] || 'bg-slate-500/20 text-slate-400'}`}>
                    {report.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4" onClick={() => setSelected(null)}>
          <div
            className="bg-[#111827] border border-slate-700/50 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-white font-semibold text-lg">{selected.title}</h2>
                <p className="text-slate-400 text-sm mt-1">{selected.type}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Progress Tracker */}
            <div className="mb-6">
              <p className="text-slate-400 text-xs mb-3 uppercase tracking-wide">Case Progress</p>
              <div className="flex items-center gap-2">
                {statusSteps.map((step, i) => {
                  const currentIndex = statusSteps.indexOf(selected.status)
                  const isActive = i <= currentIndex
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div className={`flex-1 h-1.5 rounded-full ${isActive ? 'bg-cyan-500' : 'bg-slate-700'}`} />
                      {i < statusSteps.length - 1 && (
                        <div className={`w-2 h-2 rounded-full mx-1 ${isActive ? 'bg-cyan-500' : 'bg-slate-700'}`} />
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between mt-2">
                {statusSteps.map((step) => (
                  <p key={step} className="text-xs text-slate-500 capitalize">{step.replace('_', ' ')}</p>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Description</p>
                <p className="text-slate-300 text-sm">{selected.description}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Date of Incident</p>
                <p className="text-slate-300 text-sm">{selected.date_of_incident || 'Not specified'}</p>
              </div>
              {selected.evidence && (
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Evidence</p>
                  <p className="text-slate-300 text-sm break-all">{selected.evidence}</p>
                </div>
              )}
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Filed On</p>
                <p className="text-slate-300 text-sm">{new Date(selected.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Status</p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${statusColor[selected.status]}`}>
                  {selected.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}