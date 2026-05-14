import { MetadataRoute } from 'next'
import { prisma } from '@lex/database'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lexplatform.com'

  // Fetch dynamic routes
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  })

  const practiceAreas = await prisma.practiceArea.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  })

  // Map dynamic routes
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const practiceAreaUrls = practiceAreas.map((area) => ({
    url: `${baseUrl}/practice-areas/${area.slug}`,
    lastModified: area.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  // Static routes
  const staticRoutes = ['', '/blog', '/practice-areas', '/team', '/resources'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [...staticRoutes, ...practiceAreaUrls, ...postUrls]
}
