"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Search, 
  CheckCircle, 
  XCircle,
  Copy,
  BookOpen,
  Lightbulb,
  Code,
  Target
} from 'lucide-react'
import { toast } from 'sonner'

const commonPatterns = [
  { name: 'Email', pattern: '^[^@]+@[^@]+\\.[^@]+$', description: 'Validates email addresses' },
  { name: 'Phone (US)', pattern: '^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$', description: 'US phone number format' },
  { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)', description: 'HTTP/HTTPS URLs' },
  { name: 'Credit Card', pattern: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$', description: 'Major credit card formats' },
  { name: 'IPv4', pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$', description: 'IPv4 address format' },
  { name: 'Password Strong', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', description: 'Strong password requirements' }
]

const testStrings = [
  'john.doe@example.com',
  'invalid-email',
  '(555) 123-4567',
  '555-123-4567',
  'not-a-phone',
  'https://www.example.com',
  'http://localhost:3000',
  'not-a-url',
  '192.168.1.1',
  '256.256.256.256',
  'MySecurePass123!',
  'weakpass'
]

export function RegexTesterApp() {
  const [pattern, setPattern] = useState('^[^@]+@[^@]+\\.[^@]+$')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('john.doe@example.com\\ninvalid-email\\ntest@domain.co.uk')
  const [matches, setMatches] = useState<RegExpMatchArray[]>([])
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState('')
  const [explanation, setExplanation] = useState('')

  useEffect(() => {
    testRegex()
  }, [pattern, flags, testString])

  const testRegex = () => {
    try {
      if (!pattern) {
        setMatches([])
        setIsValid(true)
        setError('')
        return
      }

      const regex = new RegExp(pattern, flags)
      setIsValid(true)
      setError('')

      const lines = testString.split('\\n')
      const allMatches: RegExpMatchArray[] = []

      lines.forEach((line, lineIndex) => {
        if (flags.includes('g')) {
          const globalMatches = [...line.matchAll(new RegExp(pattern, flags))]
          globalMatches.forEach(match => {
            if (match.index !== undefined) {
              allMatches.push({
                ...match,
                input: line,
                index: match.index,
                lineIndex
              } as any)
            }
          })
        } else {
          const match = line.match(regex)
          if (match && match.index !== undefined) {
            allMatches.push({
              ...match,
              lineIndex
            } as any)
          }
        }
      })

      setMatches(allMatches)
      generateExplanation(pattern)

    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : 'Invalid regular expression')
      setMatches([])
      setExplanation('')
    }
  }

  const generateExplanation = (regexPattern: string) => {
    // Simple regex explanation generator
    let explanation = 'Pattern breakdown:\\n'
    
    if (regexPattern.includes('^')) explanation += '• ^ - Start of string\\n'
    if (regexPattern.includes('$')) explanation += '• $ - End of string\\n'
    if (regexPattern.includes('[0-9]')) explanation += '• [0-9] - Any digit\\n'
    if (regexPattern.includes('[a-z]')) explanation += '• [a-z] - Any lowercase letter\\n'
    if (regexPattern.includes('[A-Z]')) explanation += '• [A-Z] - Any uppercase letter\\n'
    if (regexPattern.includes('\\d')) explanation += '• \\d - Any digit (0-9)\\n'
    if (regexPattern.includes('\\w')) explanation += '• \\w - Any word character\\n'
    if (regexPattern.includes('\\s')) explanation += '• \\s - Any whitespace\\n'
    if (regexPattern.includes('+')) explanation += '• + - One or more of the preceding\\n'
    if (regexPattern.includes('*')) explanation += '• * - Zero or more of the preceding\\n'
    if (regexPattern.includes('?')) explanation += '• ? - Zero or one of the preceding\\n'
    if (regexPattern.includes('.')) explanation += '• . - Any character except newline\\n'
    if (regexPattern.includes('|')) explanation += '• | - Alternation (OR)\\n'
    if (regexPattern.includes('()')) explanation += '• () - Capturing group\\n'
    if (regexPattern.includes('(?:')) explanation += '• (?:) - Non-capturing group\\n'

    setExplanation(explanation)
  }

  const copyPattern = () => {
    navigator.clipboard.writeText(pattern)
    toast.success('Pattern copied to clipboard!')
  }

  const loadCommonPattern = (commonPattern: typeof commonPatterns[0]) => {
    setPattern(commonPattern.pattern)
    toast.success(`Loaded ${commonPattern.name} pattern!`)
  }

  const addTestString = (str: string) => {
    setTestString(prev => prev + (prev ? '\\n' : '') + str)
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
            <Search className="w-4 h-4 mr-2" />
            Regex Tester
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Regular Expression{' '}
            <span className="text-gradient">Tester</span>
          </h1>
          <p className="text-muted-foreground">
            Test regular expressions with live matching and explanations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Common Patterns Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Common Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {commonPatterns.map((pattern, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-auto p-3 text-left"
                      onClick={() => loadCommonPattern(pattern)}
                    >
                      <div>
                        <div className="font-medium text-sm">{pattern.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {pattern.description}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Test Strings</h4>
                  <div className="space-y-1">
                    {testStrings.map((str, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs h-auto p-2"
                        onClick={() => addTestString(str)}
                      >
                        <Target className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span className="truncate">{str}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Testing Interface */}
          <div className="lg:col-span-3 space-y-6">
            {/* Pattern Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Regular Expression Pattern</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder="Enter your regex pattern..."
                          value={pattern}
                          onChange={(e) => setPattern(e.target.value)}
                          className={`font-mono ${!isValid ? 'border-red-500' : ''}`}
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          placeholder="Flags"
                          value={flags}
                          onChange={(e) => setFlags(e.target.value)}
                          className="font-mono text-center"
                        />
                      </div>
                      <Button onClick={copyPattern} variant="outline">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm">/{pattern}/{flags}</span>
                      {isValid ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Valid
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          <XCircle className="w-3 h-3 mr-1" />
                          Invalid
                        </Badge>
                      )}
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="text-red-800 dark:text-red-200 text-sm">{error}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Test String Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Test String</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter test strings (one per line)..."
                    value={testString.replace(/\\n/g, '\n')}
                    onChange={(e) => setTestString(e.target.value.replace(/\n/g, '\\n'))}
                    className="min-h-[150px] font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Results</CardTitle>
                    <Badge variant="secondary">
                      {matches.length} matches found
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {!isValid ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                      <p>Invalid regular expression</p>
                      <p className="text-sm">Fix the pattern above to see results</p>
                    </div>
                  ) : matches.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No matches found</p>
                      <p className="text-sm">Try adjusting your pattern or test string</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {testString.split('\\n').map((line, lineIndex) => {
                        const lineMatches = matches.filter((m: any) => m.lineIndex === lineIndex)
                        
                        return (
                          <div key={lineIndex} className="p-3 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium">Line {lineIndex + 1}</span>
                              {lineMatches.length > 0 ? (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {lineMatches.length} matches
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  No matches
                                </Badge>
                              )}
                            </div>
                            
                            <div className="font-mono text-sm bg-muted/30 p-2 rounded">
                              {lineMatches.length > 0 ? (
                                <HighlightedText text={line} matches={lineMatches} />
                              ) : (
                                <span className="text-muted-foreground">{line}</span>
                              )}
                            </div>

                            {lineMatches.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {lineMatches.map((match, matchIndex) => (
                                  <div key={matchIndex} className="text-xs text-muted-foreground">
                                    Match {matchIndex + 1}: "{match[0]}" at position {match.index}
                                    {match.length > 1 && (
                                      <div className="ml-4">
                                        Groups: {match.slice(1).map((group, i) => `$${i + 1}="${group}"`).join(', ')}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Explanation */}
            {explanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Pattern Explanation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {explanation}
                    </pre>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function HighlightedText({ text, matches }: { text: string, matches: any[] }) {
  if (matches.length === 0) return <span>{text}</span>

  const parts = []
  let lastIndex = 0

  matches.forEach((match, i) => {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${i}`} className="text-muted-foreground">
          {text.slice(lastIndex, match.index)}
        </span>
      )
    }
    
    parts.push(
      <span key={`match-${i}`} className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 px-1 rounded">
        {match[0]}
      </span>
    )
    
    lastIndex = match.index + match[0].length
  })

  if (lastIndex < text.length) {
    parts.push(
      <span key="text-end" className="text-muted-foreground">
        {text.slice(lastIndex)}
      </span>
    )
  }

  return <>{parts}</>
}
