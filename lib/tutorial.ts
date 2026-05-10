import fs from 'fs'
import path from 'path'

const tutorialDir = path.join(process.cwd(), 'content', 'google-sheets-tutorial')

export type Section = {
  slug: string
  title: string
  videoId: string | null
  order: number
}

export type Chapter = {
  slug: string
  title: string
  videoId: string | null
  sections: Section[]
  standalone?: boolean
  desc?: string
  exampleUrl?: string
  exampleTitle?: string
  doneUrl?: string
  doneTitle?: string
}

export type TutorialMeta = {
  chapters: Chapter[]
}

export function getTutorialMeta(): TutorialMeta {
  const raw = fs.readFileSync(path.join(tutorialDir, 'meta.json'), 'utf8')
  return JSON.parse(raw)
}

export function getAllSections(): Section[] {
  const meta = getTutorialMeta()
  return meta.chapters.filter(ch => !ch.standalone).flatMap(ch => ch.sections)
}

export function getAllStaticSlugs(): string[] {
  const meta = getTutorialMeta()
  const standalones = meta.chapters.filter(ch => ch.standalone).map(ch => ch.slug)
  const sections = getAllSections().map(s => s.slug)
  return [...standalones, ...sections]
}

export function getSectionContent(slug: string): string | null {
  const filePath = path.join(tutorialDir, `${slug}.html`)
  if (!fs.existsSync(filePath)) return null
  return fs.readFileSync(filePath, 'utf8')
}

export function getPrefaceContent(): string | null {
  return getSectionContent('preface')
}

export type FunctionEntry = {
  name: string
  slug: string
  section: string
}

export function getFunctionIndex(): FunctionEntry[] {
  const filePath = path.join(tutorialDir, 'function-index.json')
  if (!fs.existsSync(filePath)) return []
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw).functions
}

export function getSectionWithNeighbors(slug: string) {
  const meta = getTutorialMeta()

  // Handle standalone pages (preface, epilogue)
  const standaloneChapter = meta.chapters.find(ch => ch.standalone && ch.slug === slug)
  if (standaloneChapter) {
    const allSections = getAllSections()
    const isPreface = meta.chapters[0].slug === slug
    return {
      section: { slug, title: standaloneChapter.title, videoId: standaloneChapter.videoId, order: 0 },
      chapter: standaloneChapter,
      prev: isPreface ? null : allSections[allSections.length - 1],
      next: isPreface ? allSections[0] : null,
      content: getSectionContent(slug),
      standalone: true,
    }
  }

  const allSections = getAllSections()
  const idx = allSections.findIndex(s => s.slug === slug)
  if (idx === -1) return null

  const section = allSections[idx]
  const chapter = meta.chapters.find(ch => ch.sections.some(s => s.slug === slug))!

  // Check if prev/next should cross into standalone territory
  const epilogue = meta.chapters.find(ch => ch.standalone && ch.slug === 'epilogue')
  const isLast = idx === allSections.length - 1

  return {
    section,
    chapter,
    prev: idx > 0 ? allSections[idx - 1] : null,
    next: isLast && epilogue
      ? { slug: 'epilogue', title: epilogue.title, videoId: epilogue.videoId, order: 0 }
      : idx < allSections.length - 1 ? allSections[idx + 1] : null,
    content: getSectionContent(slug),
    standalone: false,
  }
}
