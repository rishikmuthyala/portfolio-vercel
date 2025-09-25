"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Edit, 
  Clock,
  Flag,
  Lightbulb,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  Brain
} from 'lucide-react'
import { toast } from 'sonner'

interface Todo {
  id: string
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  createdAt: Date
  completedAt?: Date
  dueDate?: Date
  aiGenerated?: boolean
}

interface ProductivityStats {
  totalTasks: number
  completedTasks: number
  completionRate: number
  streakDays: number
  averageCompletionTime: number
  mostProductiveHour: number
}

const categories = ['Personal', 'Work', 'Health', 'Learning', 'Creative', 'Social']

const aiSuggestions = [
  "Review and respond to important emails",
  "Take a 10-minute walk for mental clarity",
  "Organize your workspace for better productivity",
  "Plan tomorrow's priorities before ending today",
  "Drink a glass of water to stay hydrated",
  "Do a quick 5-minute meditation or breathing exercise",
  "Update your project status or progress tracker",
  "Read one article related to your field",
  "Backup important files or documents",
  "Reach out to a colleague or friend",
  "Clean and organize your digital desktop",
  "Review your weekly goals and adjust if needed",
  "Prepare healthy snacks for tomorrow",
  "Update your calendar with upcoming commitments",
  "Practice a skill you want to improve for 15 minutes"
]

