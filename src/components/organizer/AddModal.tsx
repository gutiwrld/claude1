import { useState, useRef, useEffect } from 'react'
import { CategoryConfig, Task } from '../../hooks/useStore'

interface Props {
  config: CategoryConfig
  onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void
  onClose: () => void
}

export function AddModal({ config, onAdd, onClose }: Props) {
  const [text, setText] = useState('')
  const [visible, setVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setVisible(true)
        setTimeout(() => inputRef.current?.focus(), 50)
      })
    })
    return () => cancelAnimationFrame(t)
  }, [])

  const close = () => {
    setVisible(false)
    setTimeout(onClose, 320)
  }

  const submit = () => {
    if (!text.trim()) return
    onAdd({ text: text.trim(), done: false })
    close()
  }

  const hasText = text.trim().length > 0

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-end',
        background: visible ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0)',
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
          padding: '0 20px',
          paddingBottom: 'max(32px, calc(16px + env(safe-area-inset-bottom)))',
          background: 'rgba(14,14,24,0.98)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderBottom: 'none',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
        }}
      >
        {/* Handle */}
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 99,
            background: 'rgba(255,255,255,0.12)',
            margin: '14px auto 24px',
          }}
        />

        <h3
          style={{
            margin: '0 0 20px',
            fontSize: 20,
            fontWeight: 800,
            color: '#f0f0ff',
            letterSpacing: '-0.02em',
          }}
        >
          Añadir{' '}
          <span style={{ color: config.colorLight }}>{config.label}</span>
        </h3>

        <input
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Descripción de la tarea…"
          maxLength={200}
          style={{
            width: '100%',
            borderRadius: 14,
            padding: '14px 16px',
            fontSize: 15,
            fontWeight: 500,
            outline: 'none',
            background: 'rgba(255,255,255,0.05)',
            border: `1.5px solid ${hasText ? config.color + '80' : 'rgba(255,255,255,0.08)'}`,
            color: '#f0f0ff',
            caretColor: config.color,
            transition: 'border-color 0.2s',
            boxSizing: 'border-box',
          }}
        />

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
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
            disabled={!hasText}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: 14,
              border: 'none',
              background: hasText
                ? `linear-gradient(135deg, ${config.color}, ${config.colorLight})`
                : 'rgba(255,255,255,0.05)',
              color: hasText ? '#fff' : 'rgba(240,240,255,0.25)',
              fontSize: 15,
              fontWeight: 700,
              cursor: hasText ? 'pointer' : 'default',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
              boxShadow: hasText ? `0 4px 24px ${config.colorGlow}` : 'none',
              transition: 'all 0.2s',
            }}
            onPointerDown={e => hasText && (e.currentTarget.style.transform = 'scale(0.96)')}
            onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  )
}
