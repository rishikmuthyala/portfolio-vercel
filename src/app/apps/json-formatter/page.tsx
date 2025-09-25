import { Metadata } from 'next'
import { JSONFormatterApp } from '@/components/apps/json-formatter/JSONFormatterApp'

export const metadata: Metadata = {
  title: 'JSON Formatter',
  description: 'Format, validate, and beautify JSON data with syntax highlighting and error detection.',
}

export default function JSONFormatterPage() {
  return <JSONFormatterApp />
}
