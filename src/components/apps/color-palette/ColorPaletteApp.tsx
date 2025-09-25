"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Palette, 
  RefreshCw, 
  Copy, 
  Download, 
  Heart,
  Trash2,
  Eye,
  Lock,
  Unlock,
  Shuffle
} from 'lucide-react'
import { toast } from 'sonner'

interface Color {
  hex: string
  rgb: { r: number, g: number, b: number }
  hsl: { h: number, s: number, l: number }
  name: string
  locked: boolean
}

interface SavedPalette {
  id: string
  name: string
  colors: Color[]
  createdAt: Date
  liked: boolean
}

export function ColorPaletteApp() {
  const [currentPalette, setCurrentPalette] = useState<Color[]>([])
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([])
  const [paletteType, setPaletteType] = useState<'random' | 'complementary' | 'analogous' | 'triadic' | 'monochromatic'>('random')
  const [baseColor, setBaseColor] = useState('#3B82F6')

  useEffect(() => {
    generatePalette()
    loadSavedPalettes()
  }, [])

  const loadSavedPalettes = () => {
    const saved = localStorage.getItem('color-palettes')
    if (saved) {
      setSavedPalettes(JSON.parse(saved))
    }
  }

  const savePalettes = (palettes: SavedPalette[]) => {
    localStorage.setItem('color-palettes', JSON.stringify(palettes))
    setSavedPalettes(palettes)
  }

  const hexToRgb = (hex: string): { r: number, g: number, b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const rgbToHsl = (r: number, g: number, b: number): { h: number, s: number, l: number } => {
    r /= 255
    g /= 255
    b /= 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  const hslToHex = (h: number, s: number, l: number): string => {
    h /= 360
    s /= 100
    l /= 100

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    
    const r = Math.round(hue2rgb(p, q, h + 1/3) * 255)
    const g = Math.round(hue2rgb(p, q, h) * 255)
    const b = Math.round(hue2rgb(p, q, h - 1/3) * 255)

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  const getColorName = (hex: string): string => {
    const rgb = hexToRgb(hex)
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    
    // Simple color naming based on HSL values
    let name = ''
    
    if (hsl.s < 10) {
      if (hsl.l < 20) name = 'Black'
      else if (hsl.l < 40) name = 'Dark Gray'
      else if (hsl.l < 60) name = 'Gray'
      else if (hsl.l < 80) name = 'Light Gray'
      else name = 'White'
    } else {
      const hue = hsl.h
      if (hue < 15 || hue >= 345) name = 'Red'
      else if (hue < 45) name = 'Orange'
      else if (hue < 75) name = 'Yellow'
      else if (hue < 105) name = 'Yellow Green'
      else if (hue < 135) name = 'Green'
      else if (hue < 165) name = 'Blue Green'
      else if (hue < 195) name = 'Cyan'
      else if (hue < 225) name = 'Blue'
      else if (hue < 255) name = 'Blue Violet'
      else if (hue < 285) name = 'Violet'
      else if (hue < 315) name = 'Magenta'
      else name = 'Red Violet'
      
      if (hsl.l < 30) name = 'Dark ' + name
      else if (hsl.l > 70) name = 'Light ' + name
    }
    
    return name
  }

  const generateRandomColor = (): Color => {
    const hex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    const rgb = hexToRgb(hex)
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    
    return {
      hex,
      rgb,
      hsl,
      name: getColorName(hex),
      locked: false
    }
  }

  const generateComplementaryPalette = (base: string): Color[] => {
    const baseRgb = hexToRgb(base)
    const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b)
    
    const colors: Color[] = []
    
    // Base color
    colors.push({
      hex: base,
      rgb: baseRgb,
      hsl: baseHsl,
      name: getColorName(base),
      locked: false
    })
    
    // Complementary
    const compHue = (baseHsl.h + 180) % 360
    const compHex = hslToHex(compHue, baseHsl.s, baseHsl.l)
    colors.push({
      hex: compHex,
      rgb: hexToRgb(compHex),
      hsl: { h: compHue, s: baseHsl.s, l: baseHsl.l },
      name: getColorName(compHex),
      locked: false
    })
    
    // Add variations
    for (let i = 0; i < 3; i++) {
      const variation = hslToHex(
        baseHsl.h,
        Math.max(20, Math.min(100, baseHsl.s + (Math.random() - 0.5) * 40)),
        Math.max(20, Math.min(80, baseHsl.l + (Math.random() - 0.5) * 40))
      )
      colors.push({
        hex: variation,
        rgb: hexToRgb(variation),
        hsl: rgbToHsl(...Object.values(hexToRgb(variation))),
        name: getColorName(variation),
        locked: false
      })
    }
    
    return colors
  }

  const generateAnalogousPalette = (base: string): Color[] => {
    const baseRgb = hexToRgb(base)
    const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b)
    const colors: Color[] = []
    
    for (let i = -2; i <= 2; i++) {
      const hue = (baseHsl.h + i * 30 + 360) % 360
      const hex = hslToHex(hue, baseHsl.s, baseHsl.l)
      colors.push({
        hex,
        rgb: hexToRgb(hex),
        hsl: { h: hue, s: baseHsl.s, l: baseHsl.l },
        name: getColorName(hex),
        locked: false
      })
    }
    
    return colors
  }

  const generateTriadicPalette = (base: string): Color[] => {
    const baseRgb = hexToRgb(base)
    const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b)
    const colors: Color[] = []
    
    for (let i = 0; i < 3; i++) {
      const hue = (baseHsl.h + i * 120) % 360
      const hex = hslToHex(hue, baseHsl.s, baseHsl.l)
      colors.push({
        hex,
        rgb: hexToRgb(hex),
        hsl: { h: hue, s: baseHsl.s, l: baseHsl.l },
        name: getColorName(hex),
        locked: false
      })
    }
    
    // Add two more variations
    for (let i = 0; i < 2; i++) {
      const variation = hslToHex(
        baseHsl.h,
        Math.max(20, Math.min(100, baseHsl.s + (Math.random() - 0.5) * 30)),
        Math.max(20, Math.min(80, baseHsl.l + (Math.random() - 0.5) * 30))
      )
      colors.push({
        hex: variation,
        rgb: hexToRgb(variation),
        hsl: rgbToHsl(...Object.values(hexToRgb(variation))),
        name: getColorName(variation),
        locked: false
      })
    }
    
    return colors
  }

  const generateMonochromaticPalette = (base: string): Color[] => {
    const baseRgb = hexToRgb(base)
    const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b)
    const colors: Color[] = []
    
    const lightnesses = [20, 35, 50, 65, 80]
    
    lightnesses.forEach(lightness => {
      const hex = hslToHex(baseHsl.h, baseHsl.s, lightness)
      colors.push({
        hex,
        rgb: hexToRgb(hex),
        hsl: { h: baseHsl.h, s: baseHsl.s, l: lightness },
        name: getColorName(hex),
        locked: false
      })
    })
    
    return colors
  }

  const generatePalette = () => {
    let newPalette: Color[] = []
    
    switch (paletteType) {
      case 'complementary':
        newPalette = generateComplementaryPalette(baseColor)
        break
      case 'analogous':
        newPalette = generateAnalogousPalette(baseColor)
        break
      case 'triadic':
        newPalette = generateTriadicPalette(baseColor)
        break
      case 'monochromatic':
        newPalette = generateMonochromaticPalette(baseColor)
        break
      default:
        newPalette = Array.from({ length: 5 }, () => generateRandomColor())
    }
    
    // Preserve locked colors
    if (currentPalette.length > 0) {
      newPalette = newPalette.map((color, index) => {
        if (currentPalette[index]?.locked) {
          return currentPalette[index]
        }
        return color
      })
    }
    
    setCurrentPalette(newPalette)
  }

  const toggleColorLock = (index: number) => {
    setCurrentPalette(prev => prev.map((color, i) => 
      i === index ? { ...color, locked: !color.locked } : color
    ))
  }

  const copyColor = (color: Color) => {
    navigator.clipboard.writeText(color.hex)
    toast.success(`Copied ${color.hex} to clipboard!`)
  }

  const copyPalette = () => {
    const colors = currentPalette.map(c => c.hex).join(', ')
    navigator.clipboard.writeText(colors)
    toast.success('Palette colors copied to clipboard!')
  }

  const savePalette = () => {
    const name = prompt('Enter palette name:') || `Palette ${Date.now()}`
    const newPalette: SavedPalette = {
      id: Date.now().toString(),
      name,
      colors: [...currentPalette],
      createdAt: new Date(),
      liked: false
    }
    
    const updated = [...savedPalettes, newPalette]
    savePalettes(updated)
    toast.success('Palette saved!')
  }

  const loadPalette = (palette: SavedPalette) => {
    setCurrentPalette(palette.colors.map(c => ({ ...c, locked: false })))
    toast.success('Palette loaded!')
  }

  const deletePalette = (id: string) => {
    const updated = savedPalettes.filter(p => p.id !== id)
    savePalettes(updated)
    toast.success('Palette deleted!')
  }

  const togglePaletteLike = (id: string) => {
    const updated = savedPalettes.map(p => 
      p.id === id ? { ...p, liked: !p.liked } : p
    )
    savePalettes(updated)
  }

  const exportPalette = () => {
    const data = {
      name: `Palette ${Date.now()}`,
      colors: currentPalette.map(c => ({
        hex: c.hex,
        rgb: c.rgb,
        hsl: c.hsl,
        name: c.name
      }))
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'color-palette.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Palette exported!')
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge variant="outline" className="mb-4">
            <Palette className="w-4 h-4 mr-2" />
            Color Generator
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Color{' '}
            <span className="text-gradient">Palette Generator</span>
          </h1>
          <p className="text-muted-foreground">
            Generate beautiful color schemes with various algorithms and harmony rules
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2 items-center">
                  <select
                    value={paletteType}
                    onChange={(e) => setPaletteType(e.target.value as any)}
                    className="px-3 py-2 border rounded-md bg-background text-sm"
                  >
                    <option value="random">Random</option>
                    <option value="complementary">Complementary</option>
                    <option value="analogous">Analogous</option>
                    <option value="triadic">Triadic</option>
                    <option value="monochromatic">Monochromatic</option>
                  </select>
                  
                  {paletteType !== 'random' && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm">Base:</label>
                      <input
                        type="color"
                        value={baseColor}
                        onChange={(e) => setBaseColor(e.target.value)}
                        className="w-10 h-10 border rounded cursor-pointer"
                      />
                      <Input
                        value={baseColor}
                        onChange={(e) => setBaseColor(e.target.value)}
                        className="w-24 text-sm"
                        placeholder="#hex"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={generatePalette}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                  <Button variant="outline" onClick={copyPalette}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All
                  </Button>
                  <Button variant="outline" onClick={savePalette}>
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={exportPalette}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Palette */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle>Current Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <AnimatePresence>
                  {currentPalette.map((color, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="group relative"
                    >
                      <div
                        className="aspect-square rounded-lg cursor-pointer transition-transform hover:scale-105"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => copyColor(color)}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                          <Copy className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleColorLock(index)
                          }}
                        >
                          {color.locked ? (
                            <Lock className="w-4 h-4 text-white" />
                          ) : (
                            <Unlock className="w-4 h-4 text-white" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="mt-2 text-center">
                        <div className="font-mono text-sm font-medium">{color.hex}</div>
                        <div className="text-xs text-muted-foreground">{color.name}</div>
                        <div className="text-xs text-muted-foreground">
                          RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                        </div>
                        <div className="text-xs text-muted-foreground">
                          HSL({color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%)
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Saved Palettes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle>Saved Palettes ({savedPalettes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {savedPalettes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No saved palettes yet</p>
                  <p className="text-sm">Save your favorite color combinations to see them here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedPalettes.map((palette) => (
                    <div key={palette.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium truncate">{palette.name}</h3>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => togglePaletteLike(palette.id)}
                          >
                            <Heart className={`w-4 h-4 ${palette.liked ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => loadPalette(palette)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => deletePalette(palette.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 mb-2">
                        {palette.colors.map((color, index) => (
                          <div
                            key={index}
                            className="flex-1 h-8 rounded cursor-pointer"
                            style={{ backgroundColor: color.hex }}
                            onClick={() => copyColor(color)}
                            title={color.hex}
                          />
                        ))}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {palette.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
