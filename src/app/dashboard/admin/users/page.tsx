'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type User = {
  id: string
  full_name: string
  email: string
  role: string
  created_at: string
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') { router.push('/dashboard/user'); return }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      setUsers(data || [])
      setLoading(false)
    }
    load()
  }, [router])

  async function updateRole(id: string, role: string) {
    setUpdating(id)
    const supabase = createClient()
    await supabase.from('profiles').update({ role }).eq('id', id)
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
    setUpdating(null)
  }

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

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
        <button onClick={() => router.push('/dashboard/admin')} className="text-slate-400 hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
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
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-2">Manage Users</h1>
        <p className="text-slate-400 mb-8">View and manage all registered users on the platform.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Users', value: users.length },
            { label: 'Admins', value: users.filter(u => u.role === 'admin').length },
            { label: 'Standard Users', value: users.filter(u => u.role === 'user').length },
          ].map((s) => (
            <div key={s.label} className="bg-[#111827] border border-slate-700/50 rounded-xl p-5">
              <p className="text-slate-400 text-sm mb-1">{s.label}</p>
              <p className="text-3xl font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111827] border border-slate-700 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Users Table */}
        <div className="bg-[#111827] border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 px-6 py-3 border-b border-slate-700/50 text-slate-400 text-xs uppercase tracking-wide">
            <span>Name</span>
            <span>Email</span>
            <span>Joined</span>
            <span>Role</span>
          </div>

          {filtered.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-12">No users found.</p>
          ) : (
            <div className="divide-y divide-slate-700/30">
              {filtered.map((user) => (
                <div key={user.id} className="grid grid-cols-4 px-6 py-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 text-sm font-semibold shrink-0">
                      {user.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white text-sm truncate">{user.full_name}</span>
                  </div>
                  <span className="text-slate-400 text-sm truncate">{user.email}</span>
                  <span className="text-slate-400 text-sm">{new Date(user.created_at).toLocaleDateString()}</span>
                  <div>
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      disabled={updating === user.id}
                      className="bg-[#0a0f1e] border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}