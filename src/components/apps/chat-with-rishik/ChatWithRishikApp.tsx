"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Copy, 
  Download,
  MessageCircle,
  Brain,
  Code,
  Briefcase,
  GraduationCap,
  Heart,
  Coffee,
  Lightbulb,
  Rocket
} from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  category?: string
}

interface ChatStats {
  totalMessages: number
  conversationLength: number
  topicsDiscussed: string[]
  averageResponseTime: number
}

const conversationStarters = [
  {
    category: "Experience",
    icon: Briefcase,
    color: "text-blue-500",
    questions: [
      "Tell me about your professional experience",
      "What's your current role and responsibilities?",
      "What projects are you most proud of?",
      "How did you get started in tech?"
    ]
  },
  {
    category: "Skills",
    icon: Code,
    color: "text-green-500",
    questions: [
      "What technologies do you specialize in?",
      "How proficient are you with React and Next.js?",
      "Tell me about your AI/ML experience",
      "What's your approach to full-stack development?"
    ]
  },
  {
    category: "Education",
    icon: GraduationCap,
    color: "text-purple-500",
    questions: [
      "What's your educational background?",
      "How do you stay updated with technology?",
      "What courses or resources do you recommend?",
      "What programming languages do you know?"
    ]
  },
  {
    category: "Personal",
    icon: Heart,
    color: "text-red-500",
    questions: [
      "What motivates you as a developer?",
      "What are your hobbies outside of coding?",
      "What's your ideal work environment?",
      "Any advice for aspiring developers?"
    ]
  }
]

const quickReplies = [
  "Tell me more",
  "That's interesting!",
  "Can you give an example?",
  "What technologies were involved?",
  "How did you solve that challenge?",
  "What did you learn from that?"
]

