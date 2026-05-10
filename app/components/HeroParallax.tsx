'use client'
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

interface Props {
  className?: string
  style?: CSSProperties
  bgStyle?: CSSProperties
  bottomFade?: string
  children: ReactNode
}

/*
 * Wraps the hero section with a parallax background.
 * The background moves at 40% of scroll speed, so the hero background
 * drifts upward into the fixed navbar as the user scrolls — "融合" effect.
 *
 * Pass bgStyle to set the background color/image; defaults to the dark gradient.
 */
export default function HeroParallax({ className = '', style, bgStyle, bottomFade, children }: Props) {
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Parallax background — extends top/bottom to cover scroll offset */}
      <div
        ref={bgRef}
        className="absolute will-change-transform"
        style={{
          inset: '-80px 0',
          background: 'linear-gradient(135deg, #0a2540 0%, #0d3060 55%, #0a4a32 100%)',
          ...bgStyle,
        }}
      />
      {/* Content — normal scroll speed */}
      <div className="relative z-10">{children}</div>

      {/* Optional bottom fade — blends hero into page below */}
      {bottomFade && (
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{ height: '120px', background: `linear-gradient(to bottom, transparent, ${bottomFade})`, zIndex: 20 }}
        />
      )}
    </div>
  )
}
