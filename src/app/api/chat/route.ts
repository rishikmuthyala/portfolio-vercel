import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// Fallback responses when no API key
const generateSimulatedResponse = (message: string): string => {
  const responses = [
    "Thanks for your message! I'm currently in demo mode. In a full deployment, I'd use GPT to provide intelligent responses about Rishik's experience and projects.",
    "That's a great question! With a proper OpenAI API key, I could give you detailed insights about Rishik's background in CS, Math, and software engineering.",
    "I appreciate your interest! This chatbot would normally use AI to discuss Rishik's internships at MITRE, Treevah, and other experiences.",
    "Interesting point! In production, I'd leverage GPT to talk about Rishik's projects, skills, and academic achievements at UMass Amherst."
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

export async function POST(request: NextRequest) {
  try {
    console.log('Chat API called')
    const body = await request.json()
    console.log('Request body:', body)
    
    const { message } = body

    if (!message) {
      console.log('No message provided')
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    console.log('Processing message:', message)
    console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY)
    
    let aiResponse: string

    if (process.env.OPENAI_API_KEY) {
      // Use real OpenAI API
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant representing Rishik Muthyala, a CS & Math student at UMass Amherst. 
            
            Key information about Rishik:
            - CS & Math double major at UMass Amherst (2023-2027)
            - Software Engineering Intern with experience at MITRE Corporation, Treevah, SellServe, and Columbia University
            - Skills: Full-stack development, AI/ML, React, Next.js, Python, TypeScript
            - Projects: Campus Chirp, FoundU, AI-powered phishing detection, Dorm Buddy
            - Interests: Building scalable applications, cybersecurity, machine learning
            
            Respond as if you're representing Rishik professionally but conversationally. Keep responses concise and relevant.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      })

      aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."
      console.log('OpenAI response:', aiResponse)
    } else {
      // Fallback to simulated responses for development
      console.log('Using fallback response')
      aiResponse = generateSimulatedResponse(message)
    }

    console.log('Sending response:', aiResponse)
    
    return NextResponse.json({
      success: true,
      response: aiResponse
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        response: generateSimulatedResponse("Sorry, I encountered an error. Please try again!")
      },
      { status: 500 }
    )
  }
}
