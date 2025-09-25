"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Download, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'

const roles = [
  "CS & Math Student",
  "Full Stack Developer",
  "AI/ML Engineer", 
  "Software Engineering Intern",
  "Problem Solver"
]

export function HeroSection() {
  const [currentRole, setCurrentRole] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-bg opacity-5" />
      
      {/* Floating Elements */}
      <motion.div 
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"
      />
      <motion.div 
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '1s' }}
        className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
      />
      <motion.div 
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: '2s' }}
        className="absolute bottom-40 left-20 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Greeting */}
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border">
              <Sparkles className="w-4 h-4 text-primary" />
              Welcome to my digital space
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6"
          >
            Hi, I'm{' '}
            <span className="text-gradient">
              {SITE_CONFIG.name}
            </span>
          </motion.h1>

          {/* Dynamic Role */}
          <motion.div
            variants={itemVariants}
            className="mb-8 h-16 sm:h-20"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-muted-foreground">
              I'm a{' '}
              <motion.span
                key={currentRole}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-gradient font-semibold inline-block"
              >
                {roles[currentRole]}
              </motion.span>
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Computer Science & Mathematics student at UMass Amherst with experience at 
            MITRE Corporation, Treevah, and SellServe. I build scalable systems, integrate 
            AI/ML technologies, and create innovative solutions for complex problems.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" className="group" asChild>
              <Link href="/apps">
                Explore My Work
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" className="group" asChild>
              <Link href="/resume">
                <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                View Resume
              </Link>
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={itemVariants}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
