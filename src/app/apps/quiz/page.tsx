import { Metadata } from 'next'
import { QuizGameApp } from '@/components/apps/quiz/QuizGameApp'

export const metadata: Metadata = {
  title: 'Tech Quiz Game',
  description: 'Test your programming knowledge with interactive quizzes and timed challenges.',
}

export default function QuizPage() {
  return <QuizGameApp />
}
