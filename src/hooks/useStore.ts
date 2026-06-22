import { useState, useEffect } from 'react'

export type Category = 'obvs' | 'lps' | 'bookpoints'
export type Tab = 'dashboard' | Category | 'projects'

export const OBV_TIPOS = [
  'No participante',
  'Participante',
  'Sistemática',
  'Ocasional',
  'Directa',
  'Indirecta',
] as const
export type ObvTipo = (typeof OBV_TIPOS)[number]

export const PROJECT_COLORS = [
  '#7c3aed',
  '#0ea5e9',
  '#059669',
  '#e11d48',
  '#d97706',
  '#4338ca',
  '#0d9488',
  '#9333ea',
] as const

export interface Task {
  id: string
  text: string
  done: boolean
  createdAt: number
  doneAt?: number
  // OBV-specific fields
  tipo?: ObvTipo
  persona?: string
  fecha?: string
  notas?: string
  projectId?: string
}

export interface Project {
  id: string
  name: string
  color: string
  emoji: string
  description: string
  createdAt: number
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
    color: '#7c3aed',
    colorLight: '#a78bfa',
    colorGlow: 'rgba(124,58,237,0.35)',
    emoji: '👁',
  },
  {
    key: 'lps',
    label: 'LPs',
    labelLong: 'Learning Points',
    goal: 4,
    color: '#0284c7',
    colorLight: '#38bdf8',
    colorGlow: 'rgba(2,132,199,0.35)',
    emoji: '📋',
  },
  {
    key: 'bookpoints',
    label: 'Bookpoints',
    labelLong: 'Bookpoints',
    goal: 10,
    color: '#c2410c',
    colorLight: '#fb923c',
    colorGlow: 'rgba(194,65,12,0.35)',
    emoji: '📚',
  },
]

export interface Store {
  obvs: Task[]
  lps: Task[]
  bookpoints: Task[]
  projects: Project[]
}

export const DEADLINE = new Date('2026-09-01T00:00:00')

const defaultStore: Store = { obvs: [], lps: [], bookpoints: [], projects: [] }

function loadStore(): Store {
  try {
    const raw = localStorage.getItem('organizer-v2')
    if (!raw) return defaultStore
    const parsed = JSON.parse(raw) as Partial<Store>
    return {
      obvs: parsed.obvs ?? [],
      lps: parsed.lps ?? [],
      bookpoints: parsed.bookpoints ?? [],
      projects: parsed.projects ?? [],
    }
  } catch {
    return defaultStore
  }
}

export function useStore() {
  const [store, setStore] = useState<Store>(loadStore)

  useEffect(() => {
    localStorage.setItem('organizer-v2', JSON.stringify(store))
  }, [store])

  const addTask = (cat: Category, task: Omit<Task, 'id' | 'createdAt'>) => {
    const trimmed = task.text.trim()
    if (!trimmed) return
    setStore(s => ({
      ...s,
      [cat]: [
        ...s[cat],
        {
          ...task,
          text: trimmed,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
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

  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    setStore(s => ({
      ...s,
      projects: [
        ...s.projects,
        {
          ...project,
          id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: Date.now(),
        },
      ],
    }))
  }

  const deleteProject = (id: string) => {
    setStore(s => ({ ...s, projects: s.projects.filter(p => p.id !== id) }))
  }

  const updateProject = (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    setStore(s => ({
      ...s,
      projects: s.projects.map(p => (p.id === id ? { ...p, ...updates } : p)),
    }))
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

  return {
    store,
    addTask,
    toggleTask,
    deleteTask,
    addProject,
    deleteProject,
    updateProject,
    daysLeft,
    progress,
    totalDone,
    totalGoal,
  }
}
