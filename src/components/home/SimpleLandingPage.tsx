"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'

const roles = [
  "CS & Math Student",
  "Software Engineering Intern",
  "Full Stack Developer",
  "AI/ML Engineer",
  "Problem Solver"
]

export function SimpleLandingPage() {
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
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      rotate: [0, 180, 360],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.8, 0.3],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <section className="relative min-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-background">
      {/* Fast Short Diagonal Lines */}
      <div className="absolute inset-0">
        {/* Short diagonal dashed lines - all going top-left to bottom-right */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080" fill="none">
          {/* Line 1 */}
          <motion.line
            x1="100" y1="50" x2="400" y2="250"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="15,5"
            className="text-primary/70"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1], 
              opacity: [0, 1, 0] 
            }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut", repeatDelay: 2 }}
          />
          
          {/* Line 2 */}
          <motion.line
            x1="500" y1="100" x2="800" y2="300"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="12,4"
            className="text-foreground/50"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1], 
              opacity: [0, 0.8, 0] 
            }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeOut", delay: 0.5, repeatDelay: 2.5 }}
          />
          
          {/* Line 3 */}
          <motion.line
            x1="1200" y1="200" x2="1500" y2="400"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="10,6"
            className="text-primary/60"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1], 
              opacity: [0, 0.9, 0] 
            }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut", delay: 1, repeatDelay: 3 }}
          />
          
          {/* Line 4 */}
          <motion.line
            x1="200" y1="400" x2="500" y2="600"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="8,8"
            className="text-foreground/40"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1], 
              opacity: [0, 0.7, 0] 
            }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "easeOut", delay: 1.5, repeatDelay: 2.2 }}
          />
          
          {/* Line 5 */}
          <motion.line
            x1="1000" y1="500" x2="1300" y2="700"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="14,3"
            className="text-primary/50"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1], 
              opacity: [0, 0.8, 0] 
            }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeOut", delay: 2, repeatDelay: 2.8 }}
          />
          
          {/* Line 6 */}
          <motion.line
            x1="600" y1="700" x2="900" y2="900"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="11,7"
            className="text-foreground/60"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1], 
              opacity: [0, 0.9, 0] 
            }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut", delay: 0.8, repeatDelay: 3.2 }}
          />
        </svg>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] grid-pattern" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-5xl mx-auto"
        >
          {/* Main Content */}
          <motion.div variants={itemVariants} className="mb-6 mt-12">
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-foreground"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <span className="block mb-2">Rishik</span>
              <span className="text-gradient">
                Muthyala
              </span>
            </motion.h1>
          </motion.div>

          {/* Dynamic Role with enhanced animation */}
          <motion.div
            variants={itemVariants}
            className="mb-6 h-16"
          >
            <motion.h2 
              className="text-xl sm:text-2xl lg:text-3xl font-light text-muted-foreground"
              key={currentRole}
              initial={{ opacity: 0, y: 20, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20, rotateX: 90 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {roles[currentRole]}
            </motion.h2>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            CS & Math Student at UMass Amherst
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 px-8 py-3 text-lg group shadow-lg shadow-primary/25"
                asChild
              >
                <Link href="/apps">
                  Explore My Work
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-border/20 text-foreground hover:bg-accent/10 px-8 py-3 text-lg group"
                asChild
              >
                <Link href="/resume">
                  <Download className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  View Resume
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Social Links - Integrated */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center items-center gap-6 mt-8"
          >
            <motion.a
              href={SITE_CONFIG.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github className="w-6 h-6" />
            </motion.a>
            <motion.a
              href={SITE_CONFIG.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin className="w-6 h-6" />
            </motion.a>
            <motion.a
              href={`mailto:${SITE_CONFIG.social.email}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Mail className="w-6 h-6" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

    </section>
  )
}