export function TodoAIApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [newTodoCategory, setNewTodoCategory] = useState('Personal')
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [stats, setStats] = useState<ProductivityStats>({
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    streakDays: 0,
    averageCompletionTime: 0,
    mostProductiveHour: 9
  })

  useEffect(() => {
    loadTodos()
  }, [])

  useEffect(() => {
    saveTodos()
    calculateStats()
  }, [todos])

  const loadTodos = () => {
    const saved = localStorage.getItem('ai-todos')
    if (saved) {
      const parsedTodos = JSON.parse(saved).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      }))
      setTodos(parsedTodos)
    }
  }

  const saveTodos = () => {
    localStorage.setItem('ai-todos', JSON.stringify(todos))
  }

  const calculateStats = () => {
    const completed = todos.filter(t => t.completed)
    const total = todos.length
    const completionRate = total > 0 ? (completed.length / total) * 100 : 0
    
    // Calculate streak (simplified)
    const today = new Date()
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      return date.toDateString()
    })
    
    const completedByDay = completed.reduce((acc, todo) => {
      if (todo.completedAt) {
        const day = todo.completedAt.toDateString()
        acc[day] = (acc[day] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)
    
    let streak = 0
    for (const day of last7Days) {
      if (completedByDay[day]) {
        streak++
      } else {
        break
      }
    }
    
    // Calculate average completion time (simplified)
    const completionTimes = completed
      .filter(t => t.completedAt && t.createdAt)
      .map(t => t.completedAt!.getTime() - t.createdAt.getTime())
    
    const avgCompletionTime = completionTimes.length > 0 
      ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length / (1000 * 60 * 60)
      : 0
    
    // Most productive hour (simplified)
    const hourCounts = completed.reduce((acc, todo) => {
      if (todo.completedAt) {
        const hour = todo.completedAt.getHours()
        acc[hour] = (acc[hour] || 0) + 1
      }
      return acc
    }, {} as Record<number, number>)
    
    const mostProductiveHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '9'
    
    setStats({
      totalTasks: total,
      completedTasks: completed.length,
      completionRate,
      streakDays: streak,
      averageCompletionTime: avgCompletionTime,
      mostProductiveHour: parseInt(mostProductiveHour)
    })
  }

  const addTodo = () => {
    if (!newTodo.trim()) return
    
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      priority: newTodoPriority,
      category: newTodoCategory,
      createdAt: new Date(),
      aiGenerated: false
    }
    
    setTodos(prev => [todo, ...prev])
    setNewTodo('')
    toast.success('Todo added!')
  }

  const addAISuggestion = () => {
    const suggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)]
    const todo: Todo = {
      id: Date.now().toString(),
      text: suggestion,
      completed: false,
      priority: 'medium',
      category: 'Personal',
      createdAt: new Date(),
      aiGenerated: true
    }
    
    setTodos(prev => [todo, ...prev])
    toast.success('AI suggestion added!')
  }

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => {
      if (todo.id === id) {
        const updated = {
          ...todo,
          completed: !todo.completed,
          completedAt: !todo.completed ? new Date() : undefined
        }
        return updated
      }
      return todo
    }))
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
    toast.success('Todo deleted!')
  }

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = () => {
    if (!editText.trim()) return
    
    setTodos(prev => prev.map(todo =>
      todo.id === editingId ? { ...todo, text: editText.trim() } : todo
    ))
    setEditingId(null)
    setEditText('')
    toast.success('Todo updated!')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed))
    toast.success('Completed todos cleared!')
  }

  const filteredTodos = todos.filter(todo => {
    const statusFilter = filter === 'all' || 
                        (filter === 'active' && !todo.completed) ||
                        (filter === 'completed' && todo.completed)
    
    const catFilter = categoryFilter === 'all' || todo.category === categoryFilter
    
    return statusFilter && catFilter
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-muted-foreground'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Flag className="w-4 h-4" />
      case 'medium': return <Clock className="w-4 h-4" />
      case 'low': return <Target className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
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
            <Brain className="w-4 h-4 mr-2" />
            AI-Powered Todo
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Smart{' '}
            <span className="text-gradient">Todo List</span>
          </h1>
          <p className="text-muted-foreground">
            Intelligent task management with AI suggestions and productivity insights
          </p>
        </motion.div>

        {/* Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{stats.completedTasks}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{Math.round(stats.completionRate)}%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.streakDays}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.mostProductiveHour}:00</div>
                  <div className="text-sm text-muted-foreground">Peak Hour</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Todo List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Tasks</CardTitle>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={addAISuggestion}>
                        <Lightbulb className="w-4 h-4 mr-2" />
                        AI Suggest
                      </Button>
                      <Button size="sm" onClick={clearCompleted}>
                        Clear Done
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Add Todo Form */}
                  <div className="space-y-4 mb-6">
                    <div className="flex gap-2">
                      <Input
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Add a new task..."
                        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                        className="flex-1"
                      />
                      <Button onClick={addTodo}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <select
                        value={newTodoCategory}
                        onChange={(e) => setNewTodoCategory(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-background text-sm"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      
                      <select
                        value={newTodoPriority}
                        onChange={(e) => setNewTodoPriority(e.target.value as any)}
                        className="px-3 py-2 border rounded-md bg-background text-sm"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                  </div>

                  {/* Filters */}
                  <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="mb-4">
                    <TabsList>
                      <TabsTrigger value="all">All ({todos.length})</TabsTrigger>
                      <TabsTrigger value="active">Active ({todos.filter(t => !t.completed).length})</TabsTrigger>
                      <TabsTrigger value="completed">Done ({todos.filter(t => t.completed).length})</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="mb-4">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-3 py-2 border rounded-md bg-background text-sm"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{Math.round(stats.completionRate)}% Complete</span>
                    </div>
                    <Progress value={stats.completionRate} className="h-2" />
                  </div>

                  {/* Todo List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    <AnimatePresence>
                      {filteredTodos.map((todo) => (
                        <motion.div
                          key={todo.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`p-3 border rounded-lg transition-all ${
                            todo.completed ? 'bg-muted/50 opacity-75' : 'bg-background'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleTodo(todo.id)}
                              className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                todo.completed 
                                  ? 'bg-primary border-primary text-primary-foreground' 
                                  : 'border-muted-foreground hover:border-primary'
                              }`}
                            >
                              {todo.completed && <CheckSquare className="w-3 h-3" />}
                            </button>
                            
                            <div className="flex-1 min-w-0">
                              {editingId === todo.id ? (
                                <div className="flex gap-2">
                                  <Input
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="flex-1"
                                    onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                                  />
                                  <Button size="sm" onClick={saveEdit}>Save</Button>
                                  <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
                                </div>
                              ) : (
                                <>
                                  <div className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                                    {todo.text}
                                    {todo.aiGenerated && (
                                      <Badge variant="secondary" className="ml-2 text-xs">
                                        <Brain className="w-3 h-3 mr-1" />
                                        AI
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {todo.category}
                                    </Badge>
                                    <div className={`flex items-center gap-1 text-xs ${getPriorityColor(todo.priority)}`}>
                                      {getPriorityIcon(todo.priority)}
                                      {todo.priority}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {todo.createdAt.toLocaleDateString()}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            {editingId !== todo.id && (
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEdit(todo)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteTodo(todo.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {filteredTodos.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No tasks found</p>
                        <p className="text-sm">Add a task or try an AI suggestion</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Productivity Tip</h4>
                    <p className="text-sm text-muted-foreground">
                      Your most productive hour is {stats.mostProductiveHour}:00. Try scheduling important tasks during this time.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Achievement</h4>
                    <p className="text-sm text-muted-foreground">
                      Great job! You've completed {stats.completedTasks} tasks with a {Math.round(stats.completionRate)}% success rate.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Suggestion</h4>
                    <p className="text-sm text-muted-foreground">
                      Consider breaking down high-priority tasks into smaller, manageable steps for better completion rates.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={addAISuggestion}>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Get AI Suggestion
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={clearCompleted}>
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Clear Completed
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Tasks
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
