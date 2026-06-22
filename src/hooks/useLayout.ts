import { useState } from 'react'

export type LayoutMode = 'mobile' | 'desktop'

export function useLayout() {
  const [mode, setModeState] = useState<LayoutMode>(() => {
    return (localStorage.getItem('layout-mode') as LayoutMode) ?? 'mobile'
  })

  const setMode = (m: LayoutMode) => {
    setModeState(m)
    localStorage.setItem('layout-mode', m)
  }

  return { mode, setMode }
}
