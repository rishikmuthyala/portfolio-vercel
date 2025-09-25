import { Metadata } from 'next'
import { AppsShowcase } from '@/components/apps/AppsShowcase'

export const metadata: Metadata = {
  title: 'Interactive Applications',
  description: 'Explore a collection of interactive mini-applications showcasing various technologies and skills.',
}

export default function AppsPage() {
  return <AppsShowcase />
}
