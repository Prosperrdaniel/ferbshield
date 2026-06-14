'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Notification = {
  id: string
  title: string
  message: string
  type: 'status_update' | 'alert' | 'info'
  read: boolean
  created_at: string
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setNotifications(data || [])
      setLoading(false)
    }
    load()
  }, [router])

  async function markAllRead() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)

    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  async function markRead(id: string) {
    const supabase = createClient()
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const typeIcon: Record<string, JSX.Element> = {
    status_update: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <path d="M22 4L12 14.01l-3-3"/>
      </svg>
    ),
    alert: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    info: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    ),
  }

  const typeColor: Record<string, string> = {
    status_update: 'bg-green-500/20 text-green-400',
    alert: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400',
  }

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

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-cyan-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
              {unreadCount} unread
            </span>
          )}
        </div>
        <p className="text-slate-400 mb-8">Stay updated on your case activity and platform alerts.</p>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-cyan-400 hover:text-cyan-300 text-sm mb-6 transition-colors"
          >
            Mark all as read
          </button>
        )}

        {notifications.length === 0 ? (
          <div className="bg-[#111827] border border-slate-700/50 rounded-xl p-12 text-center">
            <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <p className="text-slate-400 text-sm font-medium">No notifications yet</p>
            <p className="text-slate-500 text-xs mt-1">You'll be notified when your report status changes.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`bg-[#111827] border rounded-xl p-5 cursor-pointer transition-colors ${
                  n.read ? 'border-slate-700/50 opacity-60' : 'border-cyan-500/30 hover:border-cyan-500/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${typeColor[n.type]}`}>
                    {typeIcon[n.type]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-white text-sm font-medium">{n.title}</p>
                      {!n.read && <div className="w-2 h-2 bg-cyan-500 rounded-full shrink-0" />}
                    </div>
                    <p className="text-slate-400 text-xs mt-1">{n.message}</p>
                    <p className="text-slate-600 text-xs mt-2">{new Date(n.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}