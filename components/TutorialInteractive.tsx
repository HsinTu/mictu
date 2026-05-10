'use client'

import { useEffect, useState } from 'react'

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className="fixed top-14 left-0 right-0 z-50 h-[3px] bg-gray-100">
      <div
        className="h-full transition-[width] duration-75"
        style={{ width: `${progress}%`, background: '#0369a1' }}
      />
    </div>
  )
}

export function SectionCompleteButton({ slug }: { slug: string }) {
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDone(localStorage.getItem(`tutorial:${slug}`) === 'done')
  }, [slug])

  const toggle = () => {
    if (done) {
      localStorage.removeItem(`tutorial:${slug}`)
      setDone(false)
    } else {
      localStorage.setItem(`tutorial:${slug}`, 'done')
      setDone(true)
    }
    window.dispatchEvent(new Event('tutorial-progress'))
  }

  return (
    <button
      onClick={toggle}
      className="px-6 py-2.5 text-sm font-bold rounded-full border-2 transition-all duration-200"
      style={done ? {
        background: '#0369a1',
        borderColor: '#0369a1',
        color: 'white',
      } : {
        background: '#e0f2fe',
        borderColor: '#0369a1',
        color: '#0c4a6e',
      }}
    >
      {done ? '✓ 已標註為完成' : '標註為完成'}
    </button>
  )
}
