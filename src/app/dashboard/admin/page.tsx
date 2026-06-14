'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Report = {
  id: string
  title: string
  type: string
  description: string
  status: string
  created_at: string
  user_id: string
  profiles: { full_name: string; email: string } | null
}

export default function AdminDashboard() {
  const [profile, setProfile] = useState<{ full_name: string; role: string } | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [stats, setStats] = useState({ total: 0, pending: 0, under_review: 0, resolved: 0 })
  const [selected, setSelected] = useState<Report | null>(null)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', user.id)
        .single()

      if (profileData?.role !== 'admin') { router.push('/dashboard/user'); return }
      setProfile(profileData)

      await loadReports(supabase)
      setLoading(false)
    }
    load()
  }, [router])

  async function loadReports(supabase: any) {
    const { data } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setReports(data)
      setStats({
        total: data.length,
        pending: data.filter((r: Report) => r.status === 'pending').length,
        under_review: data.filter((r: Report) => r.status === 'under_review').length,
        resolved: data.filter((r: Report) => r.status === 'resolved' || r.status === 'closed').length,
      })
    }
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(true)
    const supabase = createClient()
    await supabase.from('reports').update({ status }).eq('id', id)

    // Send notification to user
    const report = reports.find(r => r.id === id)
    if (report) {
      await supabase.from('notifications').insert({
        user_id: report.user_id,
        title: 'Report Status Updated',
        message: `Your report "${report.title}" has been updated to: ${status.replace('_', ' ')}.`,
        type: 'status_update',
      })
    }

    await loadReports(supabase)
    setSelected(prev => prev ? { ...prev, status } : null)
    setUpdating(false)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter)

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    under_review: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
    closed: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  }

  const menuItems = [
    { label: 'Dashboard', icon: '⊞', href: '/dashboard/admin' },
    { label: 'All Reports', icon: '📋', href: '/dashboard/admin' },
    { label: 'Manage Users', icon: '👥', href: '/dashboard/admin/users' },
    { label: 'Awareness Center', icon: '✦', href: '/dashboard/admin/awareness' },
    { label: 'Analytics', icon: '▦', href: '/dashboard/admin/analytics' },
  ]

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">

      {menuOpen && (
        <div className="fixed inset-0 bg-black/60 z-30" onClick={() => setMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-[#0d1424] border-r border-slate-700/50 z-40 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span className="text-white font-bold text-lg">FerbShield</span>
          </div>
          <button onClick={() => setMenuOpen(false)} className="text-slate-400 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-semibold">
              {profile?.full_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{profile?.full_name}</p>
              <p className="text-orange-400 text-xs">Administrator</p>
            </div>
          </div>
        </div>

        <nav className="px-3 py-4 flex flex-col gap-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => { router.push(item.href); setMenuOpen(false) }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700/40 hover:text-white transition-colors text-sm text-left w-full"
            >
              <span className="text-orange-400 w-5 text-center">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 px-3 py-4 border-t border-slate-700/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm w-full"
          >
            <span className="w-5 text-center">→</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Topbar */}
      <nav className="border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setMenuOpen(true)} className="text-slate-400 hover:text-white transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">FerbShield</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm hidden sm:block">{profile?.full_name}</span>
          <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-full font-medium">Admin</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-2">Admin Dashboard</h1>
        <p className="text-slate-400 mb-10">Platform-wide overview and report management.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Reports', value: stats.total, color: 'text-white' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
            { label: 'Under Review', value: stats.under_review, color: 'text-blue-400' },
            { label: 'Resolved', value: stats.resolved, color: 'text-green-400' },
          ].map((s) => (
            <div key={s.label} className="bg-[#111827] border border-slate-700/50 rounded-xl p-6">
              <p className="text-slate-400 text-sm mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'pending', 'under_review', 'resolved', 'closed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#111827] border border-slate-700/50 text-slate-400 hover:text-white'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Reports Table */}
        <div className="bg-[#111827] border border-slate-700/50 rounded-xl overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-12">No reports found.</p>
          ) : (
            <div className="divide-y divide-slate-700/30">
              {filtered.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelected(report)}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-700/20 cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{report.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {report.type} · {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ml-4 shrink-0 ${statusColor[report.status] || 'bg-slate-500/20 text-slate-400'}`}>
                    {report.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4" onClick={() => setSelected(null)}>
          <div
            className="bg-[#111827] border border-slate-700/50 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-white font-semibold text-lg">{selected.title}</h2>
                <p className="text-slate-400 text-sm mt-1">{selected.type} · {selected.profiles?.full_name}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Reporter</p>
                <p className="text-slate-300 text-sm">User Report</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Description</p>
                <p className="text-slate-300 text-sm leading-relaxed">{selected.description}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Filed On</p>
                <p className="text-slate-300 text-sm">{new Date(selected.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Current Status</p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${statusColor[selected.status]}`}>
                  {selected.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Update Status */}
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">Update Status</p>
              <div className="grid grid-cols-2 gap-2">
                {['pending', 'under_review', 'resolved', 'closed'].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    disabled={updating || selected.status === s}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-colors capitalize disabled:opacity-40 ${
                      selected.status === s
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}