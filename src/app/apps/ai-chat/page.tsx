import { Metadata } from 'next'
import { AIChatApp } from '@/components/apps/ai-chat/AIChatApp'

export const metadata: Metadata = {
  title: 'AI Chat Assistant',
  description: 'Chat with an AI assistant trained on my experience, skills, and background.',
}

export default function AIChatPage() {
  return <AIChatApp />
}
