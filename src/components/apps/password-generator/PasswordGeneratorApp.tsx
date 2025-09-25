"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  RefreshCw, 
  Copy, 
  Eye, 
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Key,
  History,
  Download
} from 'lucide-react'
import { toast } from 'sonner'

interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeSimilar: boolean
  excludeAmbiguous: boolean
}

interface GeneratedPassword {
  password: string
  strength: number
  strengthLabel: string
  createdAt: Date
}

export function PasswordGeneratorApp() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(true)
  const [passwordHistory, setPasswordHistory] = useState<GeneratedPassword[]>([])
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  })

  useEffect(() => {
    generatePassword()
    loadPasswordHistory()
  }, [])

  useEffect(() => {
    savePasswordHistory()
  }, [passwordHistory])

  const loadPasswordHistory = () => {
    const saved = localStorage.getItem('password-history')
    if (saved) {
      const history = JSON.parse(saved).map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt)
      }))
      setPasswordHistory(history)
    }
  }

  const savePasswordHistory = () => {
    localStorage.setItem('password-history', JSON.stringify(passwordHistory))
  }

  const generatePassword = () => {
    let charset = ''
    
    if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (options.includeNumbers) charset += '0123456789'
    if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    if (options.excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '')
    }
    
    if (options.excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()\/\\'"~,;<>.]/g, '')
    }
    
    if (!charset) {
      toast.error('Please select at least one character type')
      return
    }
    
    let newPassword = ''
    for (let i = 0; i < options.length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    
    const strength = calculatePasswordStrength(newPassword)
    const strengthLabel = getStrengthLabel(strength)
    
    setPassword(newPassword)
    
    // Add to history
    const passwordEntry: GeneratedPassword = {
      password: newPassword,
      strength,
      strengthLabel,
      createdAt: new Date()
    }
    
    setPasswordHistory(prev => [passwordEntry, ...prev.slice(0, 9)]) // Keep last 10
    toast.success('New password generated!')
  }

  const calculatePasswordStrength = (pwd: string): number => {
    let score = 0
    
    // Length score
    if (pwd.length >= 8) score += 25
    if (pwd.length >= 12) score += 25
    if (pwd.length >= 16) score += 25
    
    // Character variety
    if (/[a-z]/.test(pwd)) score += 5
    if (/[A-Z]/.test(pwd)) score += 5
    if (/[0-9]/.test(pwd)) score += 5
    if (/[^A-Za-z0-9]/.test(pwd)) score += 10
    
    // Bonus for length
    if (pwd.length > 20) score += 5
    
    return Math.min(100, score)
  }

  const getStrengthLabel = (strength: number): string => {
    if (strength < 25) return 'Very Weak'
    if (strength < 50) return 'Weak'
    if (strength < 75) return 'Good'
    if (strength < 90) return 'Strong'
    return 'Very Strong'
  }

  const getStrengthColor = (strength: number): string => {
    if (strength < 25) return 'text-red-500'
    if (strength < 50) return 'text-orange-500'
    if (strength < 75) return 'text-yellow-500'
    if (strength < 90) return 'text-blue-500'
    return 'text-green-500'
  }

  const getStrengthBgColor = (strength: number): string => {
    if (strength < 25) return 'bg-red-500'
    if (strength < 50) return 'bg-orange-500'
    if (strength < 75) return 'bg-yellow-500'
    if (strength < 90) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const copyPassword = (pwd: string = password) => {
    navigator.clipboard.writeText(pwd)
    toast.success('Password copied to clipboard!')
  }

  const exportPasswords = () => {
    const data = passwordHistory.map(p => ({
      password: p.password,
      strength: p.strength,
      strengthLabel: p.strengthLabel,
      createdAt: p.createdAt.toISOString()
    }))
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'password-history.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Password history exported!')
  }

  const clearHistory = () => {
    setPasswordHistory([])
    toast.success('Password history cleared!')
  }

  const currentStrength = calculatePasswordStrength(password)
  const currentStrengthLabel = getStrengthLabel(currentStrength)

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge variant="outline" className="mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Password Generator
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Secure{' '}
            <span className="text-gradient">Password Generator</span>
          </h1>
          <p className="text-muted-foreground">
            Generate strong, secure passwords with customizable options
          </p>
        </motion.div>

        {/* Generated Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Generated Password
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => copyPassword()}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={generatePassword}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className={`p-4 bg-muted rounded-lg font-mono text-lg break-all ${
                  showPassword ? '' : 'blur-sm select-none'
                }`}>
                  {password || 'Click Generate to create a password'}
                </div>
              </div>
              
              {password && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Password Strength</span>
                    <Badge className={getStrengthColor(currentStrength)}>
                      {currentStrengthLabel}
                    </Badge>
                  </div>
                  <div className="relative">
                    <Progress value={currentStrength} className="h-3" />
                    <div 
                      className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-500 ${getStrengthBgColor(currentStrength)}`}
                      style={{ width: `${currentStrength}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Score: {currentStrength}/100
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Password Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle>Password Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Length Slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium">Password Length</label>
                    <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {options.length}
                    </span>
                  </div>
                  <Slider
                    value={[options.length]}
                    onValueChange={([value]) => setOptions(prev => ({ ...prev, length: value }))}
                    min={4}
                    max={128}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>4</span>
                    <span>128</span>
                  </div>
                </div>

                {/* Character Types */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Include Characters</h3>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeUppercase}
                      onChange={(e) => setOptions(prev => ({ ...prev, includeUppercase: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Uppercase Letters (A-Z)</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeLowercase}
                      onChange={(e) => setOptions(prev => ({ ...prev, includeLowercase: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Lowercase Letters (a-z)</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeNumbers}
                      onChange={(e) => setOptions(prev => ({ ...prev, includeNumbers: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Numbers (0-9)</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeSymbols}
                      onChange={(e) => setOptions(prev => ({ ...prev, includeSymbols: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Symbols (!@#$%^&*)</span>
                  </label>
                </div>

                {/* Advanced Options */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Advanced Options</h3>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.excludeSimilar}
                      onChange={(e) => setOptions(prev => ({ ...prev, excludeSimilar: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Exclude Similar Characters (il1Lo0O)</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.excludeAmbiguous}
                      onChange={(e) => setOptions(prev => ({ ...prev, excludeAmbiguous: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Exclude Ambiguous Characters</span>
                  </label>
                </div>

                {/* Security Tips */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm mb-1">Security Tips</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Use at least 12 characters for good security</li>
                        <li>• Include multiple character types</li>
                        <li>• Never reuse passwords across sites</li>
                        <li>• Consider using a password manager</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Password History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Password History
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportPasswords}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearHistory}>
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {passwordHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No passwords generated yet</p>
                    <p className="text-sm">Generated passwords will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {passwordHistory.map((entry, index) => (
                      <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getStrengthColor(entry.strength)}>
                            {entry.strengthLabel}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyPassword(entry.password)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="font-mono text-sm break-all mb-2 blur-sm hover:blur-none transition-all cursor-pointer">
                          {entry.password}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {entry.createdAt.toLocaleString()}
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
    </div>
  )
}