export function ChatWithRishikApp() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey there! 👋 I'm Rishik's AI assistant, trained on his experience, projects, and expertise. I'm here to answer any questions you have about his background, skills, or work. What would you like to know?",
      timestamp: new Date(),
      category: "greeting"
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showStarters, setShowStarters] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sessionId = useRef(Date.now().toString())

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string, category?: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
      category
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setShowStarters(false)

    try {
      console.log('Sending message to /api/chat:', content)
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          sessionId: sessionId.current
        })
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Response data:', data)

      if (data.success && data.response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          category
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || 'No response received from API')
      }
    } catch (error) {
      console.error('Chat error details:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again later, or feel free to contact Rishik directly through the contact form!",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      toast.error('Failed to get response')
    } finally {
      setIsLoading(false)
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Message copied to clipboard!')
  }

  const exportChat = () => {
    const chatText = messages.map(msg => 
      `${msg.role === 'user' ? 'You' : 'Rishik\'s AI Assistant'} (${msg.timestamp.toLocaleTimeString()}):\n${msg.content}\n`
    ).join('\n')
    
    const blob = new Blob([chatText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'chat-with-rishik.txt'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Chat conversation exported!')
  }

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: "Chat cleared! I'm still here to answer any questions about Rishik's experience and expertise. What would you like to know?",
      timestamp: new Date()
    }])
    setShowStarters(true)
    toast.success('Chat cleared!')
  }

  const calculateStats = (): ChatStats => {
    const totalMessages = messages.length
    const conversationLength = messages.length > 1 
      ? (messages[messages.length - 1].timestamp.getTime() - messages[0].timestamp.getTime()) / 1000 / 60
      : 0
    
    const topicsDiscussed = [...new Set(messages.filter(m => m.category).map(m => m.category!))]
    
    // Simulate response time calculation
    const averageResponseTime = 1.2 // seconds
    
    return {
      totalMessages,
      conversationLength,
      topicsDiscussed,
      averageResponseTime
    }
  }

  const stats = calculateStats()

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge variant="outline" className="mb-4">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat with Rishik
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Chat with{' '}
            <span className="text-gradient">Rishik's AI</span>
          </h1>
          <p className="text-muted-foreground">
            Have a conversation about Rishik's experience, projects, and expertise
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Conversation Starters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {showStarters && (
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Conversation Starters</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="Experience" orientation="vertical">
                    <TabsList className="grid w-full grid-cols-1 h-auto">
                      {conversationStarters.map((starter) => (
                        <TabsTrigger 
                          key={starter.category} 
                          value={starter.category}
                          className="justify-start"
                        >
                          <starter.icon className={`w-4 h-4 mr-2 ${starter.color}`} />
                          {starter.category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {conversationStarters.map((starter) => (
                      <TabsContent key={starter.category} value={starter.category} className="mt-4">
                        <div className="space-y-2">
                          {starter.questions.map((question, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-left h-auto p-3 text-xs"
                              onClick={() => sendMessage(question, starter.category.toLowerCase())}
                            >
                              <Sparkles className="w-3 h-3 mr-2 flex-shrink-0" />
                              <span className="line-clamp-2">{question}</span>
                            </Button>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Chat Stats */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Chat Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Messages</span>
                  <span className="font-medium">{stats.totalMessages}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duration</span>
                  <span className="font-medium">{Math.round(stats.conversationLength)}min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Topics</span>
                  <span className="font-medium">{stats.topicsDiscussed.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Response</span>
                  <span className="font-medium">{stats.averageResponseTime}s</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Chat Interface */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass h-[700px] flex flex-col">
                {/* Chat Header */}
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/rishik-avatar.jpg" alt="Rishik Muthyala" />
                        <AvatarFallback className="bg-primary/10">
                          <User className="w-4 h-4 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">Rishik's AI Assistant</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>Online • Trained on Rishik's experience</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={exportChat}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearChat}>
                        Clear
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-hidden">
                  <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                      <AnimatePresence>
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            {message.role === 'assistant' && (
                              <Avatar className="w-8 h-8">
                                <AvatarImage src="/rishik-avatar.jpg" alt="Rishik" />
                                <AvatarFallback className="bg-primary/10">
                                  <Bot className="w-4 h-4 text-primary" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div className={`max-w-[85%] group ${message.role === 'user' ? 'order-first' : ''}`}>
                              <div
                                className={`p-4 rounded-lg ${
                                  message.role === 'user'
                                    ? 'bg-primary text-primary-foreground ml-auto'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                  {message.content}
                                </p>
                                {message.category && (
                                  <Badge variant="secondary" className="mt-2 text-xs">
                                    {message.category}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-muted-foreground">
                                  {message.timestamp.toLocaleTimeString()}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => copyMessage(message.content)}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            {message.role === 'user' && (
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-secondary">
                                  <User className="w-4 h-4" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-3"
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/10">
                              <Bot className="w-4 h-4 text-primary" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-muted p-4 rounded-lg">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Replies */}
                    {!showStarters && messages.length > 1 && (
                      <div className="mt-4 mb-4">
                        <div className="flex flex-wrap gap-2">
                          {quickReplies.map((reply, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => sendMessage(reply)}
                              disabled={isLoading}
                            >
                              {reply}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Input */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Input
                        placeholder="Ask me anything about Rishik's experience, skills, or projects..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage(input)
                          }
                        }}
                        disabled={isLoading}
                        className="flex-1"
                      />
                      <Button 
                        onClick={() => sendMessage(input)}
                        disabled={isLoading || !input.trim()}
                        size="sm"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Features Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <Brain className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <h3 className="font-medium mb-1">Intelligent Responses</h3>
                  <p className="text-sm text-muted-foreground">
                    Trained on Rishik's complete professional background and expertise
                  </p>
                </div>
                <div>
                  <Rocket className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <h3 className="font-medium mb-1">Real-time Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant responses with conversation context and memory
                  </p>
                </div>
                <div>
                  <Lightbulb className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <h3 className="font-medium mb-1">Smart Suggestions</h3>
                  <p className="text-sm text-muted-foreground">
                    Context-aware question suggestions and quick replies
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
