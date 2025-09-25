import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // In a real implementation, you would:
    // 1. Send email using a service like SendGrid, Resend, or Nodemailer
    // 2. Store in database
    // 3. Send confirmation email

    console.log('Contact form submission:', {
      name,
      email,
      subject: subject || 'No subject',
      message,
      timestamp: new Date().toISOString()
    })

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! I\'ll get back to you soon.'
    })

  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send message',
        message: 'Sorry, there was an error sending your message. Please try again or email me directly at rishikmuthyala05@gmail.com'
      },
      { status: 500 }
    )
  }
}
