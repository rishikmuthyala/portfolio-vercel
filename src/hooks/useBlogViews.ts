import { useEffect, useState } from 'react'

interface BlogViewCounts {
  [slug: string]: number
}

export function useBlogViews(slugs: string[]) {
  const [viewCounts, setViewCounts] = useState<BlogViewCounts>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchViewCounts = async () => {
      try {
        const promises = slugs.map(async (slug) => {
          const response = await fetch(`/api/blog/${slug}/view`)
          const data = await response.json()
          return { slug, views: data.views || 0 }
        })

        const results = await Promise.all(promises)
        const counts = results.reduce((acc, { slug, views }) => {
          acc[slug] = views
          return acc
        }, {} as BlogViewCounts)

        setViewCounts(counts)
      } catch (error) {
        console.error('Failed to fetch view counts:', error)
        // Set all counts to 0 as fallback
        const fallbackCounts = slugs.reduce((acc, slug) => {
          acc[slug] = 0
          return acc
        }, {} as BlogViewCounts)
        setViewCounts(fallbackCounts)
      } finally {
        setLoading(false)
      }
    }

    if (slugs.length > 0) {
      fetchViewCounts()
    }
  }, [slugs])

  return { viewCounts, loading }
}
