import React from 'react';

export default function Home() {
  // 這裡之後可以改成從檔案讀取，現在先放假資料預覽 Vibe
  const articles = [
    { title: "建立個人數位花園的思考", date: "2026-03-21", tags: ["思考", "數位工具"] },
    { title: "為什麼我選擇 Vibe Coding？", date: "2026-03-15", tags: ["技術", "自動化"] },
    { title: "Notion 風格網頁的極簡美學", date: "2026-03-05", tags: ["設計"] },
  ];

  return (
    <div className="min-h-screen bg-white text-[#37352f] font-sans selection:bg-[#ebeced]">
      {/* 導覽列：保持極度透明與簡約 */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-8 h-12 flex items-center justify-between text-sm">
          <div className="font-medium hover:bg-zinc-100 px-2 py-1 rounded cursor-pointer transition-colors">
            🏠 Michael's Space
          </div>
          <div className="flex gap-4 text-zinc-500">
            <a href="#about" className="hover:text-black hover:bg-zinc-100 px-2 py-1 rounded transition-colors">自我介紹</a>
            <a href="#writing" className="hover:text-black hover:bg-zinc-100 px-2 py-1 rounded transition-colors">文章</a>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-8 pt-16 pb-24">
        {/* 自我介紹區塊 */}
        <section id="about" className="mb-20">
          <h1 className="text-4xl font-bold mb-8 tracking-tight">你好，我是 Michael</h1>
          <div className="prose prose-zinc leading-relaxed text-[16px] space-y-4">
            <p>
              這是我用來存放文章、隨筆與深度思考的數位空間。
            </p>
            <p>
              我熱衷於探索數據分析、自動化流程以及如何透過技術提升生活品質。這裡沒有複雜的裝飾，只有純粹的文字與想法。
            </p>
          </div>
        </section>

        <hr className="border-zinc-100 mb-16" />

        {/* 文章區塊 */}
        <section id="writing">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-8">
            Recent Writings
          </h2>
          
          <div className="grid gap-10">
            {articles.map((article, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                  <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <span className="text-sm text-zinc-400 tabular-nums">{article.date}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  {article.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 p-6 bg-zinc-50 rounded-2xl border border-zinc-100 text-center">
            <p className="text-sm text-zinc-500">更多想法正在醖釀中...</p>
          </div>
        </section>
      </main>

      <footer className="max-w-3xl mx-auto px-8 py-12 border-t border-zinc-50 text-xs text-zinc-400 flex justify-between">
        <span>© 2026 Michael. Built with Vibe.</span>
        <div className="flex gap-4">
          <span className="hover:text-zinc-600 cursor-pointer">Twitter</span>
          <span className="hover:text-zinc-600 cursor-pointer">GitHub</span>
        </div>
      </footer>
    </div>
  );
}