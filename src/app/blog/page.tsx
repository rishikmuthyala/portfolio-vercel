import { Metadata } from 'next'
import { BlogList } from '@/components/blog/BlogList'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts, tutorials, and insights about web development, AI, and technology.',
}

export default function BlogPage() {
  return <BlogList />
}
