import { useState } from 'react'
import { Task, Project } from '../../hooks/useStore'

interface Props {
  task: Task
  index: number
  projects: Project[]
  onToggle: () => void
  onDelete: () => void
}

const COLOR = '#7c3aed'
const COLOR_LIGHT = '#a78bfa'
const COLOR_GLOW = 'rgba(124,58,237,0.35)'

const TIPO_COLORS: Record<string, string> = {
  'No participante': '#64748b',
  Participante: '#7c3aed',
  Sistemática: '#0284c7',
  Ocasional: '#059669',
  Directa: '#d97706',
  Indirecta: '#e11d48',
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    const [y, m, d] = dateStr.split('-')
    return `${d}/${m}/${y}`
  } catch {
    return dateStr
  }
}

export function OBVCard({ task, index, projects, onToggle, onDelete }: Props) {
  const [checkPress, setCheckPress] = useState(false)

  const tipoColor = task.tipo ? (TIPO_COLORS[task.tipo] ?? COLOR) : COLOR
  const linkedProject = task.projectId ? projects.find(p => p.id === task.projectId) : undefined

  return (
    <div
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        background: task.done ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${task.done ? 'rgba(255,255,255,0.04)' : 'rgba(124,58,237,0.18)'}`,
        animation: `slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${index * 40}ms both`,
        transition: 'background 0.3s, border-color 0.3s',
        opacity: task.done ? 0.6 : 1,
      }}
    >
      {/* Top row: tipo pill + controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 12px 8px',
          borderBottom: `1px solid rgba(255,255,255,0.04)`,
        }}
      >
        {/* Tipo badge */}
        {task.tipo && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: tipoColor,
              background: tipoColor + '18',
              padding: '3px 10px',
              borderRadius: 99,
              border: `1px solid ${tipoColor}30`,
            }}
          >
            {task.tipo}
          </span>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          {/* Checkbox */}
          <button
            onClick={onToggle}
            onPointerDown={() => setCheckPress(true)}
            onPointerUp={() => setCheckPress(false)}
            onPointerLeave={() => setCheckPress(false)}
            aria-label={task.done ? 'Marcar como pendiente' : 'Marcar como completado'}
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              border: `2px solid ${task.done ? COLOR : 'rgba(255,255,255,0.2)'}`,
              background: task.done ? COLOR : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
              transform: checkPress ? 'scale(0.8)' : 'scale(1)',
              transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: task.done ? `0 0 8px ${COLOR_GLOW}` : 'none',
              flexShrink: 0,
            }}
          >
            {task.done && (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          {/* Delete */}
          <button
            onClick={onDelete}
            aria-label="Eliminar observación"
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              border: 'none',
              background: 'rgba(248,113,113,0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
              opacity: 0.5,
              transition: 'opacity 0.15s, transform 0.1s',
              flexShrink: 0,
            }}
            onPointerDown={e => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.transform = 'scale(0.88)'
            }}
            onPointerUp={e => {
              e.currentTarget.style.opacity = '0.5'
              e.currentTarget.style.transform = 'scale(1)'
            }}
            onPointerLeave={e => {
              e.currentTarget.style.opacity = '0.5'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 18L18 6M6 6l12 12" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {/* Persona */}
        {task.persona && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
              <circle cx="12" cy="8" r="4" stroke={COLOR_LIGHT} strokeWidth="1.8" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={COLOR_LIGHT} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: task.done ? 'rgba(240,240,255,0.3)' : 'rgba(240,240,255,0.9)',
                textDecoration: task.done ? 'line-through' : 'none',
                textDecorationColor: 'rgba(240,240,255,0.2)',
              }}
            >
              {task.persona}
            </span>
          </div>
        )}

        {/* Fecha + Proyecto row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {task.fecha && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="3" stroke="rgba(240,240,255,0.35)" strokeWidth="1.8" />
                <path d="M8 2v4M16 2v4M3 9h18" stroke="rgba(240,240,255,0.35)" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 12, color: 'rgba(240,240,255,0.4)', fontWeight: 500 }}>
                {formatDate(task.fecha)}
              </span>
            </div>
          )}

          {linkedProject && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                background: linkedProject.color + '18',
                border: `1px solid ${linkedProject.color}30`,
                borderRadius: 99,
                padding: '2px 8px',
              }}
            >
              <span style={{ fontSize: 11 }}>{linkedProject.emoji}</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: linkedProject.color,
                  maxWidth: 100,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {linkedProject.name}
              </span>
            </div>
          )}
        </div>

        {/* Notas */}
        {task.notas && (
          <div
            style={{
              marginTop: 2,
              padding: '8px 10px',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: 'rgba(240,240,255,0.5)',
                lineHeight: 1.5,
                wordBreak: 'break-word',
              }}
            >
              {task.notas}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
