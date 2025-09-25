"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Bot, 
  User,
  Sparkles
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  "What's your experience with React?",
  "Tell me about your AI projects",
  "What technologies do you use?",
  "Can you share your background?"
]

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm Rishik's AI assistant. Feel free to ask me anything about his experience, skills, or projects. How can I help you today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sessionId = useRef(Date.now().toString())

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom()
    }
  }, [messages, isOpen, isMinimized])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
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

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again later.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              size="lg"
              className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => setIsOpen(true)}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="sr-only">Open chat</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 100 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]"
          >
            <Card className="shadow-2xl border-2 glass">
              {/* Header */}
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    AI Assistant
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setIsMinimized(!isMinimized)}
                    >
                      <Minimize2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Chat Content */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <CardContent className="pt-0">
                      {/* Messages */}
                      <div className="h-80 overflow-y-auto mb-4 space-y-3 pr-2">
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            {message.role === 'assistant' && (
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="bg-primary/10 text-xs">
                                  <Bot className="w-3 h-3 text-primary" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                              <div
                                className={`p-2 rounded-lg text-sm ${
                                  message.role === 'user'
                                    ? 'bg-primary text-primary-foreground ml-auto'
                                    : 'bg-muted'
                                }`}
                              >
                                {message.content}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 px-2">
                                {message.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </div>

                            {message.role === 'user' && (
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="bg-secondary text-xs">
                                  <User className="w-3 h-3" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </motion.div>
                        ))}

                        {isLoading && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-2"
                          >
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="bg-primary/10 text-xs">
                                <Bot className="w-3 h-3 text-primary" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-muted p-2 rounded-lg">
                              <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                      </div>

                      {/* Suggested Questions */}
                      {messages.length === 1 && (
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
                          <div className="flex flex-wrap gap-1">
                            {suggestedQuestions.map((question, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs h-6 px-2"
                                onClick={() => sendMessage(question)}
                                disabled={isLoading}
                              >
                                <Sparkles className="w-2 h-2 mr-1" />
                                {question}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Input */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Ask me anything..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              sendMessage(input)
                            }
                          }}
                          disabled={isLoading}
                          className="text-sm"
                        />
                        <Button 
                          size="sm"
                          onClick={() => sendMessage(input)}
                          disabled={isLoading || !input.trim()}
                          className="px-3"
                        >
                          <Send className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
