import { Metadata } from 'next'
import { RegexTesterApp } from '@/components/apps/regex-tester/RegexTesterApp'

export const metadata: Metadata = {
  title: 'Regex Tester',
  description: 'Test regular expressions with live matching, explanations, and common patterns.',
}

export default function RegexTesterPage() {
  return <RegexTesterApp />
}
