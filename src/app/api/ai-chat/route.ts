import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('AI Chat API called with body:', JSON.stringify(body, null, 2))
    
    // Handle both formats: { messages: [...] } and { message: "...", conversationHistory: [...] }
    let conversationMessages: any[] = []
    let currentMessage: string = ''
    
    if (body.messages && Array.isArray(body.messages)) {
      // Format from TechBot app: { messages: [{role, content}...] }
      conversationMessages = body.messages
      const lastUserMessage = body.messages.filter((m: any) => m.role === 'user').pop()
      currentMessage = lastUserMessage?.content || ''
      console.log('Using messages array format, last message:', currentMessage)
    } else if (body.message) {
      // Format from other chat components: { message: "...", conversationHistory: [...] }
      currentMessage = body.message
      conversationMessages = body.conversationHistory || []
      console.log('Using single message format:', currentMessage)
    }

    if (!currentMessage) {
      return NextResponse.json(
        { error: 'No message content found' },
        { status: 400 }
      )
    }

    console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY)
    console.log('Processing message:', currentMessage)

    let aiResponse: string

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
      try {
        // Build conversation context
        const messages = [
          {
            role: 'system' as const,
            content: `You are a helpful AI assistant. You can discuss any topic and provide helpful, accurate, and engaging responses. Keep your responses conversational and informative.`
          }
        ]

        // Add conversation history
        if (conversationMessages.length > 0) {
          // If we already have formatted messages, use them
          if (body.messages) {
            messages.push(...conversationMessages.slice(-10))
          } else {
            // Otherwise add the conversation history and current message
            messages.push(...conversationMessages.slice(-10))
            messages.push({
              role: 'user' as const,
              content: currentMessage
            })
          }
        } else {
          // No history, just add current message
          messages.push({
            role: 'user' as const,
            content: currentMessage
          })
        }

        console.log('Calling OpenAI API...')
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
        })

        aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."
        console.log('OpenAI response received:', aiResponse.substring(0, 100) + '...')
        
      } catch (openaiError) {
        console.error('OpenAI API Error:', openaiError)
        aiResponse = `I'm experiencing some technical difficulties with my AI service. This might be due to API limits or configuration issues. Please try again later or contact support.`
      }
    } else {
      console.log('Using fallback response - no valid OpenAI API key')
      // Fallback responses
      const responses = [
        "I'm currently running in demo mode. To enable full AI capabilities, please configure a valid OpenAI API key.",
        "Thanks for your message! I'd love to chat, but I need an OpenAI API key to provide intelligent responses.",
        "I'm here to help! However, I'm currently in demonstration mode without access to AI services.",
        "Hello! I'm an AI assistant, but I'm currently running without my full capabilities. Please check the API configuration."
      ]
      aiResponse = responses[Math.floor(Math.random() * responses.length)]
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI Chat API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        response: "Sorry, I encountered an unexpected error. Please try again!"
      },
      { status: 500 }
    )
  }
}
