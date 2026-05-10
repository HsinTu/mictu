import Link from 'next/link'

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  )
}

const NAV_LINKS = [
  { label: '關於我', href: '/about' },
  { label: '教學資源', href: '/google-sheets-tutorial' },
  { label: '選書', href: '/books' },
  { label: '生活誌', href: '/life' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#0a2540', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6 py-5">

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Brand */}
          <Link href="/" className="font-black text-lg tracking-tight shrink-0" style={{ color: 'white' }}>
            MicTu
          </Link>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs transition-colors hover:text-white"
                style={{ color: '#94a3b8' }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn"
              className="transition-colors hover:text-white" style={{ color: '#64748b' }}>
              <LinkedInIcon />
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube"
              className="transition-colors hover:text-white" style={{ color: '#64748b' }}>
              <YouTubeIcon />
            </a>
            <a href="mailto:hsintu0809@gmail.com" title="Email"
              className="transition-colors hover:text-white" style={{ color: '#64748b' }}>
              <EmailIcon />
            </a>
          </div>

        </div>

        <div className="mt-4 pt-3 flex flex-col sm:flex-row items-center justify-between gap-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs" style={{ color: '#334155' }}>© 2025 MicTu · All rights reserved</p>
          <p className="text-xs" style={{ color: '#334155' }}>Built with Next.js · Deployed on Vercel</p>
        </div>

      </div>
    </footer>
  )
}
