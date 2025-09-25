import { Metadata } from 'next'
import { ExpenseTrackerApp } from '@/components/apps/expenses/ExpenseTrackerApp'

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Track your expenses with visualizations and budget management.',
}

export default function ExpensesPage() {
  return <ExpenseTrackerApp />
}
