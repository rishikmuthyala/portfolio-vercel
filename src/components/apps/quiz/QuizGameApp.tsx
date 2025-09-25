"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Trophy, 
  Target, 
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Play,
  Pause,
  Star
} from 'lucide-react'
import { toast } from 'sonner'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  explanation: string
}

interface QuizSession {
  id: string
  score: number
  totalQuestions: number
  category: string
  difficulty: string
  completedAt: Date
  timeSpent: number
}

const quizQuestions: Question[] = [
  {
    id: '1',
    question: 'Which of the following is NOT a JavaScript data type?',
    options: ['String', 'Boolean', 'Float', 'Symbol'],
    correctAnswer: 2,
    category: 'JavaScript',
    difficulty: 'easy',
    explanation: 'JavaScript has Number type instead of separate Integer and Float types.'
  },
  {
    id: '2',
    question: 'What does CSS stand for?',
    options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
    correctAnswer: 1,
    category: 'CSS',
    difficulty: 'easy',
    explanation: 'CSS stands for Cascading Style Sheets, used for styling web pages.'
  },
  {
    id: '3',
    question: 'Which React hook is used for managing component state?',
    options: ['useEffect', 'useState', 'useContext', 'useCallback'],
    correctAnswer: 1,
    category: 'React',
    difficulty: 'medium',
    explanation: 'useState is the primary hook for managing local component state in React.'
  },
  {
    id: '4',
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctAnswer: 1,
    category: 'Algorithms',
    difficulty: 'medium',
    explanation: 'Binary search has O(log n) time complexity as it eliminates half the search space in each iteration.'
  },
  {
    id: '5',
    question: 'Which HTTP status code indicates a successful request?',
    options: ['404', '500', '200', '301'],
    correctAnswer: 2,
    category: 'Web Development',
    difficulty: 'easy',
    explanation: '200 OK indicates that the request was successful.'
  },
  {
    id: '6',
    question: 'In Python, which keyword is used to create a function?',
    options: ['function', 'def', 'create', 'func'],
    correctAnswer: 1,
    category: 'Python',
    difficulty: 'easy',
    explanation: 'The "def" keyword is used to define functions in Python.'
  },
  {
    id: '7',
    question: 'What does SQL stand for?',
    options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'Sequential Query Language'],
    correctAnswer: 0,
    category: 'Database',
    difficulty: 'easy',
    explanation: 'SQL stands for Structured Query Language, used for managing relational databases.'
  },
  {
    id: '8',
    question: 'Which design pattern ensures a class has only one instance?',
    options: ['Factory', 'Observer', 'Singleton', 'Strategy'],
    correctAnswer: 2,
    category: 'Design Patterns',
    difficulty: 'medium',
    explanation: 'The Singleton pattern restricts instantiation of a class to one single instance.'
  },
  {
    id: '9',
    question: 'What is the main purpose of Git?',
    options: ['Code compilation', 'Version control', 'Code execution', 'Database management'],
    correctAnswer: 1,
    category: 'Tools',
    difficulty: 'easy',
    explanation: 'Git is a distributed version control system for tracking changes in source code.'
  },
  {
    id: '10',
    question: 'Which of these is NOT a principle of Object-Oriented Programming?',
    options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Compilation'],
    correctAnswer: 3,
    category: 'Programming Concepts',
    difficulty: 'medium',
    explanation: 'The main OOP principles are Encapsulation, Inheritance, Polymorphism, and Abstraction.'
  }
]

const categories = [...new Set(quizQuestions.map(q => q.category))]
const difficulties = ['easy', 'medium', 'hard']

