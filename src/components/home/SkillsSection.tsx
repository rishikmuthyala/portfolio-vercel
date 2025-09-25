"use client"

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TECH_STACK } from '@/lib/constants'

const skillCategories = [
  {
    title: "Programming Languages",
    skills: [
      { name: "Python", level: 95 },
      { name: "JavaScript/TypeScript", level: 90 },
      { name: "Java", level: 85 },
      { name: "C++", level: 82 },
      { name: "Swift", level: 80 }
    ]
  },
  {
    title: "Frontend Development", 
    skills: [
      { name: "React/Next.js", level: 92 },
      { name: "SwiftUI", level: 85 },
      { name: "HTML/CSS", level: 88 },
      { name: "React Native", level: 80 }
    ]
  },
  {
    title: "Backend & Data",
    skills: [
      { name: "Node.js/Express", level: 88 },
      { name: "PostgreSQL/MongoDB", level: 85 },
      { name: "REST APIs", level: 90 },
      { name: "WebSocket", level: 82 },
      { name: "Redis/Elasticsearch", level: 78 }
    ]
  },
  {
    title: "AI/ML & Cloud",
    skills: [
      { name: "TensorFlow/PyTorch", level: 85 },
      { name: "XGBoost/LightGBM", level: 88 },
      { name: "AWS/Azure/GCP", level: 82 },
      { name: "OpenAI APIs", level: 90 },
      { name: "Docker", level: 80 }
    ]
  }
]

export function SkillsSection() {
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

  const progressVariants = {
    hidden: { width: 0 },
    visible: (level: number) => ({
      width: `${level}%`,
      transition: { duration: 1.5, ease: "easeOut" }
    })
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
            <Badge variant="outline" className="mb-4">Skills</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Technical{' '}
              <span className="text-gradient">Skills</span>
            </h2>
          </motion.div>

          {/* Skills Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          >
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                variants={itemVariants}
                className="glass rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold mb-6">{category.title}</h3>
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="relative">
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tech Stack Cloud */}
          <motion.div variants={itemVariants} className="text-center">
            <h3 className="text-2xl font-semibold mb-8">Technologies I Work With</h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {TECH_STACK.map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  viewport={{ once: true }}
                >
                  <Badge 
                    variant="secondary" 
                    className="text-sm py-2 px-4 hover:bg-primary/10 transition-colors cursor-default"
                  >
                    {tech}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
