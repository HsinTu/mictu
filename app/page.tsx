import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function Home() {
  // --- 核心邏輯：從 content 資料夾抓取真正文章 ---
  const contentDirectory = path.join(process.cwd(), 'content');
  
  // 檢查資料夾是否存在，避免報錯
  let articles = [];
  if (fs.existsSync(contentDirectory)) {
    const filenames = fs.readdirSync(contentDirectory);
    articles = filenames
      .filter(fn => fn.endsWith('.md')) // 只讀取 .md 檔
      .map((filename) => {
        const filePath = path.join(contentDirectory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        return {
          title: data.title || "無標題",
          date: data.date || "2026-01-01",
          tags: data.tags || [],
          description: data.description || ""
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  return (
    <div className="min-h-screen bg-white text-[#37352f] font-sans selection:bg-[#ebeced]">
      {/* 導覽列 */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-zinc-50">
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
        {/* 自我介紹 */}
        <section id="about" className="mb-20">
          <h1 className="text-4xl font-bold mb-8 tracking-tight">你好，我是 Michael</h1>
          <div className="prose prose-zinc leading-relaxed text-[16px] space-y-4 text-zinc-600">
            <p>這是我存放文章、隨筆與深度思考的數位空間。</p>
            <p>目前我正在建立我的自動化工作流，將思考碎片轉化為有系統的內容。</p>
          </div>
        </section>

        <hr className="border-zinc-100 mb-16" />

        {/* 文章區塊 */}
        <section id="writing">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-8">
            Recent Writings
          </h2>
          
          <div className="grid gap-10">
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                    <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <span className="text-sm text-zinc-400 tabular-nums">{article.date}</span>
                  </div>
                  {article.description && (
                    <p className="text-sm text-zinc-500 mt-2">{article.description}</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    {article.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-400 italic">目前還沒有文章，趕快在 content 資料夾新增一個 .md 檔吧！</p>
            )}
          </div>
        </section>
      </main>

      <footer className="max-w-3xl mx-auto px-8 py-12 border-t border-zinc-50 text-xs text-zinc-400 flex justify-between">