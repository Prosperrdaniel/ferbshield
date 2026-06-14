'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const faqs = [
  {
    question: 'How do I report a cybercrime incident?',
    answer: 'Go to "Report Incident" from the dashboard or the hamburger menu. Fill in the incident type, title, date, description and any evidence, then click Submit. Your report will be reviewed by our team.',
  },
  {
    question: 'How long does it take to process my report?',
    answer: 'Most reports are reviewed within 24-72 hours. Complex cases may take longer. You can track the status of your report in the "Track Reports" section.',
  },
  {
    question: 'What does each report status mean?',
    answer: 'Pending: Your report has been received and is waiting for review. Under Review: An investigator is actively reviewing your case. Resolved: Your case has been resolved. Closed: The case has been closed.',
  },
  {
    question: 'Can I edit or delete a report after submitting?',
    answer: 'Currently reports cannot be edited or deleted after submission to maintain the integrity of the investigation. Contact support if you need to add additional information.',
  },
  {
    question: 'What types of incidents can I report?',
    answer: 'You can report Phishing, Identity Theft, Ransomware, Fraud, Hacking, Cyberbullying, Data Breaches, and other cyber-related incidents.',
  },
  {
    question: 'Is my personal information kept confidential?',
    answer: 'Yes. All your personal data and report details are kept strictly confidential and are only accessible to authorized personnel handling your case.',
  },
  {
    question: 'How do I update my profile or change my password?',
    answer: 'Go to "Profile Settings" from the hamburger menu. You can update your name and change your password from there.',
  },
  {
    question: 'What should I do in case of an ongoing cyber attack?',
    answer: 'Disconnect from the internet immediately, change your passwords from a safe device, and file a report on FerbShield as soon as possible. For urgent situations contact local law enforcement.',
  },
]

export default function HelpSupport() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  function toggle(i: number) {
    setOpenIndex(openIndex === i ? null : i)
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

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-2">Help & Support</h1>
        <p className="text-slate-400 mb-10">Find answers to common questions or send us a message.</p>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: '📋', label: 'Report an Incident', href: '/dashboard/user/report' },
            { icon: '🔍', label: 'Track Your Reports', href: '/dashboard/user/track' },
            { icon: '📚', label: 'Awareness Center', href: '/dashboard/user/awareness' },
          ].map((link) => (
            <button
              key={link.label}
              onClick={() => router.push(link.href)}
              className="bg-[#111827] border border-slate-700/50 rounded-xl p-5 text-left hover:border-cyan-500/40 transition-colors"
            >
              <p className="text-2xl mb-2">{link.icon}</p>
              <p className="text-white text-sm font-medium">{link.label}</p>
            </button>
          ))}
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-[#111827] border border-slate-700/50 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-white text-sm font-medium pr-4">{faq.question}</span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"
                    className={`shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                {openIndex === i && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#111827] border border-slate-700/50 rounded-xl p-8">
          <h2 className="text-lg font-semibold mb-1">Still need help?</h2>
          <p className="text-slate-400 text-sm mb-6">Send us a message and we'll get back to you.</p>

          {submitted ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <p className="text-white font-medium">Message sent!</p>
              <p className="text-slate-400 text-sm mt-1">We'll respond to your query as soon as possible.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}
              className="space-y-4"
            >
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="What do you need help with?"
                  className="w-full bg-[#0a0f1e] border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your issue in detail..."
                  className="w-full bg-[#0a0f1e] border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}