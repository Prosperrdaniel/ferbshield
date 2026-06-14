'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Report = {
  id: string
  type: string
  status: string
  created_at: string
}

export default function Analytics() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('reports')
        .select('id, type, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      setReports(data || [])
      setLoading(false)
    }
    load()
  }, [router])

  // Reports by type
  const byType = reports.reduce((acc: Record<string, number>, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1
    return acc
  }, {})

  // Reports by status
  const byStatus = reports.reduce((acc: Record<string, number>, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {})

  // Reports by month
  const byMonth = reports.reduce((acc: Record<string, number>, r) => {
    const month = new Date(r.created_at).toLocaleString('default', { month: 'short', year: '2-digit' })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})

  const maxType = Math.max(...Object.values(byType), 1)
  const maxMonth = Math.max(...Object.values(byMonth), 1)

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-500',
    under_review: 'bg-blue-500',
    resolved: 'bg-green-500',
    closed: 'bg-slate-500',
  }

  const typeColors = ['bg-cyan-500', 'bg-purple-500', 'bg-orange-500', 'bg-green-500', 'bg-red-500', 'bg-blue-500', 'bg-pink-500', 'bg-yellow-500']

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

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-2">Analytics</h1>
        <p className="text-slate-400 mb-10">A breakdown of your reported incidents over time.</p>

        {reports.length === 0 ? (
          <div className="bg-[#111827] border border-slate-700/50 rounded-xl p-12 text-center">
            <p className="text-slate-400 text-sm">No data yet. Submit reports to see your analytics.</p>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Reports', value: reports.length, color: 'text-cyan-400' },
                { label: 'Pending', value: byStatus['pending'] || 0, color: 'text-yellow-400' },
                { label: 'Under Review', value: byStatus['under_review'] || 0, color: 'text-blue-400' },
                { label: 'Resolved', value: byStatus['resolved'] || 0, color: 'text-green-400' },
              ].map((s) => (
                <div key={s.label} className="bg-[#111827] border border-slate-700/50 rounded-xl p-5">
                  <p className="text-slate-400 text-xs mb-1">{s.label}</p>
                  <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Reports by Month */}
            {Object.keys(byMonth).length > 0 && (
              <div className="bg-[#111827] border border-slate-700/50 rounded-xl p-6">
                <h2 className="font-semibold mb-6">Reports Over Time</h2>
                <div className="flex items-end gap-3 h-36">
                  {Object.entries(byMonth).map(([month, count]) => (
                    <div key={month} className="flex flex-col items-center gap-2 flex-1">
                      <span className="text-slate-400 text-xs">{count}</span>
                      <div
                        className="w-full bg-cyan-500 rounded-t-md transition-all"
                        style={{ height: `${(count / maxMonth) * 100}px` }}
                      />
                      <span className="text-slate-500 text-xs">{month}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reports by Type */}
            <div className="bg-[#111827] border border-slate-700/50 rounded-xl p-6">
              <h2 className="font-semibold mb-6">Reports by Incident Type</h2>
              <div className="space-y-4">
                {Object.entries(byType).map(([type, count], i) => (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-slate-300 text-sm">{type}</span>
                      <span className="text-slate-400 text-sm">{count}</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${typeColors[i % typeColors.length]} transition-all`}
                        style={{ width: `${(count / maxType) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reports by Status */}
            <div className="bg-[#111827] border border-slate-700/50 rounded-xl p-6">
              <h2 className="font-semibold mb-6">Reports by Status</h2>
              <div className="flex items-center gap-4 flex-wrap">
                {Object.entries(byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${statusColor[status] || 'bg-slate-500'}`} />
                    <span className="text-slate-300 text-sm capitalize">{status.replace('_', ' ')}</span>
                    <span className="text-slate-500 text-sm">({count})</span>
                  </div>
                ))}
              </div>

              {/* Pie-style bar */}
              <div className="flex rounded-full overflow-hidden h-4 mt-4">
                {Object.entries(byStatus).map(([status, count]) => (
                  <div
                    key={status}
                    className={`${statusColor[status] || 'bg-slate-500'} transition-all`}
                    style={{ width: `${(count / reports.length) * 100}%` }}
                    title={`${status}: ${count}`}
                  />
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  )
}