export function QuizGameApp() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameQuestions, setGameQuestions] = useState<Question[]>([])
  const [sessions, setSessions] = useState<QuizSession[]>([])
  const [settings, setSettings] = useState({
    category: 'All',
    difficulty: 'All',
    questionCount: 5,
    timePerQuestion: 30
  })
  const [startTime, setStartTime] = useState<Date | null>(null)

  useEffect(() => {
    loadSessions()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (gameState === 'playing' && !showAnswer && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameState, showAnswer, timeLeft])

  const loadSessions = () => {
    const saved = localStorage.getItem('quiz-sessions')
    if (saved) {
      setSessions(JSON.parse(saved).map((s: any) => ({
        ...s,
        completedAt: new Date(s.completedAt)
      })))
    }
  }

  const saveSessions = (newSessions: QuizSession[]) => {
    localStorage.setItem('quiz-sessions', JSON.stringify(newSessions))
    setSessions(newSessions)
  }

  const startQuiz = () => {
    let filteredQuestions = quizQuestions

    if (settings.category !== 'All') {
      filteredQuestions = filteredQuestions.filter(q => q.category === settings.category)
    }

    if (settings.difficulty !== 'All') {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === settings.difficulty)
    }

    // Shuffle and select questions
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(settings.questionCount, shuffled.length))

    if (selected.length === 0) {
      toast.error('No questions available for the selected criteria')
      return
    }

    setGameQuestions(selected)
    setGameState('playing')
    setCurrentQuestionIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowAnswer(false)
    setTimeLeft(settings.timePerQuestion)
    setStartTime(new Date())
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showAnswer) return
    
    setSelectedAnswer(answerIndex)
    setShowAnswer(true)
    
    const currentQuestion = gameQuestions[currentQuestionIndex]
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1)
    }
  }

  const handleTimeUp = () => {
    if (showAnswer) return
    
    setShowAnswer(true)
    setSelectedAnswer(null)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < gameQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowAnswer(false)
      setTimeLeft(settings.timePerQuestion)
    } else {
      finishQuiz()
    }
  }

  const finishQuiz = () => {
    const session: QuizSession = {
      id: Date.now().toString(),
      score,
      totalQuestions: gameQuestions.length,
      category: settings.category,
      difficulty: settings.difficulty,
      completedAt: new Date(),
      timeSpent: startTime ? Math.floor((Date.now() - startTime.getTime()) / 1000) : 0
    }

    const updatedSessions = [session, ...sessions]
    saveSessions(updatedSessions)
    setGameState('finished')
  }

  const resetQuiz = () => {
    setGameState('menu')
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowAnswer(false)
    setScore(0)
    setTimeLeft(30)
    setGameQuestions([])
  }

  const getScoreMessage = () => {
    const percentage = (score / gameQuestions.length) * 100
    if (percentage >= 90) return { message: 'Excellent! 🏆', color: 'text-yellow-500' }
    if (percentage >= 70) return { message: 'Great job! 🎉', color: 'text-green-500' }
    if (percentage >= 50) return { message: 'Good effort! 👍', color: 'text-blue-500' }
    return { message: 'Keep practicing! 💪', color: 'text-orange-500' }
  }

  const currentQuestion = gameQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / gameQuestions.length) * 100

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge variant="outline" className="mb-4">
              <Brain className="w-4 h-4 mr-2" />
              Tech Quiz
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Programming{' '}
              <span className="text-gradient">Quiz Game</span>
            </h1>
            <p className="text-muted-foreground">
              Test your programming knowledge with interactive quizzes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quiz Settings */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Quiz Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={settings.category}
                    onChange={(e) => setSettings(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Difficulty</label>
                  <select
                    value={settings.difficulty}
                    onChange={(e) => setSettings(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="All">All Difficulties</option>
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Number of Questions</label>
                  <select
                    value={settings.questionCount}
                    onChange={(e) => setSettings(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Time per Question (seconds)</label>
                  <select
                    value={settings.timePerQuestion}
                    onChange={(e) => setSettings(prev => ({ ...prev, timePerQuestion: parseInt(e.target.value) }))}
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                  >
                    <option value={15}>15 seconds</option>
                    <option value={30}>30 seconds</option>
                    <option value={60}>60 seconds</option>
                    <option value={0}>No time limit</option>
                  </select>
                </div>

                <Button onClick={startQuiz} size="lg" className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Start Quiz
                </Button>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No quiz sessions yet</p>
                    <p className="text-sm">Start your first quiz!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {sessions.slice(0, 5).map((session) => {
                      const percentage = (session.score / session.totalQuestions) * 100
                      return (
                        <div key={session.id} className="p-3 bg-muted/30 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <Trophy className="w-4 h-4 text-yellow-500" />
                              <span className="font-medium">
                                {session.score}/{session.totalQuestions}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {Math.round(percentage)}%
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {session.completedAt.toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {session.category} • {session.difficulty} • {session.timeSpent}s
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === 'finished') {
    const scoreMsg = getScoreMessage()
    
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="glass">
              <CardContent className="pt-8">
                <div className="text-center mb-8">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                  <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
                  <p className={`text-xl ${scoreMsg.color} mb-4`}>{scoreMsg.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-3xl font-bold text-primary">{score}</div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-3xl font-bold text-primary">
                      {Math.round((score / gameQuestions.length) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <div className="flex justify-between text-sm">
                    <span>Questions: {gameQuestions.length}</span>
                    <span>Time: {startTime ? Math.floor((Date.now() - startTime.getTime()) / 1000) : 0}s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Category: {settings.category}</span>
                    <span>Difficulty: {settings.difficulty}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={resetQuiz} variant="outline" className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    New Quiz
                  </Button>
                  <Button onClick={startQuiz} className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    Play Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <Badge variant="outline" className="mb-2">
                Question {currentQuestionIndex + 1} of {gameQuestions.length}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Score: {score}/{gameQuestions.length}
              </div>
            </div>
            
            {settings.timePerQuestion > 0 && (
              <div className="text-center">
                <div className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-primary'}`}>
                  {timeLeft}
                </div>
                <div className="text-xs text-muted-foreground">seconds</div>
              </div>
            )}
          </div>
          
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="glass mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {currentQuestion.category}
                  </Badge>
                  <Badge className={
                    currentQuestion.difficulty === 'easy' ? 'bg-green-500' :
                    currentQuestion.difficulty === 'medium' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }>
                    {currentQuestion.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    let buttonClass = 'w-full justify-start text-left h-auto p-4 '
                    
                    if (showAnswer) {
                      if (index === currentQuestion.correctAnswer) {
                        buttonClass += 'bg-green-500 hover:bg-green-600 text-white'
                      } else if (index === selectedAnswer) {
                        buttonClass += 'bg-red-500 hover:bg-red-600 text-white'
                      } else {
                        buttonClass += 'opacity-50'
                      }
                    } else if (selectedAnswer === index) {
                      buttonClass += 'bg-primary text-primary-foreground'
                    } else {
                      buttonClass += 'variant-outline'
                    }

                    return (
                      <Button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showAnswer}
                        className={buttonClass}
                        variant={showAnswer || selectedAnswer === index ? 'default' : 'outline'}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span>{option}</span>
                          {showAnswer && index === currentQuestion.correctAnswer && (
                            <CheckCircle className="w-5 h-5 ml-auto" />
                          )}
                          {showAnswer && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                            <XCircle className="w-5 h-5 ml-auto" />
                          )}
                        </div>
                      </Button>
                    )
                  })}
                </div>

                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-muted/30 rounded-lg"
                  >
                    <h4 className="font-medium mb-2">Explanation:</h4>
                    <p className="text-sm text-muted-foreground">
                      {currentQuestion.explanation}
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {showAnswer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <Button onClick={nextQuestion} size="lg">
                  {currentQuestionIndex < gameQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
