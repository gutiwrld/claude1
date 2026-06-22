import { CATEGORIES, Category } from '../../hooks/useStore'
import { ProgressRing } from './ProgressRing'

interface Props {
  progress: Record<Category, { done: number; total: number }>
  daysLeft: number
  totalDone: number
  totalGoal: number
  onTabChange: (tab: Category) => void
}

export function Dashboard({ progress, daysLeft, totalDone, totalGoal, onTabChange }: Props) {
  const totalPct = totalGoal > 0 ? totalDone / totalGoal : 0
  const urgencyColor =
    daysLeft <= 20 ? '#f87171' : daysLeft <= 45 ? '#fbbf24' : '#4ade80'

  return (
    <div style={{ padding: '12px 20px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Countdown card */}
      <div
        style={{
          borderRadius: 20,
          padding: '20px 24px',
          background:
            'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(6,182,212,0.10) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Decorative blob */}
        <div
          style={{
            position: 'absolute',
            right: -20,
            top: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(139,92,246,0.15)',
            filter: 'blur(30px)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(240,240,255,0.45)' }}>
              Fecha límite
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 17, fontWeight: 800, color: '#f0f0ff' }}>
              1 de Septiembre
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: urgencyColor,
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
                display: 'block',
                filter: `drop-shadow(0 0 12px ${urgencyColor}80)`,
              }}
            >
              {daysLeft}
            </span>
            <span style={{ fontSize: 13, color: 'rgba(240,240,255,0.45)', fontWeight: 600 }}>
              días
            </span>
          </div>
        </div>

        {/* Overall progress bar */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: 'rgba(240,240,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Progreso total
            </span>
            <span style={{ fontSize: 11, color: 'rgba(240,240,255,0.5)', fontWeight: 700 }}>
              {totalDone} / {totalGoal}
            </span>
          </div>
          <div
            style={{
              height: 5,
              borderRadius: 99,
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: 99,
                background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
                width: `${totalPct * 100}%`,
                transition: 'width 1.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 0 8px rgba(139,92,246,0.5)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Category progress rings */}
      <div>
        <p style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,240,255,0.35)' }}>
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
                  borderRadius: 18,
                  padding: '16px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid rgba(255,255,255,0.07)`,
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'transform 0.1s, background 0.2s',
                  outline: 'none',
                }}
                onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.93)')}
                onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
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
                    <div style={{ fontSize: 10, color: 'rgba(240,240,255,0.3)', lineHeight: 1.2 }}>
                      /{total}
                    </div>
                  </div>
                </ProgressRing>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(240,240,255,0.65)', letterSpacing: '0.04em' }}>
                  {cat.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Status list */}
      <div>
        <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,240,255,0.35)' }}>
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
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'transform 0.1s',
                  width: '100%',
                  textAlign: 'left',
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
                      boxShadow: `0 0 6px ${cat.colorGlow}`,
                    }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#f0f0ff' }}>
                    {cat.label}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'rgba(240,240,255,0.4)' }}>
                    {complete ? '¡Completo! 🎉' : `${remaining} pendientes`}
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
    </div>
  )
}
