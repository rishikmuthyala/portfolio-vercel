import { Metadata } from 'next'
import { MarkdownEditorApp } from '@/components/apps/markdown-editor/MarkdownEditorApp'

export const metadata: Metadata = {
  title: 'Markdown Editor',
  description: 'Live preview markdown editor with export options and syntax highlighting.',
}

export default function MarkdownEditorPage() {
  return <MarkdownEditorApp />
}
