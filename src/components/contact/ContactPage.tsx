"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  Github, 
  Linkedin, 
  Twitter,
  Calendar,
  MessageCircle,
  Coffee,
  Briefcase
} from 'lucide-react'
import { toast } from 'sonner'
import { SITE_CONFIG } from '@/lib/constants'

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  type: z.enum(['general', 'project', 'collaboration', 'job'])
})

type ContactFormData = z.infer<typeof contactFormSchema>

const contactInfo = {
  email: "rishikmuthyala05@gmail.com",
  phone: "(508) 244-2102",
  location: "Boston, MA",
  timezone: "EST (UTC-5)",
  availability: "Usually responds within 24 hours"
}

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    description: "Best for detailed inquiries",
    value: contactInfo.email,
    action: `mailto:${contactInfo.email}`,
    color: "text-blue-500"
  },
  {
    icon: MessageCircle,
    title: "Contact Form",
    description: "Quick and organized communication",
    value: "Fill out the form below",
    action: "#contact-form",
    color: "text-green-500"
  },
  {
    icon: Calendar,
    title: "Schedule a Call",
    description: "For complex discussions",
    value: "Book a 30-min slot",
    action: "https://cal.com/rishikmuthyala",
    color: "text-purple-500"
  }
]

const socialLinks = [
  {
    icon: Github,
    name: "GitHub",
    href: SITE_CONFIG.social.github,
    color: "hover:text-gray-900 dark:hover:text-white"
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    href: SITE_CONFIG.social.linkedin,
    color: "hover:text-blue-600"
  },
  {
    icon: Twitter,
    name: "Twitter",
    href: SITE_CONFIG.social.twitter,
    color: "hover:text-blue-400"
  }
]

const inquiryTypes = [
  { value: 'general', label: 'General Inquiry', icon: MessageCircle },
  { value: 'project', label: 'Project Collaboration', icon: Briefcase },
  { value: 'collaboration', label: 'Partnership', icon: Coffee },
  { value: 'job', label: 'Job Opportunity', icon: CheckCircle }
]

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      type: 'general'
    }
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        setIsSubmitted(true)
        toast.success('Message sent successfully! I\'ll get back to you soon.')
        form.reset()
      } else {
        throw new Error(result.message || 'Failed to send message')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 pt-4"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Let's{' '}
            <span className="text-gradient">Connect</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Let's discuss opportunities, collaborations, or technology.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Contact Methods */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Contact Methods</CardTitle>
                <CardDescription>
                  Choose the best way to reach me
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      if (method.action.startsWith('http')) {
                        window.open(method.action, '_blank')
                      } else if (method.action.startsWith('mailto')) {
                        window.location.href = method.action
                      } else {
                        document.querySelector(method.action)?.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                  >
                    <div className={`p-2 rounded-lg bg-muted ${method.color}`}>
                      <method.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{method.title}</h3>
                      <p className="text-xs text-muted-foreground mb-1">{method.description}</p>
                      <p className="text-xs font-medium">{method.value}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{contactInfo.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{contactInfo.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{contactInfo.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{contactInfo.timezone}</span>
                </div>
              </CardContent>
            </Card>

            {/* Social Links & Availability */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Connect on Social</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="icon"
                      className={`${social.color} transition-colors`}
                      asChild
                    >
                      <a href={social.href} target="_blank" rel="noopener noreferrer">
                        <social.icon className="w-4 h-4" />
                        <span className="sr-only">{social.name}</span>
                      </a>
                    </Button>
                  ))}
                </div>
                
                {/* Availability Status */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Available for new projects</p>
                    <p className="text-xs text-muted-foreground">{contactInfo.availability}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="glass" id="contact-form">
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>
                  Quick message form
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Message Sent Successfully!</h3>
                    <p className="text-muted-foreground mb-4">
                      Thank you for reaching out. I'll review your message and get back to you soon.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="your.email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Inquiry Type</FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {inquiryTypes.map((type) => (
                                  <Button
                                    key={type.value}
                                    type="button"
                                    variant={field.value === type.value ? "default" : "outline"}
                                    size="sm"
                                    className="justify-start text-sm py-2 px-3 h-auto"
                                    onClick={() => field.onChange(type.value)}
                                  >
                                    <type.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span className="truncate">{type.label}</span>
                                  </Button>
                                ))}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="What's this about?" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell me more about your project, idea, or how I can help..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Be as detailed as possible to help me understand your needs better.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="glass">
            <CardHeader className="text-center">
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">What's your typical response time?</h3>
                  <p className="text-sm text-muted-foreground">
                    I usually respond within 24 hours, often much sooner during business hours.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Are you looking for internship opportunities?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes! I'm actively seeking software engineering internships and full-time opportunities after graduation.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">What's your preferred communication method?</h3>
                  <p className="text-sm text-muted-foreground">
                    Email for detailed discussions, video calls for complex projects, and this form for initial contact.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Are you open to remote work?</h3>
                  <p className="text-sm text-muted-foreground">
                    Absolutely! I have extensive experience working with remote teams across different time zones.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
