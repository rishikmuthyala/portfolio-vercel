"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Zap, 
  Send, 
  Plus, 
  Trash2, 
  Copy,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Code,
  Key,
  Globe
} from 'lucide-react'
import { toast } from 'sonner'

interface APIRequest {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  headers: Record<string, string>
  body: string
  createdAt: Date
}

interface APIResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  data: any
  responseTime: number
  size: number
}

const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

const commonHeaders = [
  { key: 'Content-Type', value: 'application/json' },
  { key: 'Authorization', value: 'Bearer your-token-here' },
  { key: 'Accept', value: 'application/json' },
  { key: 'User-Agent', value: 'API-Tester/1.0' }
]

export function APITesterApp() {
  const [currentRequest, setCurrentRequest] = useState<APIRequest>({
    id: Date.now().toString(),
    name: 'New Request',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    headers: { 'Content-Type': 'application/json' },
    body: '',
    createdAt: new Date()
  })
  const [response, setResponse] = useState<APIResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [savedRequests, setSavedRequests] = useState<APIRequest[]>([])
  const [headerKey, setHeaderKey] = useState('')
  const [headerValue, setHeaderValue] = useState('')

  const sendRequest = async () => {
    if (!currentRequest.url) {
      toast.error('Please enter a URL')
      return
    }

    setIsLoading(true)
    const startTime = Date.now()

    try {
      const requestOptions: RequestInit = {
        method: currentRequest.method,
        headers: currentRequest.headers,
      }

      if (currentRequest.method !== 'GET' && currentRequest.body) {
        requestOptions.body = currentRequest.body
      }

      const response = await fetch(currentRequest.url, requestOptions)
      const responseTime = Date.now() - startTime
      
      let data: any
      const contentType = response.headers.get('content-type')
      
      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      const responseHeaders: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      const apiResponse: APIResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data,
        responseTime,
        size: JSON.stringify(data).length
      }

      setResponse(apiResponse)
      toast.success(`Request completed in ${responseTime}ms`)

    } catch (error) {
      console.error('API request failed:', error)
      
      const errorResponse: APIResponse = {
        status: 0,
        statusText: 'Network Error',
        headers: {},
        data: { error: error instanceof Error ? error.message : 'Unknown error' },
        responseTime: Date.now() - startTime,
        size: 0
      }
      
      setResponse(errorResponse)
      toast.error('Request failed')
    } finally {
      setIsLoading(false)
    }
  }

  const addHeader = () => {
    if (!headerKey || !headerValue) {
      toast.error('Please enter both key and value')
      return
    }

    setCurrentRequest(prev => ({
      ...prev,
      headers: {
        ...prev.headers,
        [headerKey]: headerValue
      }
    }))
    
    setHeaderKey('')
    setHeaderValue('')
    toast.success('Header added')
  }

  const removeHeader = (key: string) => {
    setCurrentRequest(prev => {
      const newHeaders = { ...prev.headers }
      delete newHeaders[key]
      return { ...prev, headers: newHeaders }
    })
    toast.success('Header removed')
  }

  const saveRequest = () => {
    const name = prompt('Enter request name:') || `Request ${Date.now()}`
    const requestToSave = {
      ...currentRequest,
      id: Date.now().toString(),
      name,
      createdAt: new Date()
    }
    
    setSavedRequests(prev => [requestToSave, ...prev])
    toast.success('Request saved!')
  }

  const loadRequest = (request: APIRequest) => {
    setCurrentRequest(request)
    setResponse(null)
    toast.success('Request loaded!')
  }

  const deleteRequest = (id: string) => {
    setSavedRequests(prev => prev.filter(r => r.id !== id))
    toast.success('Request deleted!')
  }

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2))
      toast.success('Response copied to clipboard!')
    }
  }

  const exportRequest = () => {
    const data = {
      request: currentRequest,
      response,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `api-request-${currentRequest.name.replace(/\s+/g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Request exported!')
  }

  const getStatusColor = (status: number) => {
    if (status === 0) return 'text-red-500'
    if (status < 300) return 'text-green-500'
    if (status < 400) return 'text-blue-500'
    if (status < 500) return 'text-yellow-500'
    return 'text-red-500'
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
            <Zap className="w-4 h-4 mr-2" />
            API Tester
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            API{' '}
            <span className="text-gradient">Tester</span>
          </h1>
          <p className="text-muted-foreground">
            Test REST APIs with a Postman-like interface
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Saved Requests Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Saved Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {savedRequests.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No saved requests</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {savedRequests.map((req) => (
                      <div key={req.id} className="p-2 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{req.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {req.method}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => loadRequest(req)}
                              className="h-6 w-6 p-0"
                            >
                              <Globe className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteRequest(req.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Request Builder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Request Builder</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={saveRequest}>
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={exportRequest}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="request" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="request">Request</TabsTrigger>
                      <TabsTrigger value="headers">Headers</TabsTrigger>
                      <TabsTrigger value="body">Body</TabsTrigger>
                    </TabsList>

                    <TabsContent value="request" className="space-y-4">
                      <div className="flex gap-2">
                        <select
                          value={currentRequest.method}
                          onChange={(e) => setCurrentRequest(prev => ({ 
                            ...prev, 
                            method: e.target.value as any 
                          }))}
                          className="px-3 py-2 border rounded-md bg-background"
                        >
                          {httpMethods.map(method => (
                            <option key={method} value={method}>{method}</option>
                          ))}
                        </select>
                        <Input
                          placeholder="Enter URL (e.g., https://api.example.com/users)"
                          value={currentRequest.url}
                          onChange={(e) => setCurrentRequest(prev => ({ 
                            ...prev, 
                            url: e.target.value 
                          }))}
                          className="flex-1"
                        />
                        <Button onClick={sendRequest} disabled={isLoading}>
                          {isLoading ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="headers" className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Header key"
                          value={headerKey}
                          onChange={(e) => setHeaderKey(e.target.value)}
                        />
                        <Input
                          placeholder="Header value"
                          value={headerValue}
                          onChange={(e) => setHeaderValue(e.target.value)}
                        />
                        <Button onClick={addHeader}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Common Headers:</h4>
                        <div className="flex flex-wrap gap-2">
                          {commonHeaders.map((header, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setHeaderKey(header.key)
                                setHeaderValue(header.value)
                              }}
                            >
                              {header.key}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Current Headers:</h4>
                        {Object.keys(currentRequest.headers).length === 0 ? (
                          <p className="text-sm text-muted-foreground">No headers set</p>
                        ) : (
                          <div className="space-y-2">
                            {Object.entries(currentRequest.headers).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium">{key}</div>
                                  <div className="text-xs text-muted-foreground truncate">{value}</div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeHeader(key)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="body" className="space-y-4">
                      <Textarea
                        placeholder="Request body (JSON, XML, etc.)"
                        value={currentRequest.body}
                        onChange={(e) => setCurrentRequest(prev => ({ 
                          ...prev, 
                          body: e.target.value 
                        }))}
                        className="min-h-[200px] font-mono text-sm"
                      />
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            try {
                              const formatted = JSON.stringify(JSON.parse(currentRequest.body), null, 2)
                              setCurrentRequest(prev => ({ ...prev, body: formatted }))
                              toast.success('JSON formatted!')
                            } catch {
                              toast.error('Invalid JSON')
                            }
                          }}
                        >
                          Format JSON
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentRequest(prev => ({ ...prev, body: '' }))}
                        >
                          Clear
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>

            {/* Response */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Response</CardTitle>
                    {response && (
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(response.status)}>
                          {response.status} {response.statusText}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {response.responseTime}ms
                        </div>
                        <Button variant="outline" size="sm" onClick={copyResponse}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!response ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No response yet</p>
                      <p className="text-sm">Send a request to see the response here</p>
                    </div>
                  ) : (
                    <Tabs defaultValue="body" className="w-full">
                      <TabsList>
                        <TabsTrigger value="body">Response Body</TabsTrigger>
                        <TabsTrigger value="headers">Headers</TabsTrigger>
                        <TabsTrigger value="info">Info</TabsTrigger>
                      </TabsList>

                      <TabsContent value="body" className="mt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Response Body</h4>
                            <div className="text-xs text-muted-foreground">
                              Size: {response.size} bytes
                            </div>
                          </div>
                          <pre className="p-4 bg-muted rounded-lg overflow-auto max-h-96 text-sm">
                            {typeof response.data === 'string' 
                              ? response.data 
                              : JSON.stringify(response.data, null, 2)
                            }
                          </pre>
                        </div>
                      </TabsContent>

                      <TabsContent value="headers" className="mt-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Response Headers</h4>
                          {Object.keys(response.headers).length === 0 ? (
                            <p className="text-sm text-muted-foreground">No headers received</p>
                          ) : (
                            <div className="space-y-2">
                              {Object.entries(response.headers).map(([key, value]) => (
                                <div key={key} className="p-2 bg-muted/30 rounded text-sm">
                                  <div className="font-medium">{key}</div>
                                  <div className="text-muted-foreground break-all">{value}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="info" className="mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="text-sm font-medium">Status Code</div>
                            <div className={`text-lg font-bold ${getStatusColor(response.status)}`}>
                              {response.status} {response.statusText}
                            </div>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="text-sm font-medium">Response Time</div>
                            <div className="text-lg font-bold text-primary">
                              {response.responseTime}ms
                            </div>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="text-sm font-medium">Response Size</div>
                            <div className="text-lg font-bold text-primary">
                              {response.size} bytes
                            </div>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="text-sm font-medium">Content Type</div>
                            <div className="text-sm text-muted-foreground">
                              {response.headers['content-type'] || 'Unknown'}
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
