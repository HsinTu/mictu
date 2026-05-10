import Link from 'next/link'
import { getAllStaticSlugs, getSectionWithNeighbors } from '@/lib/tutorial'
import { notFound } from 'next/navigation'
import { ReadingProgressBar, SectionCompleteButton } from '@/components/TutorialInteractive'
import TutorialImageLightbox from '@/components/TutorialImageLightbox'

export async function generateStaticParams() {
  return getAllStaticSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = getSectionWithNeighbors(slug)
  if (!data) return {}
  return { title: data.section.title }
}

export default async function TutorialSectionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = getSectionWithNeighbors(slug)
  if (!data) notFound()

  const { section, chapter, prev, next, content, standalone } = data

  return (
    <>
      <ReadingProgressBar />
      <TutorialImageLightbox />

      <div className="pl-10 pr-6 lg:pl-20 lg:pr-12 pt-24 pb-24 max-w-[820px]">
        {/* 麵包屑 */}
        {!standalone && (
          <p className="text-xs font-semibold text-gray-400 mb-6">
            <Link href="/google-sheets-tutorial" className="hover:text-gray-700 transition-colors">
              {chapter.title}
            </Link>
            {' › '}
            <span className="text-gray-600">{section.title}</span>
          </p>
        )}

        {/* 標題 */}
        <h1 className="text-3xl font-bold tracking-tight mb-4">{section.title}</h1>

        {/* 影片嵌入 */}
        {section.videoId && (
          <div className="mb-10">
            <div className="relative w-full rounded-xl overflow-hidden shadow-sm" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${section.videoId}`}
                title={section.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        <hr className="border-gray-200 mb-10" />

        {/* 文章內容 */}
        {content ? (
          <div
            className="tutorial-body"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-gray-400 italic">（本節內容準備中）</p>
        )}

        {/* 完成本節按鈕（standalone 頁不顯示）*/}
        {!standalone && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <SectionCompleteButton slug={slug} />
          </div>
        )}

        {/* 上一節 / 下一節 */}
        <div className="mt-6 flex justify-between gap-4">
          {prev ? (
            <Link href={`/google-sheets-tutorial/${prev.slug}`} className="nav-card-prev flex-1 block p-4">
              <p className="nav-card-label">← 上一節</p>
              <p className="nav-card-title">{prev.title}</p>
            </Link>
          ) : <div className="flex-1" />}

          {next ? (
            <Link href={`/google-sheets-tutorial/${next.slug}`} className="nav-card-next flex-1 block p-4 text-right">
              <p className="nav-card-label">下一節 →</p>
              <p className="nav-card-title">{next.title}</p>
            </Link>
          ) : <div className="flex-1" />}
        </div>
      </div>
    </>
  )
}
