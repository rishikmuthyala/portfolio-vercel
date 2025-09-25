"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Calendar, Clock, ArrowRight, BookOpen, Tag, Eye } from 'lucide-react'
import { useBlogViews } from '@/hooks/useBlogViews'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  publishedAt: string
  readTime: number
  tags: string[]
  featured: boolean
  views: number
}

// Sample blog posts data
const blogPosts: BlogPost[] = [
  {
    slug: 'building-scalable-nextjs-apps-2024',
    title: 'Building Scalable Next.js Applications in 2024',
    excerpt: 'A deep dive into modern Next.js architecture patterns, performance optimizations, and best practices for building production-ready applications that scale.',
    content: 'Full content would be loaded from MDX files...',
    publishedAt: '2024-09-20',
    readTime: 12,
    tags: ['Next.js', 'React', 'Architecture', 'Performance'],
    featured: true,
    views: 0
  },
  {
    slug: 'cybersecurity-ai-implementation-guide',
    title: 'Cybersecurity and AI Implementation: A Developer\'s Guide',
    excerpt: 'Exploring how AI is revolutionizing cybersecurity practices, from threat detection to automated response systems, and how developers can implement these solutions.',
    content: 'Full content would be loaded from MDX files...',
    publishedAt: '2024-09-15',
    readTime: 15,
    tags: ['Cybersecurity', 'AI', 'Machine Learning', 'Security'],
    featured: true,
    views: 0
  }
]

const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags))).sort()

export function BlogList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  
  // Fetch real view counts from the database
  const { viewCounts, loading: viewsLoading } = useBlogViews(blogPosts.map(post => post.slug))

  const filteredPosts = useMemo(() => {
    let filtered = blogPosts

    // Filter by tab
    if (activeTab === 'featured') {
      filtered = filtered.filter(post => post.featured)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by selected tag
    if (selectedTag) {
      filtered = filtered.filter(post => post.tags.includes(selectedTag))
    }

    return filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }, [searchQuery, selectedTag, activeTab])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">
            <BookOpen className="w-4 h-4 mr-2" />
            Blog & Insights
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Tech{' '}
            <span className="text-gradient">Blog</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Thoughts, tutorials, and insights about web development, AI, and the latest 
            technologies. Sharing knowledge and experiences from my journey as a developer.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Tags Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(null)}
            >
              All Topics
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredPosts.map((post) => (
            <motion.div key={post.slug} variants={itemVariants}>
              <Card className="h-full group hover:shadow-lg transition-all duration-300 cursor-pointer glass">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.publishedAt)}
                    </div>
                    {post.featured && (
                      <Badge variant="secondary" className="text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime} min read
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {viewsLoading ? '...' : (viewCounts[post.slug] || 0)} views
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <Button variant="ghost" size="sm" className="w-full justify-between group-hover:bg-primary/10" asChild>
                    <Link href={`/blog/${post.slug}`}>
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={() => {
              setSearchQuery('')
              setSelectedTag(null)
              setActiveTab('all')
            }}>
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Blog Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">{blogPosts.length}</div>
              <div className="text-sm text-muted-foreground">Articles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {blogPosts.filter(post => post.featured).length}
              </div>
              <div className="text-sm text-muted-foreground">Featured</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">{allTags.length}</div>
              <div className="text-sm text-muted-foreground">Topics</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {viewsLoading ? '...' : Object.values(viewCounts).reduce((sum, views) => sum + views, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </div>
          </div>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <Card className="glass text-center">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-muted-foreground mb-4">
                Get notified when I publish new articles about web development and technology.
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button>Subscribe</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                No spam, unsubscribe anytime.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
