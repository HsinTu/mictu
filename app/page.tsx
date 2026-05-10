import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import HeroParallax from '@/app/components/HeroParallax'

const CATEGORIES = ['全部', '書評', '隨筆', '技術筆記', '教材']

const CATEGORY_COLORS: Record<string, string> = {
  '書評': 'text-blue-600 bg-blue-50',
  '隨筆': 'text-emerald-600 bg-emerald-50',
  '技術筆記': 'text-purple-600 bg-purple-50',
  '教材': 'text-orange-600 bg-orange-50',
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category: rawCategory } = await searchParams
  const category = rawCategory || '全部'
  const allPosts = getAllPosts()
  const posts = category === '全部'
    ? allPosts
    : allPosts.filter(p => p.category === category)

  return (
    <div className="min-h-screen bg-white text-[#292929]">
      {/* ── Hero ── extends behind fixed navbar via -mt-14 */}
      <HeroParallax
        className="-mt-14"
        style={{ minHeight: '480px' }}
        bgStyle={{
          backgroundColor: '#f0f9ff',
          backgroundImage: [
            'linear-gradient(rgba(3,105,161,0.07) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(3,105,161,0.07) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '48px 28px',
        }}
        bottomFade="#ffffff"
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-16 pt-32 lg:pt-40 pb-20 lg:pb-28">
          <h1 className="font-bold leading-[1.12] mb-6" style={{
            fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)',
            color: '#0a2540',
            letterSpacing: '-0.02em',
          }}>
            你好，我是 <span style={{ color: '#0369a1' }}>MicTu</span>
          </h1>
          <p className="text-xl lg:text-2xl leading-relaxed" style={{ color: '#475569', fontWeight: 400 }}>
            這裡存放我的讀書心得、隨筆思考與技術筆記。讓思考留下痕跡。
          </p>
        </div>
      </HeroParallax>

      <main className="max-w-[860px] mx-auto px-6 pt-12 pb-24">
        {/* 分類 tabs */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {CATEGORIES.map(cat => (
            <Link
              key={cat}
              href={cat === '全部' ? '/' : `/?category=${encodeURIComponent(cat)}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-[#292929] text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* 文章列表 */}
        <div className="divide-y divide-gray-100">
          {posts.length > 0 ? (
            posts.map(post => (
              <article key={post.slug} className="py-10 group">
                <Link href={`/posts/${encodeURIComponent(post.slug)}`} className="block">
                  <div className="mb-3">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] || 'text-gray-600 bg-gray-100'}`}>
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2 group-hover:text-gray-400 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="text-[16px] text-gray-500 mb-4 leading-relaxed line-clamp-2">
                      {post.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-400 flex-wrap">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readingTime} 分鐘閱讀</span>
                    {post.tags.length > 0 && (
                      <>
                        <span>·</span>
                        <div className="flex gap-2 flex-wrap">
                          {post.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <p className="text-gray-400 italic py-10">
              {category === '全部'
                ? '還沒有文章，快來新增吧！'
                : `目前還沒有「${category}」分類的文章。`}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
