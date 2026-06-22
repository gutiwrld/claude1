import { useState, useEffect } from 'react'
import { OBV_TIPOS, ObvTipo, Task, Project } from '../../hooks/useStore'

interface Props {
  projects: Project[]
  onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void
  onClose: () => void
}

const COLOR = '#7c3aed'
const COLOR_LIGHT = '#a78bfa'
const COLOR_GLOW = 'rgba(124,58,237,0.35)'

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function OBVModal({ projects, onAdd, onClose }: Props) {
  const [visible, setVisible] = useState(false)
  const [tipo, setTipo] = useState<ObvTipo>('No participante')
  const [persona, setPersona] = useState('')
  const [fecha, setFecha] = useState(todayStr())
  const [projectId, setProjectId] = useState('')
  const [notas, setNotas] = useState('')

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

  const canSubmit = persona.trim().length > 0

  const submit = () => {
    if (!canSubmit) return
    const text = `${tipo} — ${persona.trim()}`
    onAdd({
      text,
      done: false,
      tipo,
      persona: persona.trim(),
      fecha,
      projectId: projectId || undefined,
      notas: notas.trim() || undefined,
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
    caretColor: COLOR,
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
            Nueva{' '}
            <span style={{ color: COLOR_LIGHT }}>Observación</span>
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(240,240,255,0.4)' }}>
            Registro de observación de aula
          </p>
        </div>

        <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Tipo — pill selector */}
          <div>
            <span style={labelStyle}>Tipo</span>
            <div
              style={{
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
                paddingBottom: 4,
                scrollbarWidth: 'none',
              }}
            >
              {OBV_TIPOS.map(t => {
                const active = tipo === t
                return (
                  <button
                    key={t}
                    onClick={() => setTipo(t)}
                    style={{
                      flexShrink: 0,
                      padding: '8px 14px',
                      borderRadius: 99,
                      border: `1.5px solid ${active ? COLOR : 'rgba(255,255,255,0.1)'}`,
                      background: active ? COLOR + '28' : 'transparent',
                      color: active ? COLOR_LIGHT : 'rgba(240,240,255,0.5)',
                      fontSize: 13,
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                      outline: 'none',
                      WebkitTapHighlightColor: 'transparent',
                      transition: 'all 0.18s',
                      whiteSpace: 'nowrap',
                      boxShadow: active ? `0 0 10px ${COLOR_GLOW}` : 'none',
                    }}
                    onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.94)')}
                    onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                    onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Persona */}
          <div>
            <label style={labelStyle}>Persona observada</label>
            <input
              value={persona}
              onChange={e => setPersona(e.target.value)}
              placeholder="Nombre del estudiante o grupo…"
              maxLength={100}
              style={{
                ...inputStyle,
                border: `1.5px solid ${persona.trim() ? COLOR + '60' : 'rgba(255,255,255,0.08)'}`,
              }}
            />
          </div>

          {/* Fecha */}
          <div>
            <label style={labelStyle}>Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              style={{
                ...inputStyle,
                colorScheme: 'dark',
              }}
            />
          </div>

          {/* Proyecto */}
          {projects.length > 0 && (
            <div>
              <label style={labelStyle}>Proyecto (opcional)</label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                style={{
                  ...inputStyle,
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="">Sin proyecto</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.emoji} {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notas */}
          <div>
            <label style={labelStyle}>Notas (opcional)</label>
            <textarea
              value={notas}
              onChange={e => setNotas(e.target.value)}
              placeholder="Observaciones adicionales…"
              maxLength={500}
              rows={3}
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: 72,
              }}
            />
          </div>

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
                  ? `linear-gradient(135deg, ${COLOR}, ${COLOR_LIGHT})`
                  : 'rgba(255,255,255,0.05)',
                color: canSubmit ? '#fff' : 'rgba(240,240,255,0.25)',
                fontSize: 15,
                fontWeight: 700,
                cursor: canSubmit ? 'pointer' : 'default',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
                boxShadow: canSubmit ? `0 4px 24px ${COLOR_GLOW}` : 'none',
                transition: 'all 0.2s',
              }}
              onPointerDown={e => canSubmit && (e.currentTarget.style.transform = 'scale(0.96)')}
              onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Registrar OBV
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
