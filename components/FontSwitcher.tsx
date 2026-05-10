'use client'

import { useState, useEffect } from 'react'

const FONTS = [
  { key: 'noto',  label: '思源黑體' },
  { key: 'roboto', label: 'Roboto'   },
  { key: 'serif',  label: 'Serif'    },
] as const

type FontKey = typeof FONTS[number]['key'] | null

const ALL_CLASSES = FONTS.map(f => `font-${f.key}`)

export default function FontSwitcher() {
  const [active, setActive] = useState<FontKey>(null)

  useEffect(() => {
    const saved = localStorage.getItem('font-style') as FontKey
    if (saved) {
      setActive(saved)
      document.documentElement.classList.add(`font-${saved}`)
    }
  }, [])

  const select = (key: FontKey) => {
    document.documentElement.classList.remove(...ALL_CLASSES)
    if (active === key) {
      // 點同一個 → 取消，回到系統預設
      localStorage.removeItem('font-style')
      setActive(null)
    } else {
      document.documentElement.classList.add(`font-${key}`)
      localStorage.setItem('font-style', key!)
      setActive(key)
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-gray-400 hidden sm:inline">字體</span>
      {FONTS.map(f => (
        <button
          key={f.key}
          onClick={() => select(f.key)}
          className={`text-xs px-2 py-0.5 rounded border transition-colors ${
            active === f.key
              ? 'border-gray-600 bg-gray-100 text-gray-800 font-medium'
              : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
