import { CATEGORIES, Category, Project, Tab } from '../../hooks/useStore'
import { ProgressRing } from './ProgressRing'

interface Props {
  progress: Record<Category, { done: number; total: number }>
  daysLeft: number
  totalDone: number
  totalGoal: number
  projects: Project[]
  onTabChange: (tab: Tab) => void
}

export function Dashboard({ progress, daysLeft, totalDone, totalGoal, projects, onTabChange }: Props) {
  const totalPct = totalGoal > 0 ? totalDone / totalGoal : 0
  const urgencyColor =
    daysLeft <= 20 ? '#f87171' : daysLeft <= 45 ? '#fbbf24' : '#4ade80'

  return (
    <div
      style={{
        padding: '12px 20px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        position: 'relative',
      }}
    >
      {/* Mesh gradient decorative blobs */}
      <div
        style={{
          position: 'absolute',
          left: -60,
          top: 40,
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -60,
          top: 180,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(2,132,199,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Countdown card */}
      <div
        style={{
          borderRadius: 22,
          padding: '22px 24px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          overflow: 'hidden',
          position: 'relative',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 1,
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: 'absolute',
            right: -20,
            top: -20,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `${urgencyColor}18`,
            filter: 'blur(30px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -10,
            bottom: -10,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(124,58,237,0.15)',
            filter: 'blur(24px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(240,240,255,0.4)',
              }}
            >
              Fecha límite
            </p>
            <p
              style={{
                margin: '5px 0 0',
                fontSize: 18,
                fontWeight: 800,
                color: '#f0f0ff',
                letterSpacing: '-0.02em',
              }}
            >
              1 de Septiembre
            </p>
            <p
              style={{
                margin: '3px 0 0',
                fontSize: 12,
                color: 'rgba(240,240,255,0.35)',
                fontWeight: 500,
              }}
            >
              TFM · Curso 2025–26
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                fontSize: 58,
                fontWeight: 900,
                color: urgencyColor,
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
                display: 'block',
                filter: `drop-shadow(0 0 16px ${urgencyColor}60)`,
                letterSpacing: '-0.04em',
              }}
            >
              {daysLeft}
            </span>
            <span
              style={{
                fontSize: 13,
                color: 'rgba(240,240,255,0.4)',
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              días
            </span>
          </div>
        </div>

        {/* Overall progress bar */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span
              style={{
                fontSize: 11,
                color: 'rgba(240,240,255,0.4)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Progreso total
            </span>
            <span
              style={{
                fontSize: 11,
                color: 'rgba(240,240,255,0.55)',
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {totalDone} / {totalGoal}
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 99,
              background: 'rgba(255,255,255,0.07)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: 99,
                background: 'linear-gradient(90deg, #7c3aed, #0284c7, #34d399)',
                width: `${totalPct * 100}%`,
                transition: 'width 1.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 0 10px rgba(124,58,237,0.55)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Category progress rings */}
      <div style={{ zIndex: 1 }}>
        <p
          style={{
            margin: '0 0 14px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(240,240,255,0.35)',
          }}
        >
          Entregas
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {CATEGORIES.map(cat => {
            const { done, total } = progress[cat.key]
            const pct = total > 0 ? done / total : 0
            return (
              <button
                key={cat.key}
                onClick={() => onTabChange(cat.key)}
                style={{
                  borderRadius: 20,
                  padding: '18px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid rgba(255,255,255,0.06)`,
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'transform 0.15s, background 0.2s, border-color 0.2s',
                  outline: 'none',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
                onPointerDown={e => {
                  e.currentTarget.style.transform = 'scale(0.93)'
                  e.currentTarget.style.background = `${cat.color}10`
                  e.currentTarget.style.borderColor = `${cat.color}30`
                }}
                onPointerUp={e => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                }}
                onPointerLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                }}
              >
                <ProgressRing
                  progress={pct}
                  size={76}
                  strokeWidth={7}
                  color={cat.color}
                  colorGlow={cat.colorGlow}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 900,
                        color: cat.colorLight,
                        lineHeight: 1,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {done}
                    </div>
                    <div
                      style={{ fontSize: 10, color: 'rgba(240,240,255,0.3)', lineHeight: 1.3 }}
                    >
                      /{total}
                    </div>
                  </div>
                </ProgressRing>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'rgba(240,240,255,0.6)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {cat.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Status list */}
      <div style={{ zIndex: 1 }}>
        <p
          style={{
            margin: '0 0 12px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(240,240,255,0.35)',
          }}
        >
          Estado
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CATEGORIES.map(cat => {
            const { done, total } = progress[cat.key]
            const pct = Math.round((done / total) * 100)
            const remaining = total - done
            const complete = remaining === 0
            return (
              <button
                key={cat.key}
                onClick={() => onTabChange(cat.key)}
                style={{
                  borderRadius: 14,
                  padding: '13px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid rgba(255,255,255,0.06)`,
                  cursor: 'pointer',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'transform 0.12s',
                  width: '100%',
                  textAlign: 'left',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
                onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
                onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: cat.color,
                      flexShrink: 0,
                      boxShadow: `0 0 8px ${cat.colorGlow}`,
                    }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#f0f0ff' }}>
                    {cat.label}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'rgba(240,240,255,0.38)' }}>
                    {complete ? '¡Completo!' : `${remaining} pendientes`}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: complete ? '#4ade80' : cat.colorLight,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {pct}%
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Projects preview strip */}
      {projects.length > 0 && (
        <div style={{ zIndex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(240,240,255,0.35)',
              }}
            >
              Proyectos activos
            </p>
            <button
              onClick={() => onTabChange('projects')}
              style={{
                background: 'none',
                border: 'none',
                color: '#34d399',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
                padding: 0,
              }}
            >
              Ver todos
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => onTabChange('projects')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 12px',
                  borderRadius: 99,
                  background: p.color + '14',
                  border: `1px solid ${p.color}30`,
                  cursor: 'pointer',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'transform 0.12s',
                }}
                onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.94)')}
                onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <span style={{ fontSize: 13 }}>{p.emoji}</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: p.color,
                    maxWidth: 100,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
