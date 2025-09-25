'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { 
  RotateCcw, 
  Trophy, 
  Target, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Zap,
  Timer,
  BarChart3,
  Share2,
  Settings
} from 'lucide-react'

// Word lists for different difficulties
const WORD_LISTS = {
  easy: ['REACT', 'CODES', 'DEBUG', 'ARRAY', 'LOOPS', 'STACK', 'QUEUE', 'GRAPH', 'TREES', 'NODES'],
  medium: ['PYTHON', 'GITHUB', 'DOCKER', 'LAMBDA', 'DEPLOY', 'SERVER', 'CLIENT', 'BINARY', 'MEMORY', 'THREAD'],
  hard: ['ALGORITHM', 'RECURSION', 'INTERFACE', 'FRAMEWORK', 'COMPONENT', 'TYPESCRIPT', 'KUBERNETES', 'POSTGRESQL', 'JAVASCRIPT', 'ENCRYPTION']
}

interface GameStats {
  gamesPlayed: number
  gamesWon: number
  currentStreak: number
  maxStreak: number
  guessDistribution: number[]
}

interface LetterState {
  letter: string
  state: 'correct' | 'present' | 'absent' | 'empty'
}

const INITIAL_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0]
}

export default function WordlePage() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [targetWord, setTargetWord] = useState('')
  const [currentGuess, setCurrentGuess] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing')
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS)
  const [showStats, setShowStats] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [keyboard, setKeyboard] = useState<Map<string, 'correct' | 'present' | 'absent'>>(new Map())
  
  const maxAttempts = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 5 : 4
  const wordLength = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 6 : difficulty === 'hard' ? 9 : 5

  // Initialize game
  useEffect(() => {
    startNewGame()
    // Load stats from localStorage
    const savedStats = localStorage.getItem('wordleStats')
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }, [difficulty])

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && gameState === 'playing') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, gameState])

  const startNewGame = () => {
    const words = WORD_LISTS[difficulty]
    const randomWord = words[Math.floor(Math.random() * words.length)]
    setTargetWord(randomWord)
    setCurrentGuess('')
    setGuesses([])
    setGameState('playing')
    setTimeElapsed(0)
    setIsTimerRunning(true)
    setKeyboard(new Map())
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const evaluateGuess = (guess: string): LetterState[] => {
    const result: LetterState[] = []
    const targetLetters = targetWord.split('')
    const guessLetters = guess.split('')
    
    // First pass: mark correct letters
    for (let i = 0; i < guessLetters.length; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        result[i] = { letter: guessLetters[i], state: 'correct' }
        targetLetters[i] = ''
      }
    }
    
    // Second pass: mark present letters
    for (let i = 0; i < guessLetters.length; i++) {
      if (!result[i]) {
        const targetIndex = targetLetters.indexOf(guessLetters[i])
        if (targetIndex !== -1) {
          result[i] = { letter: guessLetters[i], state: 'present' }
          targetLetters[targetIndex] = ''
        } else {
          result[i] = { letter: guessLetters[i], state: 'absent' }
        }
      }
    }
    
    return result
  }

  const updateKeyboard = (guess: string) => {
    const evaluation = evaluateGuess(guess)
    const newKeyboard = new Map(keyboard)
    
    evaluation.forEach(({ letter, state }) => {
      const currentState = newKeyboard.get(letter)
      // Only update if new state is "better" than current
      if (!currentState || 
          state === 'correct' || 
          (state === 'present' && currentState === 'absent')) {
        newKeyboard.set(letter, state)
      }
    })
    
    setKeyboard(newKeyboard)
  }

  const handleKeyPress = useCallback((key: string) => {
    if (gameState !== 'playing') return
    
    if (key === 'ENTER') {
      submitGuess()
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1))
    } else if (currentGuess.length < wordLength && /^[A-Z]$/.test(key)) {
      setCurrentGuess(prev => prev + key)
    }
  }, [currentGuess, gameState, wordLength])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleKeyPress('ENTER')
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE')
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase())
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyPress])

  const submitGuess = () => {
    if (currentGuess.length !== wordLength) {
      toast.error(`Word must be ${wordLength} letters`)
      return
    }
    
    // In a real app, validate against a dictionary
    const newGuesses = [...guesses, currentGuess]
    setGuesses(newGuesses)
    updateKeyboard(currentGuess)
    
    if (currentGuess === targetWord) {
      setGameState('won')
      setIsTimerRunning(false)
      updateStats(true, newGuesses.length)
      toast.success('🎉 Congratulations! You won!')
    } else if (newGuesses.length >= maxAttempts) {
      setGameState('lost')
      setIsTimerRunning(false)
      updateStats(false, 0)
      toast.error(`Game Over! The word was ${targetWord}`)
    }
    
    setCurrentGuess('')
  }

  const updateStats = (won: boolean, attempts: number) => {
    const newStats = { ...stats }
    newStats.gamesPlayed++
    
    if (won) {
      newStats.gamesWon++
      newStats.currentStreak++
      newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak)
      if (attempts > 0 && attempts <= 6) {
        newStats.guessDistribution[attempts - 1]++
      }
    } else {
      newStats.currentStreak = 0
    }
    
    setStats(newStats)
    localStorage.setItem('wordleStats', JSON.stringify(newStats))
  }

  const shareResults = () => {
    const emojiGrid = guesses.map(guess => {
      const evaluation = evaluateGuess(guess)
      return evaluation.map(({ state }) => {
        switch (state) {
          case 'correct': return '🟩'
          case 'present': return '🟨'
          case 'absent': return '⬜'
          default: return '⬜'
        }
      }).join('')
    }).join('\n')
    
    const text = `Wordle (${difficulty}) ${gameState === 'won' ? guesses.length : 'X'}/${maxAttempts}\n\n${emojiGrid}`
    navigator.clipboard.writeText(text)
    toast.success('Results copied to clipboard!')
  }

  const renderGrid = () => {
    const rows = []
    
    // Render submitted guesses
    for (let i = 0; i < guesses.length; i++) {
      const evaluation = evaluateGuess(guesses[i])
      rows.push(
        <div key={`guess-${i}`} className="flex gap-1 justify-center">
          {evaluation.map((letterState, j) => (
            <motion.div
              key={`${i}-${j}`}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: 360 }}
              transition={{ delay: j * 0.1, duration: 0.6 }}
              className={`
                w-12 h-12 border-2 flex items-center justify-center text-lg font-bold rounded
                ${letterState.state === 'correct' ? 'bg-green-500 border-green-500 text-white' :
                  letterState.state === 'present' ? 'bg-yellow-500 border-yellow-500 text-white' :
                  letterState.state === 'absent' ? 'bg-gray-500 border-gray-500 text-white' :
                  'border-gray-300'}
              `}
            >
              {letterState.letter}
            </motion.div>
          ))}
        </div>
      )
    }
    
    // Render current guess
    if (gameState === 'playing' && guesses.length < maxAttempts) {
      rows.push(
        <div key="current" className="flex gap-1 justify-center">
          {Array.from({ length: wordLength }).map((_, i) => (
            <div
              key={`current-${i}`}
              className={`
                w-12 h-12 border-2 flex items-center justify-center text-lg font-bold rounded
                ${currentGuess[i] ? 'border-gray-500' : 'border-gray-300'}
              `}
            >
              {currentGuess[i] || ''}
            </div>
          ))}
        </div>
      )
    }
    
    // Render empty rows
    for (let i = guesses.length + (gameState === 'playing' ? 1 : 0); i < maxAttempts; i++) {
      rows.push(
        <div key={`empty-${i}`} className="flex gap-1 justify-center">
          {Array.from({ length: wordLength }).map((_, j) => (
            <div
              key={`${i}-${j}`}
              className="w-12 h-12 border-2 border-gray-300 rounded"
            />
          ))}
        </div>
      )
    }
    
    return rows
  }

  const renderKeyboard = () => {
    const rows = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
    ]
    
    return rows.map((row, i) => (
      <div key={i} className="flex gap-1 justify-center">
        {row.map(key => {
          const state = keyboard.get(key)
          return (
            <Button
              key={key}
              onClick={() => handleKeyPress(key)}
              variant="outline"
              size="sm"
              className={`
                ${key === 'ENTER' || key === 'BACKSPACE' ? 'px-3' : 'w-10'}
                ${state === 'correct' ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' :
                  state === 'present' ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500' :
                  state === 'absent' ? 'bg-gray-500 hover:bg-gray-600 text-white border-gray-500' :
                  ''}
              `}
            >
              {key === 'BACKSPACE' ? '←' : key}
            </Button>
          )
        })}
      </div>
    ))
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2">Wordle Clone</h1>
            <p className="text-muted-foreground">
              Guess the word in {maxAttempts} attempts!
            </p>
          </div>

          {/* Game Controls */}
          <div className="flex justify-center gap-4 mb-6">
            <Select value={difficulty} onValueChange={(v: any) => setDifficulty(v)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy (5)</SelectItem>
                <SelectItem value="medium">Medium (6)</SelectItem>
                <SelectItem value="hard">Hard (9)</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={startNewGame} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              New Game
            </Button>
            
            <Button onClick={() => setShowStats(!showStats)} variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Stats
            </Button>
            
            {gameState !== 'playing' && (
              <Button onClick={shareResults} variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            )}
          </div>

          {/* Game Info */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{formatTime(timeElapsed)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Attempt {guesses.length}/{maxAttempts}
              </span>
            </div>
            {stats.currentStreak > 0 && (
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">
                  Streak: {stats.currentStreak}
                </span>
              </div>
            )}
          </div>

          {/* Game Grid */}
          <Card className="mb-6">
            <CardContent className="py-6">
              <div className="space-y-2">
                {renderGrid()}
              </div>
            </CardContent>
          </Card>

          {/* Keyboard */}
          <Card>
            <CardContent className="py-4">
              <div className="space-y-2">
                {renderKeyboard()}
              </div>
            </CardContent>
          </Card>

          {/* Stats Modal */}
          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setShowStats(false)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Card className="w-96">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
                          <div className="text-sm text-muted-foreground">Played</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {stats.gamesPlayed > 0 
                              ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
                              : 0}%
                          </div>
                          <div className="text-sm text-muted-foreground">Win Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{stats.currentStreak}</div>
                          <div className="text-sm text-muted-foreground">Current Streak</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{stats.maxStreak}</div>
                          <div className="text-sm text-muted-foreground">Max Streak</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Guess Distribution</h4>
                        <div className="space-y-2">
                          {stats.guessDistribution.map((count, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="w-4 text-sm">{i + 1}</span>
                              <div className="flex-1 bg-gray-200 rounded">
                                <div
                                  className={`bg-primary h-6 rounded flex items-center justify-end px-2 transition-all`}
                                  style={{
                                    width: `${Math.max((count / Math.max(...stats.guessDistribution)) * 100, 10)}%`
                                  }}
                                >
                                  <span className="text-xs text-white font-medium">{count}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
