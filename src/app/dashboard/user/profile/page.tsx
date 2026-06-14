'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ProfileSettings() {
  const [profile, setProfile] = useState<{ full_name: string; email: string } | null>(null)
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [nameSuccess, setNameSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [nameError, setNameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single()

      setProfile(data)
      setFullName(data?.full_name || '')
      setLoading(false)
    }
    load()
  }, [router])

  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setNameError('')
    setNameSuccess(false)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id)

    if (error) {
      setNameError(error.message)
    } else {
      setNameSuccess(true)
      setProfile(prev => prev ? { ...prev, full_name: fullName } : prev)
    }
    setSaving(false)
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }

    setSavingPassword(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setPasswordError(error.message)
    } else {
      setPasswordSuccess(true)
      setNewPassword('')
      setConfirmPassword('')
    }
    setSavingPassword(false)
  }

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
        <h1 className="text-2xl font-semibold mb-2">Profile Settings</h1>
        <p className="text-slate-400 mb-10">Manage your account information and security.</p>

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-500/30 flex items-center justify-center text-cyan-400 text-2xl font-bold">
            {profile?.full_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-semibold text-lg">{profile?.full_name}</p>
            <p className="text-slate-400 text-sm">{profile?.email}</p>
            <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block">Standard User</span>
          </div>
        </div>

        {/* Update Name */}
        <div className="bg-[#111827] border border-slate-700/50 rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-1">Personal Information</h2>
          <p className="text-slate-400 text-sm mb-6">Update your display name.</p>

          <form onSubmit={handleUpdateName} className="space-y-4">
            {nameError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
                {nameError}
              </div>
            )}
            {nameSuccess && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-lg">
                Name updated successfully!
              </div>
            )}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-[#0a0f1e] border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full bg-[#0a0f1e] border border-slate-700/50 text-slate-500 rounded-lg px-4 py-3 text-sm cursor-not-allowed"
              />
              <p className="text-slate-600 text-xs mt-1">Email cannot be changed.</p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Update Password */}
        <div className="bg-[#111827] border border-slate-700/50 rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-1">Change Password</h2>
          <p className="text-slate-400 text-sm mb-6">Choose a strong password to keep your account secure.</p>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {passwordError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-lg">
                Password updated successfully!
              </div>
            )}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Min. 8 characters"
                className="w-full bg-[#0a0f1e] border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repeat your new password"
                className="w-full bg-[#0a0f1e] border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={savingPassword}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              {savingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#111827] border border-red-500/20 rounded-xl p-6">
          <h2 className="font-semibold text-red-400 mb-1">Danger Zone</h2>
          <p className="text-slate-400 text-sm mb-4">Sign out of your account on this device.</p>
          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </main>
  )
}