import { useState, useEffect } from 'react'

export type Category = 'obvs' | 'lps' | 'bookpoints'
export type Tab = 'dashboard' | Category

export interface Task {
  id: string
  text: string
  done: boolean
  createdAt: number
  doneAt?: number
}

export interface CategoryConfig {
  key: Category
  label: string
  labelLong: string
  goal: number
  color: string
  colorLight: string
  colorGlow: string
  emoji: string
}

export const CATEGORIES: CategoryConfig[] = [
  {
    key: 'obvs',
    label: 'OBVs',
    labelLong: 'Observaciones',
    goal: 50,
    color: '#8b5cf6',
    colorLight: '#c4b5fd',
    colorGlow: 'rgba(139, 92, 246, 0.35)',
    emoji: '👁',
  },
  {
    key: 'lps',
    label: 'LPs',
    labelLong: 'Learning Points',
    goal: 4,
    color: '#06b6d4',
    colorLight: '#67e8f9',
    colorGlow: 'rgba(6, 182, 212, 0.35)',
    emoji: '📋',
  },
  {
    key: 'bookpoints',
    label: 'Bookpoints',
    labelLong: 'Bookpoints',
    goal: 10,
    color: '#f97316',
    colorLight: '#fdba74',
    colorGlow: 'rgba(249, 115, 22, 0.35)',
    emoji: '📚',
  },
]

export interface Store {
  obvs: Task[]
  lps: Task[]
  bookpoints: Task[]
}

export const DEADLINE = new Date('2026-09-01T00:00:00')

const defaultStore: Store = { obvs: [], lps: [], bookpoints: [] }

function loadStore(): Store {
  try {
    const raw = localStorage.getItem('organizer-v1')
    if (!raw) return defaultStore
    const parsed = JSON.parse(raw) as Partial<Store>
    return {
      obvs: parsed.obvs ?? [],
      lps: parsed.lps ?? [],
      bookpoints: parsed.bookpoints ?? [],
    }
  } catch {
    return defaultStore
  }
}

export function useStore() {
  const [store, setStore] = useState<Store>(loadStore)

  useEffect(() => {
    localStorage.setItem('organizer-v1', JSON.stringify(store))
  }, [store])

  const addTask = (cat: Category, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setStore(s => ({
      ...s,
      [cat]: [
        ...s[cat],
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          text: trimmed,
          done: false,
          createdAt: Date.now(),
        },
      ],
    }))
  }

  const toggleTask = (cat: Category, id: string) => {
    setStore(s => ({
      ...s,
      [cat]: s[cat].map(t =>
        t.id === id
          ? { ...t, done: !t.done, doneAt: !t.done ? Date.now() : undefined }
          : t
      ),
    }))
  }

  const deleteTask = (cat: Category, id: string) => {
    setStore(s => ({ ...s, [cat]: s[cat].filter(t => t.id !== id) }))
  }

  const daysLeft = Math.max(
    0,
    Math.ceil((DEADLINE.getTime() - Date.now()) / 86_400_000)
  )

  const progress = Object.fromEntries(
    CATEGORIES.map(({ key, goal }) => [
      key,
      { done: store[key].filter(t => t.done).length, total: goal },
    ])
  ) as Record<Category, { done: number; total: number }>

  const totalDone = CATEGORIES.reduce(
    (sum, { key }) => sum + store[key].filter(t => t.done).length,
    0
  )
  const totalGoal = CATEGORIES.reduce((sum, { goal }) => sum + goal, 0)

  return { store, addTask, toggleTask, deleteTask, daysLeft, progress, totalDone, totalGoal }
}
