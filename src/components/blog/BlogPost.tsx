"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Calendar, Clock, Share, Bookmark, User, Eye } from 'lucide-react'
import { toast } from 'sonner'

interface BlogPostProps {
  post: {
    slug: string
    title: string
    excerpt: string
    content: string
    publishedAt: string
    readTime: number
    tags: string[]
    author: string
  }
}

export function BlogPost({ post }: BlogPostProps) {
  const [views, setViews] = useState<number>(0)

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.location.href = '/blog'
  }

  useEffect(() => {
    // Track view when component mounts
    const trackView = async () => {
      try {
        const response = await fetch(`/api/blog/${post.slug}/view`, {
          method: 'POST',
        })
        const data = await response.json()
        if (data.success) {
          setViews(data.views)
        }
      } catch (error) {
        console.error('Failed to track view:', error)
        // Fallback to fetching current view count
        try {
          const response = await fetch(`/api/blog/${post.slug}/view`)
          const data = await response.json()
          setViews(data.views || 0)
        } catch (fetchError) {
          console.error('Failed to fetch view count:', fetchError)
          setViews(0)
        }
      }
    }

    trackView()
  }, [post.slug])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const savePost = () => {
    // In a real app, this would save to user's bookmarks
    toast.success('Post saved to bookmarks!')
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            href="/blog" 
            onClick={handleBackClick}
            className="inline-flex items-center gap-3 px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent/50 cursor-pointer border border-transparent hover:border-border/30"
            style={{ pointerEvents: 'auto', zIndex: 10, minWidth: '140px', minHeight: '44px' }}
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">Back to Blog</span>
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/avatar.jpg" alt={post.author} />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.publishedAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime} min read
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {views} views
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={sharePost}>
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={savePost}>
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass">
            <div className="prose prose-lg dark:prose-invert max-w-none p-8">
              {/* Simple markdown rendering - in a real app, use MDX or a proper markdown parser */}
              <div 
                className="space-y-6"
                dangerouslySetInnerHTML={{ 
                  __html: post.content
                    .split('\n\n')
                    .map(paragraph => {
                      if (paragraph.startsWith('# ')) {
                        return `<h1 class="text-3xl font-bold mb-4">${paragraph.slice(2)}</h1>`
                      } else if (paragraph.startsWith('## ')) {
                        return `<h2 class="text-2xl font-semibold mb-3 mt-8">${paragraph.slice(3)}</h2>`
                      } else if (paragraph.startsWith('### ')) {
                        return `<h3 class="text-xl font-semibold mb-2 mt-6">${paragraph.slice(4)}</h3>`
                      } else if (paragraph.startsWith('```')) {
                        return `<pre class="bg-muted p-4 rounded-lg overflow-x-auto"><code>${paragraph.slice(3, -3)}</code></pre>`
                      } else if (paragraph.startsWith('- ')) {
                        const items = paragraph.split('\n').map(item => 
                          item.startsWith('- ') ? `<li>${item.slice(2)}</li>` : item
                        ).join('')
                        return `<ul class="list-disc pl-6 space-y-1">${items}</ul>`
                      } else {
                        return `<p class="leading-relaxed">${paragraph}</p>`
                      }
                    })
                    .join('')
                }}
              />
            </div>
          </Card>
        </motion.div>

        {/* Related Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <Card className="glass">
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Enjoyed this article?</h3>
              <p className="text-muted-foreground mb-4">
                Check out more articles on web development and technology.
              </p>
              <Button asChild>
                <Link href="/blog">
                  View All Articles
                </Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
