"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Mail, MessageCircle, Calendar } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'


export function ContactCTASection() {
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
          className="max-w-4xl mx-auto"
        >
          {/* Main CTA Card */}
          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden glass p-8 lg:p-12 text-center">
              {/* Background Pattern */}
              <div className="absolute inset-0 gradient-bg opacity-5" />
              
              <div className="relative z-10">
                <motion.div
                  variants={itemVariants}
                  className="mb-6"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                    Let's Build Something{' '}
                    <span className="text-gradient">Amazing</span>
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Ready to bring your ideas to life? I'm always excited to work on new projects 
                    and collaborate with fellow innovators. Let's discuss how we can create 
                    something extraordinary together.
                  </p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
                >
                  <Button size="lg" className="group" asChild>
                    <Link href="/contact">
                      Get In Touch
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  
                  <Button size="lg" variant="outline" asChild>
                    <Link href={`mailto:${SITE_CONFIG.social.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </Link>
                  </Button>
                </motion.div>

                {/* Quick Contact Options */}
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
                >
                  <motion.div variants={itemVariants}>
                    <div className="text-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
                      <Mail className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-sm font-medium">Email</div>
                      <div className="text-xs text-muted-foreground">Quick Response</div>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <div className="text-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
                      <MessageCircle className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-sm font-medium">Contact Form</div>
                      <div className="text-xs text-muted-foreground">Detailed Inquiry</div>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <div className="text-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
                      <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-sm font-medium">Schedule Call</div>
                      <div className="text-xs text-muted-foreground">Direct Discussion</div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-8 text-sm text-muted-foreground"
          >
            <p>
              Available for freelance projects, consulting, and full-time opportunities. 
              Response time: Usually within 24 hours.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
