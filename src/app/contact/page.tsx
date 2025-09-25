import { Metadata } from 'next'
import { ContactPage } from '@/components/contact/ContactPage'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with me for collaborations, opportunities, or just to say hello.',
}

export default function Contact() {
  return <ContactPage />
}
