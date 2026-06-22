import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Category, CATEGORIES } from '../../hooks/useStore'
import type { LayoutMode } from '../../hooks/useLayout'

interface Props {
  user: User
  progress: Record<Category, { done: number; total: number }>
  totalDone: number
  totalGoal: number
  layoutMode: LayoutMode
  onSetLayout: (mode: LayoutMode) => void
  onSignOut: () => void
  onUpdateName: (name: string) => Promise<{ error: string | null }>
}

export function ProfileView({
  user,
  progress,
  totalDone,
  totalGoal,
  layoutMode,
  onSetLayout,
  onSignOut,
  onUpdateName,
}: Props) {
  const displayName = (user.user_metadata?.full_name as string) || ''
  const email = user.email ?? ''
  const initials = displayName
    ? displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : (email[0]?.toUpperCase() ?? '?')

  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState(displayName)
  const [saving, setSaving] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)

  const saveName = async () => {
    if (!nameInput.trim()) { setNameError('El nombre no puede estar vacío'); return }
    setSaving(true)
    setNameError(null)
    const { error } = await onUpdateName(nameInput)
    setSaving(false)
    if (error) { setNameError(error); return }
    setEditing(false)
  }

  return (
    <div style={{ padding: '20px 20px 48px' }}>
      {/* Avatar + identity */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          paddingTop: 16,
          marginBottom: 36,
        }}
      >
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #0284c7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
            fontWeight: 900,
            color: '#fff',
            boxShadow: '0 0 36px rgba(124,58,237,0.45)',
            letterSpacing: '-0.02em',
          }}
        >
          {initials}
        </div>

        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                value={nameInput}
                onChange={e => { setNameInput(e.target.value); setNameError(null) }}
                onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditing(false) }}
                autoFocus
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1.5px solid rgba(124,58,237,0.5)',
                  borderRadius: 11,
                  padding: '9px 14px',
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#f0f0ff',
                  outline: 'none',
                  textAlign: 'center',
                  fontFamily: 'inherit',
                  minWidth: 180,
                }}
              />
              <button
                onClick={saveName}
                disabled={saving}
                style={{
                  background: '#7c3aed',
                  border: 'none',
                  borderRadius: 9,
                  padding: '9px 14px',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: saving ? 'default' : 'pointer',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              >
                {saving ? '…' : '✓'}
              </button>
              <button
                onClick={() => { setEditing(false); setNameError(null) }}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: 'none',
                  borderRadius: 9,
                  padding: '9px 14px',
                  color: 'rgba(240,240,255,0.45)',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              >
                ✕
              </button>
            </div>
            {nameError && (
              <p style={{ margin: 0, fontSize: 12, color: '#f87171' }}>{nameError}</p>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => { setEditing(true); setNameInput(displayName) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span style={{ fontSize: 22, fontWeight: 800, color: '#f0f0ff', letterSpacing: '-0.02em' }}>
                {displayName || 'Añadir nombre'}
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="rgba(240,240,255,0.3)" strokeWidth="2" strokeLinecap="round" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="rgba(240,240,255,0.3)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(240,240,255,0.4)' }}>
              {email}
            </p>
          </div>
        )}
      </div>

      {/* Progress stats */}
      <section style={{ marginBottom: 28 }}>
        <p style={sectionLabel}>Tu progreso</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div
            style={{
              borderRadius: 16,
              padding: '16px 20px',
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(124,58,237,0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 13, color: 'rgba(240,240,255,0.55)', fontWeight: 600 }}>
              Total completado
            </span>
            <span
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: '#a78bfa',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {totalDone}
              <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(240,240,255,0.3)' }}>
                /{totalGoal}
              </span>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {CATEGORIES.map(cat => {
              const { done, total } = progress[cat.key]
              return (
                <div
                  key={cat.key}
                  style={{
                    borderRadius: 14,
                    padding: '14px 10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${cat.color}20`,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 10, color: 'rgba(240,240,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 6 }}>
                    {cat.label}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: cat.colorLight, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                    {done}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(240,240,255,0.3)', marginTop: 2 }}>
                    de {total}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Layout toggle */}
      <section style={{ marginBottom: 28 }}>
        <p style={sectionLabel}>Vista preferida</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {(['mobile', 'desktop'] as LayoutMode[]).map(m => {
            const isSelected = layoutMode === m
            return (
              <button
                key={m}
                onClick={() => onSetLayout(m)}
                style={{
                  borderRadius: 14,
                  padding: '16px 12px',
                  background: isSelected ? 'rgba(124,58,237,0.16)' : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${isSelected ? 'rgba(124,58,237,0.45)' : 'rgba(255,255,255,0.07)'}`,
                  cursor: 'pointer',
                  outline: 'none',
                  color: isSelected ? '#a78bfa' : 'rgba(240,240,255,0.45)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 9,
                  transition: 'all 0.2s',
                  fontWeight: 700,
                  fontSize: 13,
                  WebkitTapHighlightColor: 'transparent',
                  fontFamily: 'inherit',
                }}
                onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
                onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {m === 'mobile' ? (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="7" y="2" width="10" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="12" cy="18.5" r="1" fill="currentColor" />
                  </svg>
                ) : (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="2" y="4" width="20" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                )}
                {m === 'mobile' ? 'Móvil' : 'Escritorio'}
              </button>
            )
          })}
        </div>
        <p style={{ margin: '10px 0 0', fontSize: 12, color: 'rgba(240,240,255,0.28)', lineHeight: 1.5 }}>
          El cambio se aplica inmediatamente y se recuerda en este dispositivo.
        </p>
      </section>

      {/* Sign out */}
      <button
        onClick={onSignOut}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: 14,
          border: '1px solid rgba(248,113,113,0.2)',
          background: 'rgba(248,113,113,0.06)',
          color: '#f87171',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
          transition: 'all 0.2s',
          fontFamily: 'inherit',
        }}
        onPointerDown={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.12)')}
        onPointerUp={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.06)')}
        onPointerLeave={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.06)')}
      >
        Cerrar sesión
      </button>
    </div>
  )
}

const sectionLabel: React.CSSProperties = {
  margin: '0 0 12px',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(240,240,255,0.35)',
}
