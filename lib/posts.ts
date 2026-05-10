import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

const contentDir = path.join(process.cwd(), 'content')

export type Post = {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  category: string
  readingTime: number
  content?: string
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(contentDir)) return []

  return fs.readdirSync(contentDir)
    .filter(fn => fn.endsWith('.md'))
    .map(filename => {
      const slug = filename.replace(/\.md$/, '')
      const { data, content } = matter(fs.readFileSync(path.join(contentDir, filename), 'utf8'))
      const wordCount = content.trim().split(/\s+/).length

      return {
        slug,
        title: data.title || '無標題',
        date: data.date ? String(data.date) : '2026-01-01',
        description: data.description || '',
        tags: data.tags || [],
        category: data.category || '隨筆',
        readingTime: Math.max(1, Math.ceil(wordCount / 300)),
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(contentDir, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const { data, content } = matter(fs.readFileSync(filePath, 'utf8'))
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content)
  const wordCount = content.trim().split(/\s+/).length

  return {
    slug,
    title: data.title || '無標題',
    date: data.date ? String(data.date) : '2026-01-01',
    description: data.description || '',
    tags: data.tags || [],
    category: data.category || '隨筆',
    readingTime: Math.max(1, Math.ceil(wordCount / 300)),
    content: processed.toString(),
  }
}
