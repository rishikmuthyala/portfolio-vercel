import { Metadata } from 'next'
import { APITesterApp } from '@/components/apps/api-tester/APITesterApp'

export const metadata: Metadata = {
  title: 'API Tester',
  description: 'Test REST APIs with a Postman-like interface and response analysis.',
}

export default function APITesterPage() {
  return <APITesterApp />
}
