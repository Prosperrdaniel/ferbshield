'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const articles = [
  {
    id: 1,
    category: 'Phishing',
    title: 'How to Identify Phishing Emails',
    summary: 'Learn the warning signs of phishing attacks and how to protect yourself from fake emails designed to steal your credentials.',
    content: `Phishing emails are one of the most common cyber threats today. They are designed to trick you into giving away sensitive information like passwords, credit card numbers, or personal data.

**Warning Signs:**
- Urgent or threatening language ("Your account will be closed!")
- Suspicious sender email address (e.g. support@paypa1.com)
- Generic greetings like "Dear Customer"
- Links that don't match the official website
- Unexpected attachments

**How to Stay Safe:**
- Never click links in unsolicited emails
- Verify the sender's email address carefully
- Go directly to the website by typing the URL
- Enable two-factor authentication on all accounts
- Report suspicious emails to your email provider`,
    readTime: '3 min read',
    color: 'cyan',
  },
  {
    id: 2,
    category: 'Identity Theft',
    title: 'Protecting Your Personal Information Online',
    summary: 'Discover practical steps to safeguard your identity and what to do if your personal information has been compromised.',
    content: `Identity theft occurs when someone uses your personal information without your permission to commit fraud or other crimes.

**Common Ways Identity Gets Stolen:**
- Data breaches from companies you use
- Phishing scams
- Unsecured public Wi-Fi
- Physical theft of documents or devices

**How to Protect Yourself:**
- Use strong, unique passwords for every account
- Enable two-factor authentication
- Monitor your bank and credit card statements regularly
- Shred physical documents with personal info
- Use a VPN on public Wi-Fi
- Freeze your credit if you suspect theft

**If You're a Victim:**
- Report to your bank immediately
- File a report with local authorities
- Change all compromised passwords`,
    readTime: '4 min read',
    color: 'purple',
  },
  {
    id: 3,
    category: 'Ransomware',
    title: 'What is Ransomware and How to Prevent It',
    summary: 'Understand how ransomware works, how it spreads, and the best practices to keep your files and devices safe.',
    content: `Ransomware is malicious software that encrypts your files and demands payment to restore access. It can affect individuals, businesses, and even hospitals.

**How Ransomware Spreads:**
- Email attachments from unknown senders
- Clicking malicious links
- Downloading software from untrusted sources
- Exploiting unpatched software vulnerabilities

**Prevention Tips:**
- Keep your operating system and software updated
- Back up your files regularly (offline or cloud)
- Never open attachments from unknown senders
- Use reputable antivirus software
- Avoid downloading cracked or pirated software

**If You're Infected:**
- Disconnect from the internet immediately
- Do NOT pay the ransom — it doesn't guarantee recovery
- Report the incident to authorities
- Restore from a clean backup`,
    readTime: '4 min read',
    color: 'orange',
  },
  {
    id: 4,
    category: 'Password Safety',
    title: 'Creating and Managing Strong Passwords',
    summary: 'A weak password is an open door for hackers. Learn how to create strong passwords and manage them securely.',
    content: `Passwords are your first line of defense against unauthorized access. Yet most people still use weak, easily guessable passwords.

**What Makes a Strong Password:**
- At least 12 characters long
- Mix of uppercase, lowercase, numbers, and symbols
- No dictionary words or personal info
- Unique for every account

**Tips:**
- Use a passphrase: "PurpleTiger$Runs@Night2024"
- Never reuse passwords across sites
- Use a password manager (Bitwarden, 1Password)
- Change passwords after any suspected breach
- Enable two-factor authentication everywhere

**Common Mistakes to Avoid:**
- Using "password", "123456", or your name
- Writing passwords on sticky notes
- Sharing passwords with anyone`,
    readTime: '3 min read',
    color: 'green',
  },
  {
    id: 5,
    category: 'Safe Browsing',
    title: 'How to Browse the Internet Safely',
    summary: 'Simple habits that protect you from malicious websites, trackers, and online scams while browsing the web.',
    content: `Most cyber threats start with a simple click. Developing safe browsing habits can dramatically reduce your risk online.

**Safe Browsing Habits:**
- Always check for HTTPS before entering personal info
- Avoid clicking ads or pop-ups
- Don't download files from unknown websites
- Use a reputable browser with security features
- Keep your browser and extensions updated

**Tools That Help:**
- Ad blockers (uBlock Origin)
- VPNs for privacy on public networks
- Password managers
- Antivirus with web protection

**Red Flags on Websites:**
- No HTTPS (padlock icon)
- Poor grammar and spelling
- Offers that seem too good to be true
- Requests for unnecessary personal info`,
    readTime: '3 min read',
    color: 'blue',
  },
  {
    id: 6,
    category: 'Cyberbullying',
    title: 'Recognizing and Responding to Cyberbullying',
    summary: 'Learn what cyberbullying looks like, how to respond, and how to support someone who is being targeted online.',
    content: `Cyberbullying is the use of digital platforms to harass, threaten, or humiliate someone. It can happen on social media, messaging apps, gaming platforms, and more.

**Forms of Cyberbullying:**
- Sending threatening or hurtful messages
- Spreading rumors online
- Posting embarrassing photos without consent
- Excluding someone from online groups
- Impersonating someone online

**If You're Being Cyberbullied:**
- Don't respond to the bully
- Screenshot and document everything
- Block the person on all platforms
- Report to the platform
- Tell a trusted adult or authority
- Report to FerbShield for official assistance

**How to Support Someone:**
- Listen without judgment
- Help them document the abuse
- Encourage them to report it
- Check in regularly`,
    readTime: '3 min read',
    color: 'red',
  },
]

const colorMap: Record<string, string> = {
  cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  green: 'bg-green-500/20 text-green-400 border-green-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const dotMap: Record<string, string> = {
  cyan: 'bg-cyan-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  red: 'bg-red-500',
}

export default function AwarenessCenter() {
  const [selected, setSelected] = useState<typeof articles[0] | null>(null)
  const [search, setSearch] = useState('')
  const router = useRouter()

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  )

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
        <h1 className="text-2xl font-semibold mb-2">Awareness Center</h1>
        <p className="text-slate-400 mb-8">Stay informed about cyber threats and how to protect yourself.</p>

        {/* Search */}
        <div className="relative mb-8">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111827] border border-slate-700 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelected(article)}
              className="bg-[#111827] border border-slate-700/50 rounded-xl p-6 cursor-pointer hover:border-cyan-500/40 transition-colors flex flex-col gap-3"
            >
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium border w-fit ${colorMap[article.color]}`}>
                {article.category}
              </span>
              <h3 className="text-white font-medium text-sm leading-snug">{article.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed flex-1">{article.summary}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-slate-500 text-xs">{article.readTime}</span>
                <span className="text-cyan-400 text-xs hover:text-cyan-300">Read more →</span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-sm">No articles found for "{search}"</p>
          </div>
        )}
      </div>

      {/* Article Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4" onClick={() => setSelected(null)}>
          <div
            className="bg-[#111827] border border-slate-700/50 rounded-2xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${colorMap[selected.color]}`}>
                {selected.category}
              </span>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">{selected.title}</h2>
            <p className="text-slate-500 text-xs mb-6">{selected.readTime}</p>
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {selected.content}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}