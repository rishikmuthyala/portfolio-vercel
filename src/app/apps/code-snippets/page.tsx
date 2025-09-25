import { Metadata } from 'next'
import { CodeSnippetsApp } from '@/components/apps/code-snippets/CodeSnippetsApp'

export const metadata: Metadata = {
  title: 'Code Snippet Manager',
  description: 'Save, organize, and share code snippets with syntax highlighting.',
}

export default function CodeSnippetsPage() {
  return <CodeSnippetsApp />
}
