"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Eye, 
  Download, 
  Copy, 
  Upload,
  Save,
  RotateCcw,
  Maximize2,
  Code
} from 'lucide-react'
import { toast } from 'sonner'

const sampleMarkdown = `# Welcome to Markdown Editor

This is a **live preview** markdown editor with syntax highlighting and export options.

## Features

- ✅ Real-time preview
- ✅ Syntax highlighting
- ✅ Export to HTML/PDF
- ✅ Local storage
- ✅ Full-screen mode

## Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

## Lists

### Unordered List
- Item 1
- Item 2
  - Nested item
  - Another nested item

### Ordered List
1. First item
2. Second item
3. Third item

## Links and Images

[Visit GitHub](https://github.com)

## Tables

| Feature | Status | Priority |
|---------|--------|----------|
| Editor | ✅ Done | High |
| Preview | ✅ Done | High |
| Export | ✅ Done | Medium |

## Blockquotes

> "The best way to predict the future is to invent it." - Alan Kay

## Emphasis

*Italic text* and **bold text** and ***bold italic text***.

You can also use ~~strikethrough~~ text.

---

Happy writing! 🚀
`

export function MarkdownEditorApp() {
  const [markdown, setMarkdown] = useState(sampleMarkdown)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [savedContent, setSavedContent] = useState('')

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('markdown-editor-content')
    if (saved) {
      setMarkdown(saved)
      setSavedContent(saved)
    }
  }, [])

  useEffect(() => {
    // Update counts
    const words = markdown.trim().split(/\s+/).filter(word => word.length > 0).length
    const chars = markdown.length
    setWordCount(words)
    setCharCount(chars)
  }, [markdown])

  const saveToStorage = () => {
    localStorage.setItem('markdown-editor-content', markdown)
    setSavedContent(markdown)
    toast.success('Content saved to local storage!')
  }

  const loadFromStorage = () => {
    const saved = localStorage.getItem('markdown-editor-content')
    if (saved) {
      setMarkdown(saved)
      toast.success('Content loaded from local storage!')
    } else {
      toast.error('No saved content found')
    }
  }

  const resetToSample = () => {
    setMarkdown(sampleMarkdown)
    toast.success('Reset to sample content!')
  }

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdown)
    toast.success('Markdown copied to clipboard!')
  }

  const copyHTML = () => {
    const html = markdownToHtml(markdown)
    navigator.clipboard.writeText(html)
    toast.success('HTML copied to clipboard!')
  }

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Markdown file downloaded!')
  }

  const downloadHTML = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Document</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 1rem; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 1rem; color: #666; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
${markdownToHtml(markdown)}
</body>
</html>`
    
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.html'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('HTML file downloaded!')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/markdown') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setMarkdown(content)
        toast.success('Markdown file loaded!')
      }
      reader.readAsText(file)
    } else {
      toast.error('Please select a valid markdown file')
    }
  }

  const markdownToHtml = (md: string): string => {
    // Simple markdown to HTML converter
    let html = md
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Bold and Italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Strikethrough
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>')
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    
    // Inline code
    html = html.replace(/\`([^`]+)\`/g, '<code>$1</code>')
    
    // Code blocks
    html = html.replace(/\`\`\`([\s\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>')
    
    // Lists
    html = html.replace(/^\* (.+)$/gm, '<li>$1</li>')
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    
    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    
    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr>')
    
    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>')
    html = html.replace(/\n/g, '<br>')
    
    // Wrap in paragraphs
    html = '<p>' + html + '</p>'
    
    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '')
    html = html.replace(/<p>(<h[1-6]>)/g, '$1')
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1')
    html = html.replace(/<p>(<hr>)<\/p>/g, '$1')
    html = html.replace(/<p>(<blockquote>)/g, '$1')
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1')
    
    return html
  }

  const hasUnsavedChanges = markdown !== savedContent

  return (
    <div className="min-h-screen py-8">
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        isFullscreen ? 'max-w-full' : 'max-w-7xl'
      }`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge variant="outline" className="mb-4">
            <FileText className="w-4 h-4 mr-2" />
            Markdown Editor
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Live{' '}
            <span className="text-gradient">Markdown Editor</span>
          </h1>
          <p className="text-muted-foreground">
            Write markdown with real-time preview and export options
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
                  <Button variant="outline" size="sm" onClick={saveToStorage}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                    {hasUnsavedChanges && <span className="ml-1 text-orange-500">*</span>}
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={loadFromStorage}>
                    <Upload className="w-4 h-4 mr-2" />
                    Load
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={resetToSample}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept=".md,.markdown"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload .md
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    {wordCount} words • {charCount} characters
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass">
            <Tabs defaultValue="split" className="w-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Markdown Editor</CardTitle>
                  <TabsList>
                    <TabsTrigger value="editor">
                      <Code className="w-4 h-4 mr-2" />
                      Editor
                    </TabsTrigger>
                    <TabsTrigger value="split">Split View</TabsTrigger>
                    <TabsTrigger value="preview">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>

              <CardContent>
                <TabsContent value="editor" className="mt-0">
                  <Textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    placeholder="Start writing your markdown here..."
                    className="min-h-[500px] font-mono text-sm resize-none"
                  />
                </TabsContent>

                <TabsContent value="split" className="mt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px]">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Editor</h3>
                      <Textarea
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        placeholder="Start writing your markdown here..."
                        className="h-full font-mono text-sm resize-none"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Preview</h3>
                      <div 
                        className="h-full p-4 border rounded-lg bg-background overflow-y-auto prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="mt-0">
                  <div 
                    className="min-h-[500px] p-4 border rounded-lg bg-background prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }}
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </motion.div>

        {/* Export Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={copyMarkdown}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Markdown
                </Button>
                
                <Button variant="outline" onClick={copyHTML}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy HTML
                </Button>
                
                <Button variant="outline" onClick={downloadMarkdown}>
                  <Download className="w-4 h-4 mr-2" />
                  Download .md
                </Button>
                
                <Button variant="outline" onClick={downloadHTML}>
                  <Download className="w-4 h-4 mr-2" />
                  Download .html
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
