import { Metadata } from 'next'
import { PasswordGeneratorApp } from '@/components/apps/password-generator/PasswordGeneratorApp'

export const metadata: Metadata = {
  title: 'Password Generator',
  description: 'Generate secure passwords with customizable options and strength analysis.',
}

export default function PasswordGeneratorPage() {
  return <PasswordGeneratorApp />
}
