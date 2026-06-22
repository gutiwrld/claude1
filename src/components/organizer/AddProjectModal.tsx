import { useState, useEffect } from 'react'
import { Project, PROJECT_COLORS } from '../../hooks/useStore'

const PROJECT_EMOJIS = ['🚀', '📖', '🎯', '💡', '🔬', '🏗️', '⭐', '🌱', '📝', '🎨', '🧪', '📊']

interface Props {
  onAdd: (project: Omit<Project, 'id' | 'createdAt'>) => void
  onClose: () => void
}

const PROJECTS_COLOR = '#059669'
const PROJECTS_COLOR_LIGHT = '#34d399'
const PROJECTS_COLOR_GLOW = 'rgba(5,150,105,0.35)'

export function AddProjectModal({ onAdd, onClose }: Props) {
  const [visible, setVisible] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [emoji, setEmoji] = useState('🚀')
  const [color, setColor] = useState<string>(PROJECT_COLORS[0])

  useEffect(() => {
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
    return () => cancelAnimationFrame(t)
  }, [])

  const close = () => {
    setVisible(false)
    setTimeout(onClose, 320)
  }

  const canSubmit = name.trim().length > 0

  const submit = () => {
    if (!canSubmit) return
    onAdd({
      name: name.trim(),
      description: description.trim(),
      emoji,
      color,
    })
    close()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: 12,
    padding: '12px 14px',
    fontSize: 14,
    fontWeight: 500,
    outline: 'none',
    background: 'rgba(255,255,255,0.05)',
    border: '1.5px solid rgba(255,255,255,0.08)',
    color: '#f0f0ff',
    caretColor: PROJECTS_COLOR,
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(240,240,255,0.4)',
    marginBottom: 8,
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-end',
        background: visible ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0)',
        backdropFilter: visible ? 'blur(6px)' : 'none',
        WebkitBackdropFilter: visible ? 'blur(6px)' : 'none',
        transition: 'background 0.3s, backdrop-filter 0.3s',
      }}
      onClick={e => e.target === e.currentTarget && close()}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 512,
          margin: '0 auto',
          borderRadius: '28px 28px 0 0',
          paddingBottom: 'max(32px, calc(16px + env(safe-area-inset-bottom)))',
          background: 'rgba(12,12,22,0.98)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderBottom: 'none',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Handle */}
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 99,
            background: 'rgba(255,255,255,0.12)',
            margin: '14px auto 0',
          }}
        />

        {/* Header */}
        <div style={{ padding: '20px 20px 0' }}>
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 800,
              color: '#f0f0ff',
              letterSpacing: '-0.02em',
            }}
          >
            Nuevo{' '}
            <span style={{ color: PROJECTS_COLOR_LIGHT }}>Proyecto</span>
          </h3>
        </div>

        <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Nombre</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nombre del proyecto…"
              maxLength={60}
              autoFocus
              style={{
                ...inputStyle,
                border: `1.5px solid ${name.trim() ? PROJECTS_COLOR + '60' : 'rgba(255,255,255,0.08)'}`,
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Descripción (opcional)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Breve descripción del proyecto…"
              maxLength={200}
              rows={2}
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: 56,
              }}
            />
          </div>

          {/* Emoji picker */}
          <div>
            <span style={labelStyle}>Icono</span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: 8,
              }}
            >
              {PROJECT_EMOJIS.map(e => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  style={{
                    padding: '10px 0',
                    borderRadius: 12,
                    border: `1.5px solid ${emoji === e ? PROJECTS_COLOR : 'rgba(255,255,255,0.08)'}`,
                    background: emoji === e ? PROJECTS_COLOR + '20' : 'rgba(255,255,255,0.03)',
                    fontSize: 20,
                    cursor: 'pointer',
                    outline: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    transition: 'all 0.15s',
                    textAlign: 'center',
                  }}
                  onPointerDown={el => (el.currentTarget.style.transform = 'scale(0.88)')}
                  onPointerUp={el => (el.currentTarget.style.transform = 'scale(1)')}
                  onPointerLeave={el => (el.currentTarget.style.transform = 'scale(1)')}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <span style={labelStyle}>Color</span>
            <div
              style={{
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              {PROJECT_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: c,
                    border: `3px solid ${color === c ? '#fff' : 'transparent'}`,
                    outline: color === c ? `2px solid ${c}` : 'none',
                    outlineOffset: 2,
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent',
                    transition: 'transform 0.15s, border 0.15s',
                    boxShadow: color === c ? `0 0 12px ${c}80` : 'none',
                  }}
                  onPointerDown={el => (el.currentTarget.style.transform = 'scale(0.88)')}
                  onPointerUp={el => (el.currentTarget.style.transform = 'scale(1)')}
                  onPointerLeave={el => (el.currentTarget.style.transform = 'scale(1)')}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          {name.trim() && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 14,
                background: color + '12',
                border: `1px solid ${color}30`,
              }}
            >
              <span style={{ fontSize: 24 }}>{emoji}</span>
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#f0f0ff' }}>{name}</p>
                {description && (
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(240,240,255,0.45)' }}>
                    {description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, paddingBottom: 4 }}>
            <button
              onClick={close}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: 14,
                border: 'none',
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(240,240,255,0.5)',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
                transition: 'transform 0.1s',
              }}
              onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
              onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Cancelar
            </button>
            <button
              onClick={submit}
              disabled={!canSubmit}
              style={{
                flex: 2,
                padding: '14px',
                borderRadius: 14,
                border: 'none',
                background: canSubmit
                  ? `linear-gradient(135deg, ${PROJECTS_COLOR}, ${PROJECTS_COLOR_LIGHT})`
                  : 'rgba(255,255,255,0.05)',
                color: canSubmit ? '#fff' : 'rgba(240,240,255,0.25)',
                fontSize: 15,
                fontWeight: 700,
                cursor: canSubmit ? 'pointer' : 'default',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
                boxShadow: canSubmit ? `0 4px 24px ${PROJECTS_COLOR_GLOW}` : 'none',
                transition: 'all 0.2s',
              }}
              onPointerDown={e => canSubmit && (e.currentTarget.style.transform = 'scale(0.96)')}
              onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Crear Proyecto
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
