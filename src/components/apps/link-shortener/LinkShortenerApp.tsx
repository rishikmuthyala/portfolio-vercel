"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Link2, Copy, ExternalLink, BarChart3, Eye, Calendar } from 'lucide-react'
import { toast } from 'sonner'

interface ShortenedLink {
  id: string
  originalUrl: string
  shortCode: string
  shortUrl: string
  clicks: number
  createdAt: Date
}

export function LinkShortenerApp() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [links, setLinks] = useState<ShortenedLink[]>([
    {
      id: '1',
      originalUrl: 'https://github.com/rishikmuthyala/portfolio',
      shortCode: 'abc123',
      shortUrl: 'https://rm.ly/abc123',
      clicks: 42,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      originalUrl: 'https://www.linkedin.com/in/rishik-muthyala',
      shortCode: 'def456',
      shortUrl: 'https://rm.ly/def456',
      clicks: 18,
      createdAt: new Date('2024-01-20')
    }
  ])

  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8)
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleShortenUrl = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL')
      return
    }

    if (!isValidUrl(url)) {
      toast.error('Please enter a valid URL')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const shortCode = generateShortCode()
      const newLink: ShortenedLink = {
        id: Date.now().toString(),
        originalUrl: url,
        shortCode,
        shortUrl: `https://rm.ly/${shortCode}`,
        clicks: 0,
        createdAt: new Date()
      }

      setLinks(prev => [newLink, ...prev])
      setUrl('')
      toast.success('URL shortened successfully!')
    } catch (error) {
      toast.error('Failed to shorten URL')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge variant="outline" className="mb-4">
            <Link2 className="w-4 h-4 mr-2" />
            URL Shortener
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Link{' '}
            <span className="text-gradient">Shortener</span>
          </h1>
          <p className="text-muted-foreground">
            Shorten your URLs and track their performance with detailed analytics
          </p>
        </motion.div>

        <Tabs defaultValue="shorten" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shorten">Shorten URL</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="shorten" className="space-y-6">
            {/* URL Shortener */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Shorten a URL</CardTitle>
                <CardDescription>
                  Enter a long URL to get a shortened version with tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/very/long/url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleShortenUrl()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleShortenUrl}
                    disabled={isLoading || !url.trim()}
                    className="min-w-[100px]"
                  >
                    {isLoading ? 'Shortening...' : 'Shorten'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Links */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Your Shortened Links</CardTitle>
                <CardDescription>
                  Recent links you've created
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {links.map((link) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-primary">
                              {link.shortUrl}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(link.shortUrl)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => window.open(link.originalUrl, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {link.originalUrl}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {link.clicks} clicks
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {link.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {links.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Link2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No links shortened yet</p>
                      <p className="text-sm">Create your first shortened link above</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="glass">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{links.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Links created
                  </p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalClicks}</div>
                  <p className="text-xs text-muted-foreground">
                    All-time clicks
                  </p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average CTR</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {links.length > 0 ? Math.round(totalClicks / links.length) : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Clicks per link
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Links */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Top Performing Links</CardTitle>
                <CardDescription>
                  Your most clicked shortened links
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {links
                    .sort((a, b) => b.clicks - a.clicks)
                    .slice(0, 5)
                    .map((link, index) => (
                      <div key={link.id} className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{link.shortUrl}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {link.originalUrl}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <BarChart3 className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{link.clicks}</span>
                        </div>
                      </div>
                    ))}
                  
                  {links.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No analytics data yet</p>
                      <p className="text-sm">Create some links to see analytics</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
