import { Metadata } from 'next'
import { ColorPaletteApp } from '@/components/apps/color-palette/ColorPaletteApp'

export const metadata: Metadata = {
  title: 'Color Palette Generator',
  description: 'Generate beautiful color schemes and palettes with various algorithms and export options.',
}

export default function ColorPalettePage() {
  return <ColorPaletteApp />
}
