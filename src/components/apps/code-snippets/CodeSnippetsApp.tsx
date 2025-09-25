"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Code, 
  Plus, 
  Search, 
  Copy, 
  Edit, 
  Trash2, 
  Share, 
  Tag,
  Calendar,
  Eye,
  Download
} from 'lucide-react'
import { toast } from 'sonner'

interface CodeSnippet {
  id: string
  title: string
  description: string
  code: string
  language: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  views: number
}

const sampleSnippets: CodeSnippet[] = [
  {
    id: '1',
    title: 'React useLocalStorage Hook',
    description: 'Custom hook for managing localStorage with React state',
    code: `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
}`,
    language: 'typescript',
    tags: ['React', 'Hooks', 'TypeScript', 'localStorage'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    isPublic: true,
    views: 45
  },
  {
    id: '2',
    title: 'Python Data Validator',
    description: 'Simple data validation utility for Python',
    code: `class DataValidator:
    def __init__(self):
        self.errors = []
    
    def required(self, value, field_name):
        if not value or (isinstance(value, str) and not value.strip()):
            self.errors.append(f"{field_name} is required")
        return self
    
    def email(self, value, field_name):
        import re
        if value and not re.match(r'^[^@]+@[^@]+\.[^@]+$', value):
            self.errors.append(f"{field_name} must be a valid email")
        return self
    
    def min_length(self, value, min_len, field_name):
        if value and len(str(value)) < min_len:
            self.errors.append(f"{field_name} must be at least {min_len} characters")
        return self
    
    def is_valid(self):
        return len(self.errors) == 0
    
    def get_errors(self):
        return self.errors

# Usage example
validator = DataValidator()
validator.required(email, "Email").email(email, "Email")
validator.required(password, "Password").min_length(password, 8, "Password")

if validator.is_valid():
    print("Data is valid!")
else:
    print("Validation errors:", validator.get_errors())`,
    language: 'python',
    tags: ['Python', 'Validation', 'Utility'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    isPublic: true,
    views: 23
  },
  {
    id: '3',
    title: 'CSS Glassmorphism Card',
    description: 'Modern glassmorphism effect with CSS',
    code: `.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5);
}

.glass-card.dark {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}`,
    language: 'css',
    tags: ['CSS', 'Design', 'Glassmorphism'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    isPublic: false,
    views: 12
  }
]

const languages = ['javascript', 'typescript', 'python', 'css', 'html', 'sql', 'bash', 'json']

export function CodeSnippetsApp() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>(sampleSnippets)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingSnippet, setEditingSnippet] = useState<CodeSnippet | null>(null)
  
  const [newSnippet, setNewSnippet] = useState({
    title: '',
    description: '',
    code: '',
    language: 'javascript',
    tags: '',
    isPublic: true
  })

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesLanguage = selectedLanguage === 'all' || snippet.language === selectedLanguage
    
    return matchesSearch && matchesLanguage
  })

  const createSnippet = () => {
    if (!newSnippet.title || !newSnippet.code) {
      toast.error('Title and code are required')
      return
    }

    const snippet: CodeSnippet = {
      id: Date.now().toString(),
      title: newSnippet.title,
      description: newSnippet.description,
      code: newSnippet.code,
      language: newSnippet.language,
      tags: newSnippet.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: newSnippet.isPublic,
      views: 0
    }

    setSnippets(prev => [snippet, ...prev])
    setNewSnippet({
      title: '',
      description: '',
      code: '',
      language: 'javascript',
      tags: '',
      isPublic: true
    })
    setIsCreateDialogOpen(false)
    toast.success('Snippet created successfully!')
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success('Code copied to clipboard!')
  }

  const deleteSnippet = (id: string) => {
    setSnippets(prev => prev.filter(snippet => snippet.id !== id))
    toast.success('Snippet deleted')
  }

  const exportSnippets = () => {
    const dataStr = JSON.stringify(snippets, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'code-snippets.json'
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Snippets exported successfully!')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
            <Code className="w-4 h-4 mr-2" />
            Code Snippets
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Code{' '}
            <span className="text-gradient">Snippet Manager</span>
          </h1>
          <p className="text-muted-foreground">
            Save, organize, and share your code snippets with syntax highlighting
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Snippet
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Snippet</DialogTitle>
                    <DialogDescription>
                      Add a new code snippet to your collection
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Snippet title"
                      value={newSnippet.title}
                      onChange={(e) => setNewSnippet(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Input
                      placeholder="Description (optional)"
                      value={newSnippet.description}
                      onChange={(e) => setNewSnippet(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <select
                        value={newSnippet.language}
                        onChange={(e) => setNewSnippet(prev => ({ ...prev, language: e.target.value }))}
                        className="px-3 py-2 border rounded-md bg-background"
                      >
                        {languages.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                      <Input
                        placeholder="Tags (comma separated)"
                        value={newSnippet.tags}
                        onChange={(e) => setNewSnippet(prev => ({ ...prev, tags: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                    <Textarea
                      placeholder="Paste your code here..."
                      value={newSnippet.code}
                      onChange={(e) => setNewSnippet(prev => ({ ...prev, code: e.target.value }))}
                      className="min-h-[200px] font-mono"
                    />
                    <div className="flex justify-between">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newSnippet.isPublic}
                          onChange={(e) => setNewSnippet(prev => ({ ...prev, isPublic: e.target.checked }))}
                        />
                        <span className="text-sm">Make public</span>
                      </label>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={createSnippet}>
                          Create Snippet
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" onClick={exportSnippets}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Language Filter */}
          <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              {languages.map(lang => (
                <TabsTrigger key={lang} value={lang}>
                  {lang}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Snippets Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <AnimatePresence>
            {filteredSnippets.map((snippet) => (
              <motion.div
                key={snippet.id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="h-full glass group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {snippet.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {snippet.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => copyCode(snippet.code)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteSnippet(snippet.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {snippet.language}
                      </Badge>
                      {!snippet.isPublic && (
                        <Badge variant="outline" className="text-xs">
                          Private
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="bg-muted/50 rounded-lg p-3 mb-4 overflow-x-auto">
                      <pre className="text-sm">
                        <code className="language-{snippet.language}">
                          {snippet.code.slice(0, 200)}
                          {snippet.code.length > 200 && '...'}
                        </code>
                      </pre>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {snippet.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="w-2 h-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {snippet.createdAt.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {snippet.views} views
                        </div>
                      </div>
                      
                      {snippet.isPublic && (
                        <Button variant="ghost" size="sm" className="text-xs h-6">
                          <Share className="w-3 h-3 mr-1" />
                          Share
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {filteredSnippets.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No snippets found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedLanguage !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first code snippet to get started'
              }
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Snippet
            </Button>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">{snippets.length}</div>
              <div className="text-sm text-muted-foreground">Total Snippets</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {new Set(snippets.map(s => s.language)).size}
              </div>
              <div className="text-sm text-muted-foreground">Languages</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {snippets.filter(s => s.isPublic).length}
              </div>
              <div className="text-sm text-muted-foreground">Public</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {snippets.reduce((sum, s) => sum + s.views, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
