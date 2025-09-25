import { Metadata } from 'next'
import { ImageOptimizerApp } from '@/components/apps/image-optimizer/ImageOptimizerApp'

export const metadata: Metadata = {
  title: 'Image Optimizer',
  description: 'Compress and resize images efficiently with customizable settings.',
}

export default function ImageOptimizerPage() {
  return <ImageOptimizerApp />
}
