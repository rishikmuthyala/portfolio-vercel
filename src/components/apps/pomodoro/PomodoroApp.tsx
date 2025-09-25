"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Coffee,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  BarChart3
} from 'lucide-react'
import { toast } from 'sonner'

interface PomodoroSession {
  id: string
  type: 'focus' | 'short-break' | 'long-break'
  duration: number
  completedAt: Date
  interrupted: boolean
}

interface PomodoroStats {
  totalSessions: number
  focusSessions: number
  totalFocusTime: number
  averageSessionLength: number
  todaySessions: number
  weekSessions: number
  streak: number
}

export function PomodoroApp() {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<'focus' | 'short-break' | 'long-break'>('focus')
  const [sessionCount, setSessionCount] = useState(0)
  const [sessions, setSessions] = useState<PomodoroSession[]>([])
  const [settings, setSettings] = useState({
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    sessionsUntilLongBreak: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    notifications: true
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    loadData()
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now()
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handlePhaseComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  useEffect(() => {
    saveData()
  }, [sessions, settings])

  const loadData = () => {
    const savedSessions = localStorage.getItem('pomodoro-sessions')
    const savedSettings = localStorage.getItem('pomodoro-settings')
    
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions).map((s: any) => ({
        ...s,
        completedAt: new Date(s.completedAt)
      })))
    }
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }

  const saveData = () => {
    localStorage.setItem('pomodoro-sessions', JSON.stringify(sessions))
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings))
  }

  const handlePhaseComplete = () => {
    setIsRunning(false)
    
    // Save completed session
    const session: PomodoroSession = {
      id: Date.now().toString(),
      type: currentPhase,
      duration: getDurationForPhase(currentPhase),
      completedAt: new Date(),
      interrupted: false
    }
    
    setSessions(prev => [session, ...prev])
    
    // Show notification
    if (settings.notifications) {
      if (currentPhase === 'focus') {
        toast.success('Focus session completed! Time for a break.')
        setSessionCount(prev => prev + 1)
      } else {
        toast.success('Break finished! Ready for another focus session?')
      }
    }
    
    // Auto-advance to next phase
    const nextPhase = getNextPhase()
    setCurrentPhase(nextPhase)
    setTimeLeft(getDurationForPhase(nextPhase) * 60)
    
    // Auto-start if enabled
    if ((nextPhase !== 'focus' && settings.autoStartBreaks) || 
        (nextPhase === 'focus' && settings.autoStartPomodoros)) {
      setTimeout(() => setIsRunning(true), 1000)
    }
  }

  const getDurationForPhase = (phase: 'focus' | 'short-break' | 'long-break'): number => {
    switch (phase) {
      case 'focus': return settings.focusTime
      case 'short-break': return settings.shortBreakTime
      case 'long-break': return settings.longBreakTime
    }
  }

  const getNextPhase = (): 'focus' | 'short-break' | 'long-break' => {
    if (currentPhase === 'focus') {
      return (sessionCount + 1) % settings.sessionsUntilLongBreak === 0 
        ? 'long-break' 
        : 'short-break'
    }
    return 'focus'
  }

  const startTimer = () => {
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(getDurationForPhase(currentPhase) * 60)
  }

  const switchPhase = (phase: 'focus' | 'short-break' | 'long-break') => {
    setIsRunning(false)
    setCurrentPhase(phase)
    setTimeLeft(getDurationForPhase(phase) * 60)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getPhaseColor = (phase: string): string => {
    switch (phase) {
      case 'focus': return 'text-red-500'
      case 'short-break': return 'text-green-500'
      case 'long-break': return 'text-blue-500'
      default: return 'text-muted-foreground'
    }
  }

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'focus': return <Target className="w-4 h-4" />
      case 'short-break': return <Coffee className="w-4 h-4" />
      case 'long-break': return <Coffee className="w-4 h-4" />
      default: return <Timer className="w-4 h-4" />
    }
  }

  const calculateStats = (): PomodoroStats => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const focusSessions = sessions.filter(s => s.type === 'focus' && !s.interrupted)
    const todaySessions = focusSessions.filter(s => s.completedAt >= today)
    const weekSessions = focusSessions.filter(s => s.completedAt >= weekAgo)
    
    const totalFocusTime = focusSessions.reduce((sum, s) => sum + s.duration, 0)
    const averageSessionLength = focusSessions.length > 0 
      ? totalFocusTime / focusSessions.length 
      : 0
    
    // Calculate streak (simplified)
    let streak = 0
    const sortedSessions = [...focusSessions].sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
    
    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].completedAt)
      const daysDiff = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === i) {
        streak++
      } else {
        break
      }
    }
    
    return {
      totalSessions: sessions.length,
      focusSessions: focusSessions.length,
      totalFocusTime,
      averageSessionLength,
      todaySessions: todaySessions.length,
      weekSessions: weekSessions.length,
      streak
    }
  }

  const stats = calculateStats()
  const progress = ((getDurationForPhase(currentPhase) * 60 - timeLeft) / (getDurationForPhase(currentPhase) * 60)) * 100

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
            <Timer className="w-4 h-4 mr-2" />
            Pomodoro Timer
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Focus{' '}
            <span className="text-gradient">Timer</span>
          </h1>
          <p className="text-muted-foreground">
            Boost your productivity with the Pomodoro Technique
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timer Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass">
                <CardContent className="pt-8">
                  <div className="text-center">
                    {/* Phase Indicator */}
                    <div className="mb-6">
                      <Badge className={`${getPhaseColor(currentPhase)} text-lg px-4 py-2`}>
                        {getPhaseIcon(currentPhase)}
                        <span className="ml-2 capitalize">
                          {currentPhase === 'short-break' ? 'Short Break' :
                           currentPhase === 'long-break' ? 'Long Break' :
                           'Focus Time'}
                        </span>
                      </Badge>
                    </div>

                    {/* Timer Display */}
                    <div className="mb-8">
                      <div className="text-8xl sm:text-9xl font-mono font-bold mb-4">
                        {formatTime(timeLeft)}
                      </div>
                      <Progress value={progress} className="h-3 mb-4" />
                      <div className="text-sm text-muted-foreground">
                        Session {sessionCount + 1} • {Math.round(progress)}% complete
                      </div>
                    </div>

                    {/* Timer Controls */}
                    <div className="flex justify-center gap-4 mb-6">
                      <Button
                        size="lg"
                        onClick={isRunning ? pauseTimer : startTimer}
                        className="min-w-[120px]"
                      >
                        {isRunning ? (
                          <>
                            <Pause className="w-5 h-5 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5 mr-2" />
                            Start
                          </>
                        )}
                      </Button>
                      
                      <Button variant="outline" size="lg" onClick={resetTimer}>
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Reset
                      </Button>
                    </div>

                    {/* Phase Switcher */}
                    <div className="flex justify-center gap-2">
                      <Button
                        variant={currentPhase === 'focus' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => switchPhase('focus')}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Focus
                      </Button>
                      <Button
                        variant={currentPhase === 'short-break' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => switchPhase('short-break')}
                      >
                        <Coffee className="w-4 h-4 mr-2" />
                        Short Break
                      </Button>
                      <Button
                        variant={currentPhase === 'long-break' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => switchPhase('long-break')}
                      >
                        <Coffee className="w-4 h-4 mr-2" />
                        Long Break
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Session History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Recent Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  {sessions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Timer className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No sessions completed yet</p>
                      <p className="text-sm">Start your first pomodoro session!</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      <AnimatePresence>
                        {sessions.slice(0, 10).map((session) => (
                          <motion.div
                            key={session.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className={getPhaseColor(session.type)}>
                                {getPhaseIcon(session.type)}
                              </div>
                              <div>
                                <div className="font-medium text-sm capitalize">
                                  {session.type === 'short-break' ? 'Short Break' :
                                   session.type === 'long-break' ? 'Long Break' :
                                   'Focus Session'}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {session.duration} minutes
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground">
                                {session.completedAt.toLocaleTimeString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {session.completedAt.toLocaleDateString()}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Stats and Settings Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{stats.todaySessions}</div>
                      <div className="text-xs text-muted-foreground">Today</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{stats.weekSessions}</div>
                      <div className="text-xs text-muted-foreground">This Week</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Focus Sessions</span>
                      <span className="font-medium">{stats.focusSessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Focus Time</span>
                      <span className="font-medium">{Math.round(stats.totalFocusTime / 60)}h {stats.totalFocusTime % 60}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Session</span>
                      <span className="font-medium">{Math.round(stats.averageSessionLength)}min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Current Streak</span>
                      <span className="font-medium">{stats.streak} days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Focus Time (minutes)</label>
                    <input
                      type="number"
                      value={settings.focusTime}
                      onChange={(e) => setSettings(prev => ({ ...prev, focusTime: parseInt(e.target.value) || 25 }))}
                      className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm"
                      min="1"
                      max="60"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Short Break (minutes)</label>
                    <input
                      type="number"
                      value={settings.shortBreakTime}
                      onChange={(e) => setSettings(prev => ({ ...prev, shortBreakTime: parseInt(e.target.value) || 5 }))}
                      className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm"
                      min="1"
                      max="30"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Long Break (minutes)</label>
                    <input
                      type="number"
                      value={settings.longBreakTime}
                      onChange={(e) => setSettings(prev => ({ ...prev, longBreakTime: parseInt(e.target.value) || 15 }))}
                      className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm"
                      min="1"
                      max="60"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Long Break After</label>
                    <input
                      type="number"
                      value={settings.sessionsUntilLongBreak}
                      onChange={(e) => setSettings(prev => ({ ...prev, sessionsUntilLongBreak: parseInt(e.target.value) || 4 }))}
                      className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm"
                      min="2"
                      max="10"
                    />
                    <div className="text-xs text-muted-foreground mt-1">focus sessions</div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoStartBreaks}
                        onChange={(e) => setSettings(prev => ({ ...prev, autoStartBreaks: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Auto-start breaks</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoStartPomodoros}
                        onChange={(e) => setSettings(prev => ({ ...prev, autoStartPomodoros: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Auto-start focus sessions</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Show notifications</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
