'use client'
import { useEffect, useState } from 'react'

export default function TutorialImageLightbox() {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    const body = document.querySelector('.tutorial-body')
    if (!body) return

    const imgs = Array.from(body.querySelectorAll<HTMLImageElement>('img'))
    const cleanup: Array<() => void> = []

    imgs.forEach(img => {
      const applyPortrait = () => {
        if (img.naturalHeight > img.naturalWidth * 1.2) {
          img.classList.add('portrait-img')
        }
      }
      if (img.complete) applyPortrait()
      else {
        img.addEventListener('load', applyPortrait, { once: true })
        cleanup.push(() => img.removeEventListener('load', applyPortrait))
      }

      img.style.cursor = 'zoom-in'
      const onClick = () => setSrc(img.src)
      img.addEventListener('click', onClick)
      cleanup.push(() => img.removeEventListener('click', onClick))
    })

    return () => cleanup.forEach(fn => fn())
  }, [])

  if (!src) return null

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
      onClick={() => setSrc(null)}
    >
      <img
        src={src}
        alt=""
        className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      />
      <button
        className="absolute top-4 right-5 text-white/70 hover:text-white text-2xl leading-none"
        onClick={() => setSrc(null)}
      >
        ✕
      </button>
    </div>
  )
}
