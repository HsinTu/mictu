'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const NAV_ITEMS = [
  { label: '關於我', href: '/about', children: null },
  {
    label: '教學資源',
    href: '/google-sheets-tutorial',
    children: [{ label: 'Google Sheets 教學', href: '/google-sheets-tutorial' }],
  },
  { label: '選書', href: '/books', children: null },
  { label: '生活誌', href: '/life', children: null },
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

function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M2 3.5l3 3 3-3" />
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 80)
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  const textColor = '#111827'
  const mutedColor = '#1f2937'

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-14"
      style={{
        background: scrolled ? 'white' : 'transparent',
        borderBottom: scrolled ? '1px solid #f3f4f6' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.07)' : 'none',
        transition: 'background 0.6s ease, box-shadow 0.6s ease, border-color 0.6s ease',
      }}
    >
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between gap-6">

        {/* ── Left: Brand ── */}
        <Link href="/" className="flex items-center gap-0 shrink-0 select-none">
          <span className="font-semibold text-lg tracking-tight transition-colors" style={{ color: textColor }}>
            MicTu
          </span>
          <span className="text-sm font-normal ml-2 transition-colors" style={{ color: textColor }}>
            ｜ Google Sheets
          </span>
        </Link>

        {/* ── Center: Nav items ── */}
        <div className="flex items-stretch flex-1 justify-center">
          {NAV_ITEMS.map(item => (
            <div key={item.label} className="relative group flex items-stretch">
              <Link
                href={item.href}
                className="flex items-center gap-1 px-4 text-sm font-medium transition-colors"
                style={{ color: textColor }}
              >
                {item.label}
                {item.children && (
                  <span className="opacity-50 mt-0.5">
                    <ChevronDown />
                  </span>
                )}
              </Link>

              {item.children && (
                <div
                  className="absolute top-full left-0 pt-1 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150"
                  style={{ minWidth: '160px' }}
                >
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 overflow-hidden">
                    {item.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Right: Social icons ── */}
        <div className="flex items-center gap-3.5 shrink-0">
          <a
            href="https://www.linkedin.com"
            target="_blank" rel="noopener noreferrer"
            title="LinkedIn"
            className="transition-opacity hover:opacity-60"
            style={{ color: textColor }}
          >
            <LinkedInIcon />
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank" rel="noopener noreferrer"
            title="YouTube"
            className="transition-opacity hover:opacity-60"
            style={{ color: textColor }}
          >
            <YouTubeIcon />
          </a>
          <a
            href="mailto:hsintu0809@gmail.com"
            title="Email"
            className="transition-opacity hover:opacity-60"
            style={{ color: textColor }}
          >
            <EmailIcon />
          </a>
        </div>

      </div>
    </nav>
  )
}
