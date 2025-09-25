"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileCode, 
  Copy, 
  Download, 
  Upload,
  CheckCircle,
  AlertTriangle,
  Minimize2,
  Maximize2,
  RotateCcw,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'

const sampleJSON = {
  "name": "John Doe",
  "age": 30,
  "email": "john.doe@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  },
  "phoneNumbers": [
    {
      "type": "home",
      "number": "555-1234"
    },
    {
      "type": "work",
      "number": "555-5678"
    }
  ],
  "isActive": true,
  "preferences": {
    "notifications": {
      "email": true,
      "sms": false,
      "push": true
    },
    "theme": "dark",
    "language": "en"
  },
  "metadata": {
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T15:45:00Z",
    "version": "1.2.0"
  }
}

export function JSONFormatterApp() {
  const [inputJSON, setInputJSON] = useState(JSON.stringify(sampleJSON, null, 2))
  const [formattedJSON, setFormattedJSON] = useState('')
  const [minifiedJSON, setMinifiedJSON] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    characters: 0,
    lines: 0,
    size: '0 B',
    keys: 0,
    values: 0
  })

  useEffect(() => {
    processJSON()
  }, [inputJSON])

  const processJSON = () => {
    try {
      if (!inputJSON.trim()) {
        setFormattedJSON('')
        setMinifiedJSON('')
        setIsValid(true)
        setError('')
        setStats({ characters: 0, lines: 0, size: '0 B', keys: 0, values: 0 })
        return
      }

      const parsed = JSON.parse(inputJSON)
      const formatted = JSON.stringify(parsed, null, 2)
      const minified = JSON.stringify(parsed)
      
      setFormattedJSON(formatted)
      setMinifiedJSON(minified)
      setIsValid(true)
      setError('')
      
      // Calculate stats
      const characters = inputJSON.length
      const lines = inputJSON.split('\n').length
      const size = formatBytes(new Blob([inputJSON]).size)
      const { keys, values } = countKeysAndValues(parsed)
      
      setStats({ characters, lines, size, keys, values })
      
    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      setFormattedJSON('')
      setMinifiedJSON('')
      
      const characters = inputJSON.length
      const lines = inputJSON.split('\n').length
      const size = formatBytes(new Blob([inputJSON]).size)
      
      setStats({ characters, lines, size, keys: 0, values: 0 })
    }
  }

  const countKeysAndValues = (obj: any): { keys: number, values: number } => {
    let keys = 0
    let values = 0
    
    const traverse = (item: any) => {
      if (Array.isArray(item)) {
        values++
        item.forEach(traverse)
      } else if (typeof item === 'object' && item !== null) {
        values++
        Object.keys(item).forEach(key => {
          keys++
          traverse(item[key])
        })
      } else {
        values++
      }
    }
    
    traverse(obj)
    return { keys, values }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatJSON = () => {
    if (isValid && formattedJSON) {
      setInputJSON(formattedJSON)
      toast.success('JSON formatted!')
    }
  }

  const minifyJSON = () => {
    if (isValid && minifiedJSON) {
      setInputJSON(minifiedJSON)
      toast.success('JSON minified!')
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} copied to clipboard!`)
  }

  const downloadJSON = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast.success('JSON file downloaded!')
  }

  const uploadJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInputJSON(content)
        toast.success('JSON file loaded!')
      }
      reader.readAsText(file)
    }
    // Reset input
    event.target.value = ''
  }

  const clearJSON = () => {
    setInputJSON('')
    toast.success('JSON cleared!')
  }

  const loadSample = () => {
    setInputJSON(JSON.stringify(sampleJSON, null, 2))
    toast.success('Sample JSON loaded!')
  }

  const validateAndHighlight = (json: string) => {
    if (!json.trim()) return json
    
    try {
      JSON.parse(json)
      return json
    } catch (err) {
      // Simple syntax highlighting for invalid JSON
      return json
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge variant="outline" className="mb-4">
            <FileCode className="w-4 h-4 mr-2" />
            JSON Formatter
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            JSON{' '}
            <span className="text-gradient">Formatter & Validator</span>
          </h1>
          <p className="text-muted-foreground">
            Format, validate, and beautify JSON data with syntax highlighting
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button onClick={formatJSON} disabled={!isValid}>
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Format
                  </Button>
                  <Button onClick={minifyJSON} disabled={!isValid}>
                    <Minimize2 className="w-4 h-4 mr-2" />
                    Minify
                  </Button>
                  <Button variant="outline" onClick={clearJSON}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                  <Button variant="outline" onClick={loadSample}>
                    Load Sample
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json,.txt"
                      onChange={uploadJSON}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>

                {/* Validation Status */}
                <div className="flex items-center gap-2">
                  {isValid ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Valid JSON
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Invalid JSON
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6"
        >
          <Card className="glass">
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.characters.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Characters</div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.lines}</div>
                <div className="text-sm text-muted-foreground">Lines</div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.size}</div>
                <div className="text-sm text-muted-foreground">Size</div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.keys}</div>
                <div className="text-sm text-muted-foreground">Keys</div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.values}</div>
                <div className="text-sm text-muted-foreground">Values</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass">
            <Tabs defaultValue="editor" className="w-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>JSON Editor</CardTitle>
                  <TabsList>
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="formatted" disabled={!isValid}>Formatted</TabsTrigger>
                    <TabsTrigger value="minified" disabled={!isValid}>Minified</TabsTrigger>
                    <TabsTrigger value="tree" disabled={!isValid}>Tree View</TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>

              <CardContent>
                <TabsContent value="editor" className="mt-0">
                  <div className="space-y-4">
                    <Textarea
                      value={inputJSON}
                      onChange={(e) => setInputJSON(e.target.value)}
                      placeholder="Paste your JSON here..."
                      className="min-h-[500px] font-mono text-sm resize-none"
                      style={{ 
                        backgroundColor: isValid ? 'transparent' : 'rgba(239, 68, 68, 0.05)',
                        borderColor: isValid ? 'transparent' : 'rgba(239, 68, 68, 0.2)'
                      }}
                    />
                    
                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-red-800 dark:text-red-200 text-sm">
                              JSON Validation Error
                            </div>
                            <div className="text-red-600 dark:text-red-300 text-sm mt-1">
                              {error}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="formatted" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Formatted JSON</h3>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyToClipboard(formattedJSON, 'Formatted JSON')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => downloadJSON(formattedJSON, 'formatted.json')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <pre className="min-h-[500px] p-4 bg-muted rounded-lg overflow-auto text-sm font-mono whitespace-pre-wrap">
                      {formattedJSON || 'No valid JSON to format'}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="minified" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Minified JSON</h3>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyToClipboard(minifiedJSON, 'Minified JSON')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => downloadJSON(minifiedJSON, 'minified.json')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="min-h-[500px] p-4 bg-muted rounded-lg overflow-auto">
                      <div className="text-sm font-mono break-all">
                        {minifiedJSON || 'No valid JSON to minify'}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="tree" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Tree View</h3>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Expand All
                      </Button>
                    </div>
                    <div className="min-h-[500px] p-4 bg-muted rounded-lg overflow-auto">
                      {isValid && formattedJSON ? (
                        <div className="text-sm">
                          <JSONTreeView data={JSON.parse(inputJSON)} />
                        </div>
                      ) : (
                        <div className="text-muted-foreground">No valid JSON to display</div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

// Simple JSON Tree View Component
function JSONTreeView({ data, level = 0 }: { data: any, level?: number }) {
  const [expanded, setExpanded] = useState(level < 2)
  
  const indent = '  '.repeat(level)
  
  if (data === null) {
    return <span className="text-gray-500">null</span>
  }
  
  if (typeof data === 'string') {
    return <span className="text-green-600">"{data}"</span>
  }
  
  if (typeof data === 'number') {
    return <span className="text-blue-600">{data}</span>
  }
  
  if (typeof data === 'boolean') {
    return <span className="text-purple-600">{data.toString()}</span>
  }
  
  if (Array.isArray(data)) {
    return (
      <div>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-gray-600"
        >
          {expanded ? '▼' : '▶'} [{data.length}]
        </button>
        {expanded && (
          <div className="ml-4">
            {data.map((item, index) => (
              <div key={index}>
                <span className="text-gray-400">{index}: </span>
                <JSONTreeView data={item} level={level + 1} />
                {index < data.length - 1 && <span className="text-gray-400">,</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
  
  if (typeof data === 'object') {
    const keys = Object.keys(data)
    return (
      <div>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-gray-600"
        >
          {expanded ? '▼' : '▶'} {'{' + keys.length + '}'}
        </button>
        {expanded && (
          <div className="ml-4">
            {keys.map((key, index) => (
              <div key={key}>
                <span className="text-red-600">"{key}"</span>
                <span className="text-gray-400">: </span>
                <JSONTreeView data={data[key]} level={level + 1} />
                {index < keys.length - 1 && <span className="text-gray-400">,</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
  
  return <span>{String(data)}</span>
}
