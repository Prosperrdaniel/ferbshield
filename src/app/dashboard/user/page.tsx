'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function UserDashboard() {
  const [profile, setProfile] = useState<{ full_name: string; role: string } | null>(null)
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 })
  const [recentReports, setRecentReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
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
      setProfile(profileData)

      const { data: reports } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (reports) {
        setStats({
          total: reports.length,
          pending: reports.filter(r => r.status === 'pending' || r.status === 'under_review').length,
          resolved: reports.filter(r => r.status === 'resolved' || r.status === 'closed').length,
        })
        setRecentReports(reports.slice(0, 5))
      }

      setLoading(false)
    }
    load()
  }, [router])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </main>
    )
  }

  const menuItems = [
    { label: 'Dashboard', icon: '⊞', href: '/dashboard/user' },
    { label: 'Report Incident', icon: '⚑', href: '/dashboard/user/report' },
    { label: 'Track Reports', icon: '◎', href: '/dashboard/user/track' },
    { label: 'Awareness Center', icon: '✦', href: '/dashboard/user/awareness' },
    { label: 'Notifications', icon: '🔔', href: '/dashboard/user/notifications' },
    { label: 'Analytics', icon: '▦', href: '/dashboard/user/analytics' },
    { label: 'Help & Support', icon: '?', href: '/dashboard/user/help' },
    { label: 'Profile Settings', icon: '◉', href: '/dashboard/user/profile' },
  ]

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    under_review: 'bg-blue-500/20 text-blue-400',
    resolved: 'bg-green-500/20 text-green-400',
    closed: 'bg-slate-500/20 text-slate-400',
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">

      {menuOpen && (
        <div className="fixed inset-0 bg-black/60 z-30" onClick={() => setMenuOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-72 bg-[#0d1424] border-r border-slate-700/50 z-40 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
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
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-semibold">
              {profile?.full_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{profile?.full_name}</p>
              <p className="text-slate-400 text-xs">Standard User</p>
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
              <span className="text-cyan-400 w-5 text-center">{item.icon}</span>
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

      <nav className="border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setMenuOpen(true)} className="text-slate-400 hover:text-white transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
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
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm hidden sm:block">{profile?.full_name}</span>
          <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded-full font-medium">User</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-2">My Dashboard</h1>
        <p className="text-slate-400 mb-10">Track your reports and case status</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Reports', value: stats.total },
            { label: 'Pending Cases', value: stats.pending },
            { label: 'Resolved Cases', value: stats.resolved },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#111827] border border-slate-700/50 rounded-xl p-6">
              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#111827] border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg">Recent Reports</h2>
            <button
              onClick={() => router.push('/dashboard/user/report')}
              className="bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + New Report
            </button>
          </div>

          {recentReports.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-10">No reports filed yet. Submit your first incident report.</p>
          ) : (
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-[#0a0f1e] rounded-xl border border-slate-700/30">
                  <div>
                    <p className="text-white text-sm font-medium">{report.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{report.type} · {new Date(report.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[report.status] || 'bg-slate-500/20 text-slate-400'}`}>
                    {report.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}