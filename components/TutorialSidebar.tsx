'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

type Section = { slug: string; title: string }
type Chapter = { slug: string; title: string; sections: Section[]; standalone?: boolean }

function SectionTitle({ title }: { title: string }) {
  const m = title.match(/^(\d+\.\d+)\s+(.+)$/) || title.match(/^(附錄\s*\d+\.?)\s+(.+)$/)
  if (!m) return <span>{title}</span>
  return (
    <span className="flex gap-1.5">
      <span className="shrink-0">{m[1]}</span>
      <span>{m[2]}</span>
    </span>
  )
}

function ChapterTitle({ title }: { title: string }) {
  const m = title.match(/^(Chapter\s+\d+\.?)\s+(.+)$/)
  if (!m) return <span>{title}</span>
  return (
    <>
      <span className="block text-xs font-bold tracking-widest uppercase" style={{ color: '#0369a1' }}>{m[1]}</span>
      <span className="block text-sm font-semibold text-gray-600 mt-0.5">{m[2]}</span>
    </>
  )
}

export default function TutorialSidebar({ chapters }: { chapters: Chapter[] }) {
  const pathname = usePathname()
  const currentSlug = pathname.split('/').pop() || ''
  const [open, setOpen] = useState(false)
  const [completed, setCompleted] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const refresh = () => {
      const map: Record<string, boolean> = {}
      chapters.forEach(ch =>
        ch.sections.forEach(s => {
          map[s.slug] = localStorage.getItem(`tutorial:${s.slug}`) === 'done'
        })
      )
      setCompleted(map)
    }
    refresh()
    window.addEventListener('tutorial-progress', refresh)
    return () => window.removeEventListener('tutorial-progress', refresh)
  }, [pathname, chapters])

  return (
    <>
      <button
        className="lg:hidden fixed bottom-6 right-6 z-50 text-white px-4 py-2.5 rounded-full text-sm font-bold shadow-lg"
        style={{ background: '#0369a1' }}
        onClick={() => setOpen(!open)}
      >
        {open ? '✕ 關閉' : '☰ 目錄'}
      </button>

      <aside className={`
        fixed top-14 left-0 h-[calc(100vh-56px)] w-64 border-r border-gray-200
        overflow-y-auto z-40 transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:sticky lg:top-14 lg:h-[calc(100vh-56px)] lg:shrink-0
      `} style={{ background: '#f5faff' }}>
        <div className="py-6 px-4">
          <Link
            href="/google-sheets-tutorial"
            className="block text-sm font-semibold uppercase tracking-widest mb-5 hover:opacity-80 transition-opacity"
            style={{ color: '#0369a1' }}
          >
            ← 教材首頁
          </Link>

          {chapters.map(chapter => {
            if (chapter.standalone) {
              const isActive = currentSlug === chapter.slug
              return (
                <div key={chapter.slug} className="mb-3">
                  <Link
                    href={`/google-sheets-tutorial/${chapter.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center px-3 py-1.5 rounded-md text-sm font-semibold transition-colors"
                    style={isActive ? {
                      background: '#0c4a6e',
                      color: 'white',
                    } : {
                      color: '#0369a1',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#e0f2fe'
                        e.currentTarget.style.color = '#0c4a6e'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = ''
                        e.currentTarget.style.color = '#0369a1'
                      }
                    }}
                  >
                    {chapter.title}
                  </Link>
                </div>
              )
            }

            return (
              <div key={chapter.slug} className="mb-6">
                <div className="mb-2 px-2">
                  <ChapterTitle title={chapter.title} />
                </div>
                <ul className="space-y-0.5">
                  {chapter.sections.map(section => {
                    const isActive = currentSlug === section.slug
                    const isDone = completed[section.slug]
                    return (
                      <li key={section.slug}>
                        <Link
                          href={`/google-sheets-tutorial/${section.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors"
                          style={isActive ? {
                            background: '#0c4a6e',
                            color: 'white',
                            fontWeight: 600,
                          } : {
                            color: '#374151',
                          }}
                          onMouseEnter={e => {
                            if (!isActive) {
                              e.currentTarget.style.background = '#e0f2fe'
                              e.currentTarget.style.color = '#0c4a6e'
                            }
                          }}
                          onMouseLeave={e => {
                            if (!isActive) {
                              e.currentTarget.style.background = ''
                              e.currentTarget.style.color = '#374151'
                            }
                          }}
                        >
                          <SectionTitle title={section.title} />
                          {isDone && (
                            <svg className="ml-1 shrink-0" width="13" height="13" viewBox="0 0 13 13" fill="none">
                              <path d="M2.5 6.5L5.5 9.5L10.5 4" stroke={isActive ? 'white' : '#0369a1'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}
