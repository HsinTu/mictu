import type { MetadataRoute } from 'next'
import { getAllStaticSlugs } from '@/lib/tutorial'
import { getAllPosts } from '@/lib/posts'

const SITE_URL = 'https://mictu.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/google-sheets-tutorial`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/tutorial`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  const tutorialSections: MetadataRoute.Sitemap = getAllStaticSlugs().map(slug => ({
    url: `${SITE_URL}/google-sheets-tutorial/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const posts: MetadataRoute.Sitemap = getAllPosts().map(post => ({
    url: `${SITE_URL}/posts/${encodeURIComponent(post.slug)}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...tutorialSections, ...posts]
}
