"use client"

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Code, Lightbulb, Users, Rocket } from 'lucide-react'

const highlights = [
  {
    icon: Code,
    title: "Full-Stack",
    description: "Modern web applications"
  },
  {
    icon: Lightbulb,
    title: "AI/ML",
    description: "Intelligent solutions"
  },
  {
    icon: Users,
    title: "Enterprise",
    description: "Mission-critical systems"
  },
  {
    icon: Rocket,
    title: "Performance",
    description: "Optimized solutions"
  }
]

export function AboutSection() {
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
    <section className="py-20 bg-muted/30">
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
            <Badge variant="outline" className="mb-4">About Me</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Building with{' '}
              <span className="text-gradient">Innovation</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Full-stack development, AI/ML, and scalable systems.
            </p>
          </motion.div>

          {/* Highlights Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {highlights.map((highlight, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-6 h-full glass hover:shadow-lg transition-all duration-300 group">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <highlight.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{highlight.title}</h3>
                  <p className="text-sm text-muted-foreground">{highlight.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
          >
            <motion.div variants={itemVariants}>
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">4+</div>
              <div className="text-sm text-muted-foreground">Major Projects</div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">4</div>
              <div className="text-sm text-muted-foreground">Internship Experiences</div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">3.6</div>
              <div className="text-sm text-muted-foreground">GPA at UMass Amherst</div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">AI Model Accuracy</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
