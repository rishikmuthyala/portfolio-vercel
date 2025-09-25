"use client"

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { 
  Image as ImageIcon, 
  Upload, 
  Download, 
  Trash2,
  Maximize2,
  Minimize2,
  RotateCcw,
  Zap,
  Eye,
  FileImage,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'

interface ImageFile {
  id: string
  name: string
  originalSize: number
  optimizedSize: number
  width: number
  height: number
  type: string
  originalUrl: string
  optimizedUrl: string
  compressionRatio: number
}

export function ImageOptimizerApp() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [settings, setSettings] = useState({
    quality: 80,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'original' as 'original' | 'jpeg' | 'png' | 'webp'
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsProcessing(true)

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`)
          continue
        }

        await processImage(file)
      }
    } catch (error) {
      toast.error('Error processing images')
    } finally {
      setIsProcessing(false)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const processImage = async (file: File): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img
        const aspectRatio = width / height

        if (width > settings.maxWidth) {
          width = settings.maxWidth
          height = width / aspectRatio
        }

        if (height > settings.maxHeight) {
          height = settings.maxHeight
          width = height * aspectRatio
        }

        // Set canvas dimensions
        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)

        const outputFormat = settings.format === 'original' ? file.type : `image/${settings.format}`
        const quality = settings.quality / 100

        canvas.toBlob((blob) => {
          if (!blob) {
            resolve()
            return
          }

          const optimizedUrl = URL.createObjectURL(blob)
          const compressionRatio = ((file.size - blob.size) / file.size) * 100

          const imageFile: ImageFile = {
            id: Date.now().toString() + Math.random(),
            name: file.name,
            originalSize: file.size,
            optimizedSize: blob.size,
            width: Math.round(width),
            height: Math.round(height),
            type: outputFormat,
            originalUrl: URL.createObjectURL(file),
            optimizedUrl,
            compressionRatio
          }

          setImages(prev => [...prev, imageFile])
          toast.success(`${file.name} optimized successfully!`)
          resolve()
        }, outputFormat, quality)
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const downloadImage = (image: ImageFile) => {
    const a = document.createElement('a')
    a.href = image.optimizedUrl
    a.download = `optimized-${image.name}`
    a.click()
    toast.success('Image downloaded!')
  }

  const downloadAll = () => {
    images.forEach((image, index) => {
      setTimeout(() => {
        downloadImage(image)
      }, index * 100)
    })
    toast.success('All images downloading!')
  }

  const removeImage = (id: string) => {
    const image = images.find(img => img.id === id)
    if (image) {
      URL.revokeObjectURL(image.originalUrl)
      URL.revokeObjectURL(image.optimizedUrl)
    }
    setImages(prev => prev.filter(img => img.id !== id))
    toast.success('Image removed!')
  }

  const clearAll = () => {
    images.forEach(image => {
      URL.revokeObjectURL(image.originalUrl)
      URL.revokeObjectURL(image.optimizedUrl)
    })
    setImages([])
    toast.success('All images cleared!')
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0)
  const totalOptimizedSize = images.reduce((sum, img) => sum + img.optimizedSize, 0)
  const totalSavings = totalOriginalSize - totalOptimizedSize
  const averageCompression = images.length > 0 
    ? images.reduce((sum, img) => sum + img.compressionRatio, 0) / images.length 
    : 0

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
            <ImageIcon className="w-4 h-4 mr-2" />
            Image Optimizer
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Image{' '}
            <span className="text-gradient">Optimizer</span>
          </h1>
          <p className="text-muted-foreground">
            Compress and resize images efficiently with customizable settings
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="lg"
                  disabled={isProcessing}
                  className="mb-4"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Upload Images'}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Support for JPEG, PNG, WebP, and other common image formats
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Quality</label>
                  <div className="mt-2">
                    <Slider
                      value={[settings.quality]}
                      onValueChange={([value]) => setSettings(prev => ({ ...prev, quality: value }))}
                      min={10}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>10%</span>
                      <span className="font-medium">{settings.quality}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Max Width (px)</label>
                  <Input
                    type="number"
                    value={settings.maxWidth}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxWidth: parseInt(e.target.value) || 1920 }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Max Height (px)</label>
                  <Input
                    type="number"
                    value={settings.maxHeight}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxHeight: parseInt(e.target.value) || 1080 }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Output Format</label>
                  <select
                    value={settings.format}
                    onChange={(e) => setSettings(prev => ({ ...prev, format: e.target.value as any }))}
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="original">Keep Original</option>
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value="webp">WebP</option>
                  </select>
                </div>

                {/* Stats */}
                {images.length > 0 && (
                  <div className="pt-4 border-t space-y-3">
                    <h4 className="font-medium text-sm">Optimization Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Images:</span>
                        <span className="font-medium">{images.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Original:</span>
                        <span className="font-medium">{formatFileSize(totalOriginalSize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Optimized:</span>
                        <span className="font-medium text-green-500">{formatFileSize(totalOptimizedSize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saved:</span>
                        <span className="font-medium text-primary">{formatFileSize(totalSavings)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compression:</span>
                        <span className="font-medium">{averageCompression.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Images Grid */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Optimized Images ({images.length})</CardTitle>
                    {images.length > 0 && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={downloadAll}>
                          <Download className="w-4 h-4 mr-2" />
                          Download All
                        </Button>
                        <Button variant="outline" size="sm" onClick={clearAll}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {images.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">No images uploaded</h3>
                      <p className="mb-4">Upload images to start optimizing</p>
                      <Button onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Images
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <AnimatePresence>
                        {images.map((image) => (
                          <motion.div
                            key={image.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group"
                          >
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                              <div className="aspect-video relative overflow-hidden bg-muted">
                                <img
                                  src={image.optimizedUrl}
                                  alt={image.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => downloadImage(image)}
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() => {
                                        window.open(image.optimizedUrl, '_blank')
                                      }}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              
                              <CardContent className="p-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h3 className="font-medium text-sm truncate">{image.name}</h3>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeImage(image.id)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  
                                  <div className="text-xs text-muted-foreground">
                                    {image.width} × {image.height}
                                  </div>
                                  
                                  <div className="flex justify-between text-xs">
                                    <span>Original:</span>
                                    <span>{formatFileSize(image.originalSize)}</span>
                                  </div>
                                  
                                  <div className="flex justify-between text-xs">
                                    <span>Optimized:</span>
                                    <span className="text-green-500">{formatFileSize(image.optimizedSize)}</span>
                                  </div>
                                  
                                  <div className="flex justify-between text-xs">
                                    <span>Saved:</span>
                                    <span className="text-primary font-medium">
                                      {image.compressionRatio.toFixed(1)}%
                                    </span>
                                  </div>
                                  
                                  <Progress value={image.compressionRatio} className="h-1" />
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Processing Indicator */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <Card className="glass">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="font-medium mb-2">Processing Images</h3>
                    <p className="text-sm text-muted-foreground">
                      Optimizing your images with the selected settings...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
