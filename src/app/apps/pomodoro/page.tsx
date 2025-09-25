import { Metadata } from 'next'
import { PomodoroApp } from '@/components/apps/pomodoro/PomodoroApp'

export const metadata: Metadata = {
  title: 'Pomodoro Timer',
  description: 'Productivity timer with focus sessions, breaks, and detailed statistics tracking.',
}

export default function PomodoroPage() {
  return <PomodoroApp />
}
