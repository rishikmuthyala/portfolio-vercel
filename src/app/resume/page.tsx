import { Metadata } from 'next'
import { ResumeShowcase } from '@/components/resume/ResumeShowcase'

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Interactive resume showcasing experience, skills, education, and achievements.',
}

export default function ResumePage() {
  return <ResumeShowcase />
}
