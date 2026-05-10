import Link from 'next/link'
import { getTutorialMeta, getFunctionIndex } from '@/lib/tutorial'
import HeroParallax from '@/app/components/HeroParallax'

export const metadata = {
  title: { absolute: "MicTu - Google Sheets 完全指南" },
}

export default function TutorialIndexPage() {
  const meta = getTutorialMeta()
  const functions = getFunctionIndex()

  const funcByLetter: Record<string, typeof functions> = {}
  for (const fn of functions) {
    const letter = fn.name[0]
    if (!funcByLetter[letter]) funcByLetter[letter] = []
    funcByLetter[letter].push(fn)
  }
  const letters = Object.keys(funcByLetter).sort()

  return (
    <>
      {/* ── Hero ── extends behind fixed navbar via -mt-14 */}
      <HeroParallax
        className="-mt-14"
        style={{ minHeight: '520px' }}
        bgStyle={{
          backgroundColor: '#f0f9ff',
          backgroundImage: [
            'linear-gradient(rgba(3,105,161,0.07) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(3,105,161,0.07) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '48px 28px',
        }}
        bottomFade="#f4f7fb"
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-16 pt-32 lg:pt-40 pb-24 lg:pb-32">

          <h1 className="font-bold leading-[1.12] mb-6" style={{
            fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)',
            color: '#0a2540',
            letterSpacing: '-0.02em',
          }}>
            Google Sheets <span style={{ color: '#0369a1' }}>完全指南</span>
          </h1>

          <p className="text-xl lg:text-2xl leading-relaxed mb-12" style={{ color: '#475569', fontWeight: 400 }}>
            從零開始學習，建立最紮實的試算表基礎
          </p>

          <div className="flex flex-wrap gap-4">
            {[
              { num: '14',   label: '章節' },
              { num: '200+', label: '函式收錄' },
              { num: '750+', label: '分鐘教學影片' },
            ].map(({ num, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-6 py-3 rounded-full border"
                style={{ borderColor: '#bae6fd', background: 'white', boxShadow: '0 2px 8px rgba(3,105,161,0.09)' }}
              >
                <span className="font-bold text-3xl" style={{ color: '#0c4a6e' }}>{num}</span>
                <span className="text-base font-medium" style={{ color: '#1e3a5f' }}>{label}</span>
              </div>
            ))}
          </div>

        </div>
      </HeroParallax>

      {/* ── 內容區 ── */}
      <div className="px-6 lg:px-12 pt-12 pb-24 max-w-[820px] mx-auto">

        {/* 目錄 */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold" style={{ color: '#0c4a6e' }}>目錄</span>
            <div className="flex-1 h-px" style={{ background: '#bae6fd' }} />
          </div>

          <div className="flex flex-col">
            {meta.chapters.map((chapter, idx) => {
              const prevStandalone = idx > 0 && (meta.chapters[idx - 1] as any).standalone
              const mt = idx === 0 ? 0 : (chapter.standalone || prevStandalone) ? 12 : 32

              if (chapter.standalone) {
                return (
                  <Link
                    key={chapter.slug}
                    href={`/tutorial/${chapter.slug}`}
                    className="w-fit -ml-3 px-3 py-2 rounded-full text-xl font-bold transition-colors text-[#0a2540] hover:bg-[#0369a1] hover:text-white"
                    style={{ marginTop: mt }}
                  >
                    {chapter.title}
                  </Link>
                )
              }

              return (
                <div key={chapter.slug} style={{ marginTop: mt }}>
                  {/* Chapter title + file links on same row */}
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold" style={{ color: '#0a2540' }}>
                      {chapter.title}
                    </h2>
                    {(chapter.exampleUrl || chapter.doneUrl) && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {chapter.exampleUrl && (
                          <a href={chapter.exampleUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors bg-[#e0f2fe] text-[#0369a1] border-[#7dd3fc] hover:bg-[#0369a1] hover:text-white hover:border-[#0369a1]">
                            <span>📄</span>範例檔案
                          </a>
                        )}
                        {chapter.doneUrl && (
                          <a href={chapter.doneUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors bg-[#dcfce7] text-[#16a34a] border-[#86efac] hover:bg-[#16a34a] hover:text-white hover:border-[#16a34a]">
                            <span>✅</span>完成檔案
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  {chapter.desc && (
                    <p className="text-base text-gray-500 mb-2 leading-relaxed">{chapter.desc}</p>
                  )}
                  <ul>
                    {chapter.sections.map(section => (
                      <li key={section.slug}>
                        <Link
                          href={`/tutorial/${section.slug}`}
                          className="block px-3 py-2.5 rounded-full text-base text-gray-600 transition-colors hover:bg-[#0369a1] hover:text-white"
                        >
                          {section.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>

        {/* 函式索引 */}
        {functions.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl font-bold" style={{ color: '#0c4a6e' }}>函式索引</span>
              <div className="flex-1 h-px" style={{ background: '#bae6fd' }} />
            </div>
            <p className="text-base text-gray-500 mb-6 leading-relaxed">
              共 {functions.length} 個，依字母排序，點擊跳至介紹該函式的小節
            </p>
            <div className="divide-y divide-gray-200">
              {letters.map(letter => (
                <div key={letter} className="grid items-start py-3 pl-3 gap-x-3" style={{ gridTemplateColumns: '2.25rem 1fr' }}>
                  <span className="font-bold" style={{ color: '#0369a1', fontSize: '1.75rem', lineHeight: 1 }}>{letter}</span>
                  <div className="grid gap-x-3 gap-y-1.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(13rem, 1fr))' }}>
                    {funcByLetter[letter].map(fn => (
                      <Link key={fn.name} href={`/tutorial/${fn.slug}`} title={fn.section}
                        className="font-mono text-lg text-gray-600 hover:text-[#0369a1] transition-colors truncate">
                        {fn.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
