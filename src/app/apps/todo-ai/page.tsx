import { Metadata } from 'next'
import { TodoAIApp } from '@/components/apps/todo-ai/TodoAIApp'

export const metadata: Metadata = {
  title: 'AI-Powered Todo',
  description: 'Smart todo list with AI-powered task suggestions and productivity insights.',
}

export default function TodoAIPage() {
  return <TodoAIApp />
}
