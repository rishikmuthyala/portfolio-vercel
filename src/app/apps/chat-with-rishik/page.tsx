import { Metadata } from 'next'
import { ChatWithRishikApp } from '@/components/apps/chat-with-rishik/ChatWithRishikApp'

export const metadata: Metadata = {
  title: 'Chat with Rishik',
  description: 'Have a conversation with Rishik\'s AI assistant about his experience, projects, and expertise.',
}

export default function ChatWithRishikPage() {
  return <ChatWithRishikApp />
}
