import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export type Category = 'obvs' | 'lps' | 'bookpoints'
export type Tab = 'dashboard' | Category | 'projects' | 'profile'

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
  projectId?: string
  // OBV-specific fields
  tipo?: ObvTipo
  persona?: string
  fecha?: string
  notas?: string
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

const emptyStore: Store = { obvs: [], lps: [], bookpoints: [], projects: [] }

// --- DB row types ---
interface DbTask {
  id: string
  category: string
  text: string
  done: boolean
  created_at: string
  done_at: string | null
  project_id: string | null
  tipo: string | null
  persona: string | null
  fecha: string | null
  notas: string | null
}

interface DbProject {
  id: string
  name: string
  color: string
  emoji: string
  description: string
  created_at: string
}

// --- Conversion helpers ---
function dbToTask(row: DbTask): Task {
  return {
    id: row.id,
    text: row.text,
    done: row.done,
    createdAt: new Date(row.created_at).getTime(),
    doneAt: row.done_at ? new Date(row.done_at).getTime() : undefined,
    projectId: row.project_id ?? undefined,
    tipo: (row.tipo as ObvTipo) ?? undefined,
    persona: row.persona ?? undefined,
    fecha: row.fecha ?? undefined,
    notas: row.notas ?? undefined,
  }
}

function dbToProject(row: DbProject): Project {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    emoji: row.emoji,
    description: row.description,
    createdAt: new Date(row.created_at).getTime(),
  }
}

// --- Hook ---
export function useStore(userId: string) {
  const [store, setStore] = useState<Store>(emptyStore)
  const [loading, setLoading] = useState(true)

  // Load all data for this user on mount
  useEffect(() => {
    setLoading(true)
    Promise.all([
      supabase
        .from('organizer_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at'),
      supabase
        .from('organizer_projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at'),
    ]).then(([{ data: tasks }, { data: projects }]) => {
      const rows = (tasks ?? []) as DbTask[]
      setStore({
        obvs: rows.filter(r => r.category === 'obvs').map(dbToTask),
        lps: rows.filter(r => r.category === 'lps').map(dbToTask),
        bookpoints: rows.filter(r => r.category === 'bookpoints').map(dbToTask),
        projects: ((projects ?? []) as DbProject[]).map(dbToProject),
      })
      setLoading(false)
    })
  }, [userId])

  // --- Task mutations ---

  const addTask = async (cat: Category, task: Omit<Task, 'id' | 'createdAt'>) => {
    const trimmed = task.text.trim()
    if (!trimmed) return

    // Optimistic update with temp ID
    const tempId = `temp-${Date.now()}`
    const optimistic: Task = { ...task, text: trimmed, id: tempId, createdAt: Date.now() }
    setStore(s => ({ ...s, [cat]: [...s[cat], optimistic] }))

    const { data, error } = await supabase
      .from('organizer_tasks')
      .insert({
        user_id: userId,
        category: cat,
        text: trimmed,
        done: task.done,
        project_id: task.projectId ?? null,
        tipo: task.tipo ?? null,
        persona: task.persona ?? null,
        fecha: task.fecha ?? null,
        notas: task.notas ?? null,
      })
      .select()
      .single()

    if (error || !data) {
      // Rollback on error
      setStore(s => ({ ...s, [cat]: s[cat].filter(t => t.id !== tempId) }))
      return
    }

    // Replace temp ID with real DB id
    setStore(s => ({
      ...s,
      [cat]: s[cat].map(t => (t.id === tempId ? dbToTask(data as DbTask) : t)),
    }))
  }

  const toggleTask = async (cat: Category, id: string) => {
    const task = store[cat].find(t => t.id === id)
    if (!task) return

    const newDone = !task.done
    const doneAt = newDone ? Date.now() : undefined

    // Optimistic update
    setStore(s => ({
      ...s,
      [cat]: s[cat].map(t => (t.id === id ? { ...t, done: newDone, doneAt } : t)),
    }))

    await supabase
      .from('organizer_tasks')
      .update({
        done: newDone,
        done_at: doneAt ? new Date(doneAt).toISOString() : null,
      })
      .eq('id', id)
  }

  const deleteTask = async (cat: Category, id: string) => {
    // Optimistic remove
    setStore(s => ({ ...s, [cat]: s[cat].filter(t => t.id !== id) }))
    await supabase.from('organizer_tasks').delete().eq('id', id)
  }

  // --- Project mutations ---

  const addProject = async (project: Omit<Project, 'id' | 'createdAt'>) => {
    const tempId = `proj-temp-${Date.now()}`
    const optimistic: Project = { ...project, id: tempId, createdAt: Date.now() }
    setStore(s => ({ ...s, projects: [...s.projects, optimistic] }))

    const { data, error } = await supabase
      .from('organizer_projects')
      .insert({ user_id: userId, ...project })
      .select()
      .single()

    if (error || !data) {
      setStore(s => ({ ...s, projects: s.projects.filter(p => p.id !== tempId) }))
      return
    }

    setStore(s => ({
      ...s,
      projects: s.projects.map(p => (p.id === tempId ? dbToProject(data as DbProject) : p)),
    }))
  }

  const deleteProject = async (id: string) => {
    setStore(s => ({ ...s, projects: s.projects.filter(p => p.id !== id) }))
    await supabase.from('organizer_projects').delete().eq('id', id)
  }

  const updateProject = async (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    setStore(s => ({
      ...s,
      projects: s.projects.map(p => (p.id === id ? { ...p, ...updates } : p)),
    }))
    await supabase.from('organizer_projects').update(updates).eq('id', id)
  }

  // --- Computed values ---

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
    loading,
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
