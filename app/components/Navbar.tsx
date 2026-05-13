'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Articles', href: '/articles' },
  { label: 'Google Sheets', href: '/google-sheets-tutorial' },
  { label: 'Accounting', href: '/accounting' },
]

function LinkedInIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  )
}

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="19" y2="6" />
      <line x1="3" y1="11" x2="19" y2="11" />
      <line x1="3" y1="16" x2="19" y2="16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="4" y1="4" x2="18" y2="18" />
      <line x1="18" y1="4" x2="4" y2="18" />
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 80)
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const textColor = '#111827'

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-14"
        style={{
          background: scrolled || mobileOpen ? 'white' : 'transparent',
          borderBottom: scrolled || mobileOpen ? '1px solid #f3f4f6' : '1px solid transparent',
          boxShadow: scrolled || mobileOpen ? '0 1px 12px rgba(0,0,0,0.07)' : 'none',
          transition: 'background 0.6s ease, box-shadow 0.6s ease, border-color 0.6s ease',
        }}
      >
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between gap-6">

          {/* Brand */}
          <Link href="/" className="flex items-center shrink-0 select-none" onClick={() => setMobileOpen(false)}>
            <span className="font-semibold text-lg tracking-tight" style={{ color: textColor }}>
              MicTu
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-stretch flex-1 justify-center">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center px-4 text-sm font-medium transition-colors hover:opacity-60"
                style={{ color: textColor }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop social icons */}
          <div className="hidden md:flex items-center gap-3.5 shrink-0">
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn"
              className="transition-opacity hover:opacity-60" style={{ color: textColor }}>
              <LinkedInIcon />
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube"
              className="transition-opacity hover:opacity-60" style={{ color: textColor }}>
              <YouTubeIcon />
            </a>
            <a href="mailto:hsintu0809@gmail.com" title="Email"
              className="transition-opacity hover:opacity-60" style={{ color: textColor }}>
              <EmailIcon />
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center shrink-0 transition-opacity hover:opacity-60"
            style={{ color: textColor }}
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? '關閉選單' : '開啟選單'}
          >
            {mobileOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>

        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden fixed top-14 left-0 right-0 bottom-0 z-40 bg-white overflow-y-auto"
          style={{ borderTop: '1px solid #f3f4f6' }}
        >
          <div className="px-6 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="py-3 text-base font-medium border-b border-gray-100 last:border-0"
                style={{ color: textColor }}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-5 pt-5">
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn"
                className="transition-opacity hover:opacity-60" style={{ color: textColor }}>
                <LinkedInIcon />
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube"
                className="transition-opacity hover:opacity-60" style={{ color: textColor }}>
                <YouTubeIcon />
              </a>
              <a href="mailto:hsintu0809@gmail.com" title="Email"
                className="transition-opacity hover:opacity-60" style={{ color: textColor }}>
                <EmailIcon />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
