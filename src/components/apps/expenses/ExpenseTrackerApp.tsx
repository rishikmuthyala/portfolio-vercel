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
  DollarSign, 
  Plus, 
  Trash2, 
  Edit, 
  TrendingUp,
  TrendingDown,
  PieChart,
  Calendar,
  Filter,
  Download,
  Target,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: Date
  type: 'expense' | 'income'
}

interface Budget {
  category: string
  limit: number
  spent: number
}

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Other'
]

const incomeCategories = [
  'Salary',
  'Freelance',
  'Investment',
  'Business',
  'Gift',
  'Other'
]

export function ExpenseTrackerApp() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [newExpense, setNewExpense] = useState({
    amount: '',
    description: '',
    category: categories[0],
    type: 'expense' as 'expense' | 'income'
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filter, setFilter] = useState({
    category: 'all',
    type: 'all',
    dateRange: 'month'
  })
  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [newBudget, setNewBudget] = useState({
    category: categories[0],
    limit: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    saveData()
    updateBudgetSpent()
  }, [expenses])

  const loadData = () => {
    const savedExpenses = localStorage.getItem('expense-tracker-expenses')
    const savedBudgets = localStorage.getItem('expense-tracker-budgets')
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses).map((e: any) => ({
        ...e,
        date: new Date(e.date)
      })))
    }
    
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets))
    }
  }

  const saveData = () => {
    localStorage.setItem('expense-tracker-expenses', JSON.stringify(expenses))
    localStorage.setItem('expense-tracker-budgets', JSON.stringify(budgets))
  }

  const updateBudgetSpent = () => {
    setBudgets(prev => prev.map(budget => {
      const spent = expenses
        .filter(e => e.category === budget.category && e.type === 'expense')
        .reduce((sum, e) => sum + e.amount, 0)
      return { ...budget, spent }
    }))
  }

  const addExpense = () => {
    if (!newExpense.amount || !newExpense.description) {
      toast.error('Please fill in all required fields')
      return
    }

    const expense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      category: newExpense.category,
      date: new Date(),
      type: newExpense.type
    }

    setExpenses(prev => [expense, ...prev])
    setNewExpense({
      amount: '',
      description: '',
      category: newExpense.type === 'expense' ? categories[0] : incomeCategories[0],
      type: newExpense.type
    })
    
    toast.success(`${newExpense.type === 'expense' ? 'Expense' : 'Income'} added successfully!`)
  }

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
    toast.success('Entry deleted!')
  }

  const addBudget = () => {
    if (!newBudget.limit || !newBudget.category) {
      toast.error('Please fill in all fields')
      return
    }

    const budget: Budget = {
      category: newBudget.category,
      limit: parseFloat(newBudget.limit),
      spent: 0
    }

    setBudgets(prev => [...prev, budget])
    setNewBudget({ category: categories[0], limit: '' })
    setShowBudgetForm(false)
    toast.success('Budget added!')
  }

  const deleteBudget = (category: string) => {
    setBudgets(prev => prev.filter(b => b.category !== category))
    toast.success('Budget removed!')
  }

  const getFilteredExpenses = () => {
    let filtered = expenses

    if (filter.category !== 'all') {
      filtered = filtered.filter(e => e.category === filter.category)
    }

    if (filter.type !== 'all') {
      filtered = filtered.filter(e => e.type === filter.type)
    }

    if (filter.dateRange === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(e => e.date >= weekAgo)
    } else if (filter.dateRange === 'month') {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(e => e.date >= monthAgo)
    }

    return filtered
  }

  const calculateStats = () => {
    const filtered = getFilteredExpenses()
    const totalExpenses = filtered.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0)
    const totalIncome = filtered.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0)
    const balance = totalIncome - totalExpenses
    
    const categoryTotals = categories.map(category => ({
      category,
      amount: filtered.filter(e => e.category === category && e.type === 'expense').reduce((sum, e) => sum + e.amount, 0)
    })).filter(c => c.amount > 0)

    return { totalExpenses, totalIncome, balance, categoryTotals }
  }

  const exportData = () => {
    const data = {
      expenses,
      budgets,
      exportDate: new Date().toISOString(),
      stats: calculateStats()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'expense-tracker-data.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Data exported successfully!')
  }

  const stats = calculateStats()
  const filteredExpenses = getFilteredExpenses()

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
            <DollarSign className="w-4 h-4 mr-2" />
            Expense Tracker
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Expense{' '}
            <span className="text-gradient">Tracker</span>
          </h1>
          <p className="text-muted-foreground">
            Track your expenses and manage your budget with detailed insights
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-green-500">${stats.totalIncome.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Total Income</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <div>
                  <div className="text-2xl font-bold text-red-500">${stats.totalExpenses.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Total Expenses</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <DollarSign className={`w-5 h-5 ${stats.balance >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                <div>
                  <div className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${Math.abs(stats.balance).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stats.balance >= 0 ? 'Surplus' : 'Deficit'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{filteredExpenses.length}</div>
                  <div className="text-sm text-muted-foreground">Transactions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Transaction Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Add Transaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button
                        variant={newExpense.type === 'expense' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewExpense(prev => ({ 
                          ...prev, 
                          type: 'expense',
                          category: categories[0]
                        }))}
                      >
                        <TrendingDown className="w-4 h-4 mr-2" />
                        Expense
                      </Button>
                      <Button
                        variant={newExpense.type === 'income' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNewExpense(prev => ({ 
                          ...prev, 
                          type: 'income',
                          category: incomeCategories[0]
                        }))}
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Income
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                      />
                      <select
                        value={newExpense.category}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                        className="px-3 py-2 border rounded-md bg-background"
                      >
                        {(newExpense.type === 'expense' ? categories : incomeCategories).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <Input
                      placeholder="Description"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                    />

                    <Button onClick={addExpense} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add {newExpense.type === 'expense' ? 'Expense' : 'Income'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Transactions List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Transactions</CardTitle>
                    <div className="flex gap-2">
                      <select
                        value={filter.type}
                        onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
                        className="px-3 py-2 border rounded-md bg-background text-sm"
                      >
                        <option value="all">All Types</option>
                        <option value="expense">Expenses</option>
                        <option value="income">Income</option>
                      </select>
                      <select
                        value={filter.dateRange}
                        onChange={(e) => setFilter(prev => ({ ...prev, dateRange: e.target.value }))}
                        className="px-3 py-2 border rounded-md bg-background text-sm"
                      >
                        <option value="all">All Time</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                      </select>
                      <Button variant="outline" size="sm" onClick={exportData}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredExpenses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No transactions found</p>
                      <p className="text-sm">Add your first transaction above</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      <AnimatePresence>
                        {filteredExpenses.map((expense) => (
                          <motion.div
                            key={expense.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                expense.type === 'expense' ? 'bg-red-500' : 'bg-green-500'
                              }`} />
                              <div>
                                <div className="font-medium">{expense.description}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                  <span>{expense.category}</span>
                                  <span>•</span>
                                  <span>{expense.date.toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`font-bold ${
                                expense.type === 'expense' ? 'text-red-500' : 'text-green-500'
                              }`}>
                                {expense.type === 'expense' ? '-' : '+'}${expense.amount.toFixed(2)}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteExpense(expense.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Spending by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.categoryTotals.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <PieChart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No expenses to show</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {stats.categoryTotals.map((cat) => (
                        <div key={cat.category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{cat.category}</span>
                            <span className="font-medium">${cat.amount.toFixed(2)}</span>
                          </div>
                          <Progress 
                            value={(cat.amount / stats.totalExpenses) * 100} 
                            className="h-2" 
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Budget Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Card className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Budgets
                    </CardTitle>
                    <Button size="sm" onClick={() => setShowBudgetForm(!showBudgetForm)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showBudgetForm && (
                    <div className="space-y-3 mb-4 p-3 bg-muted/30 rounded-lg">
                      <select
                        value={newBudget.category}
                        onChange={(e) => setNewBudget(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                      >
                        {categories.filter(cat => !budgets.find(b => b.category === cat)).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <Input
                        type="number"
                        placeholder="Budget limit"
                        value={newBudget.limit}
                        onChange={(e) => setNewBudget(prev => ({ ...prev, limit: e.target.value }))}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={addBudget}>Add</Button>
                        <Button size="sm" variant="outline" onClick={() => setShowBudgetForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {budgets.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No budgets set</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {budgets.map((budget) => {
                        const percentage = (budget.spent / budget.limit) * 100
                        const isOverBudget = percentage > 100
                        
                        return (
                          <div key={budget.category} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{budget.category}</span>
                              <div className="flex items-center gap-2">
                                {isOverBudget && (
                                  <AlertTriangle className="w-4 h-4 text-red-500" />
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteBudget(budget.category)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>${budget.spent.toFixed(2)} spent</span>
                              <span>${budget.limit.toFixed(2)} limit</span>
                            </div>
                            <Progress 
                              value={Math.min(percentage, 100)} 
                              className="h-2"
                            />
                            {isOverBudget && (
                              <div className="text-xs text-red-500">
                                Over budget by ${(budget.spent - budget.limit).toFixed(2)}
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
          </div>
        </div>
      </div>
    </div>
  )
}
