import { Metadata } from 'next'
import { LinkShortenerApp } from '@/components/apps/link-shortener/LinkShortenerApp'

export const metadata: Metadata = {
  title: 'Link Shortener',
  description: 'Shorten URLs and track analytics with this simple link shortener tool.',
}

export default function LinkShortenerPage() {
  return <LinkShortenerApp />
}
