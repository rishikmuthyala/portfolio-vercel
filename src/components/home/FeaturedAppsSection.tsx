"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { MINI_APPS } from '@/lib/constants'

export function FeaturedAppsSection() {
  const featuredApps = MINI_APPS.filter(app => app.featured)

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

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Featured Projects</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Interactive{' '}
              <span className="text-gradient">Applications</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore a collection of mini-applications that demonstrate various skills and technologies. 
              Each app is built with modern tools and focuses on user experience.
            </p>
          </motion.div>

          {/* Featured Apps Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {featuredApps.map((app, index) => (
              <motion.div key={app.id} variants={itemVariants}>
                <Card className="h-full group hover:shadow-lg transition-all duration-300 cursor-pointer glass">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="text-4xl mb-3">{app.icon}</div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {app.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {app.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Link href={app.href}>
                      <Button variant="ghost" size="sm" className="w-full justify-between group-hover:bg-primary/10">
                        Try it out
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* View All Button */}
          <motion.div variants={itemVariants} className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/apps">
                View All Applications
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
