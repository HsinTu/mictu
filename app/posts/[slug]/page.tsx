import Link from 'next/link'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { notFound } from 'next/navigation'

const CATEGORY_COLORS: Record<string, string> = {
  '書評': 'text-blue-600 bg-blue-50',
  '隨筆': 'text-emerald-600 bg-emerald-50',
  '技術筆記': 'text-purple-600 bg-purple-50',
  '教材': 'text-orange-600 bg-orange-50',
}

export async function generateStaticParams() {
  return getAllPosts().map(post => ({ slug: post.slug }))
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(decodeURIComponent(slug))
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-white text-[#292929]">
      {/* 導覽列 */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-[860px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-70 transition-opacity">
            Mic&apos;s Space
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ← 返回
          </Link>
        </div>
      </nav>

      <main className="max-w-[680px] mx-auto px-6 pt-14 pb-24">
        {/* 文章標頭 */}
        <header className="mb-12">
          <div className="mb-5">
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] || 'text-gray-600 bg-gray-100'}`}>
              {post.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-5 tracking-tight">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-[20px] text-gray-500 leading-relaxed mb-6">
              {post.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-sm text-gray-400 flex-wrap">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readingTime} 分鐘閱讀</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <hr className="border-gray-100 mb-12" />

        {/* 文章內容 */}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />
      </main>

      <footer className="border-t border-gray-100 py-10 text-center text-sm text-gray-400">
        © 2026 Mic&apos;s Space
      </footer>
    </div>
  )
}
