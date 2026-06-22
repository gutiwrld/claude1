import { Tab } from '../../hooks/useStore'

interface NavItem {
  id: Tab
  label: string
  icon: (active: boolean) => React.ReactNode
}

const items: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Inicio',
    icon: active => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 12L12 3l9 9"
          stroke="currentColor"
          strokeWidth={active ? 2.5 : 1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 21V12h6v9"
          stroke="currentColor"
          strokeWidth={active ? 2.5 : 1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'obvs',
    label: 'OBVs',
    icon: active => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke="currentColor"
          strokeWidth={active ? 2.5 : 1.8}
          fill={active ? 'currentColor' : 'none'}
          fillOpacity={0.25}
        />
        <path
          d="M2.05 12C3.3 7.08 7.24 3.5 12 3.5S20.7 7.08 21.95 12C20.7 16.92 16.76 20.5 12 20.5S3.3 16.92 2.05 12Z"
          stroke="currentColor"
          strokeWidth={active ? 2.5 : 1.8}
        />
      </svg>
    ),
  },
  {
    id: 'lps',
    label: 'LPs',
    icon: active => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          stroke="currentColor"
          strokeWidth={active ? 2.5 : 1.8}
          strokeLinecap="round"
        />
        <path
          d="M9 12h6M9 16h4"
          stroke="currentColor"
          strokeWidth={active ? 2.5 : 1.8}
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'bookpoints',
    label: 'Books',
    icon: active => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 19.5A2.5 2.5 0 016.5 17H20"
          stroke="currentColor"
          strokeWidth={active ? 2.5 : 1.8}
          strokeLinecap="round"
        />
        <path
          d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
          stroke="currentColor"
          strokeWidth={active ? 2.5 : 1.8}
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'projects',
    label: 'Proyectos',
    icon: active => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="3"
          y="3"
          width="8"
          height="8"
          rx="2"
          stroke="currentColor"
          strokeWidth={active ? 2.5 : 1.8}
          fill={active ? 'currentColor' : 'none'}
          fillOpacity={0.18}
        />
        <rect
          x="13"
          y="3"
          width="8"
          height="8"
          rx="2"
          stroke="currentColor"
          strokeWidth={active ? 2.5 : 1.8}
        />
        <rect
          x="3"
          y="13"
          width="8"
          height="8"
          rx="2"
          stroke="currentColor"
          strokeWidth={active ? 2.5 : 1.8}
        />
        <rect
          x="13"
          y="13"
          width="8"
          height="8"
          rx="2"
          stroke="currentColor"
          strokeWidth={active ? 2.5 : 1.8}
          fill={active ? 'currentColor' : 'none'}
          fillOpacity={0.18}
        />
      </svg>
    ),
  },
]

const ACTIVE_COLORS: Record<Tab, string> = {
  dashboard: '#a78bfa',
  obvs: '#a78bfa',
  lps: '#38bdf8',
  bookpoints: '#fb923c',
  projects: '#34d399',
}

interface Props {
  active: Tab
  onChange: (tab: Tab) => void
}

export function NavBar({ active, onChange }: Props) {
  return (
    <nav
      aria-label="Navegación principal"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: 'rgba(6,6,14,0.94)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
      }}
    >
      <div
        style={{
          maxWidth: 512,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'stretch',
          height: 60,
        }}
      >
        {items.map(item => {
          const isActive = active === item.id
          const color = isActive ? ACTIVE_COLORS[item.id] : 'rgba(240,240,255,0.28)'
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                border: 'none',
                background: 'transparent',
                color,
                cursor: 'pointer',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
                transition: 'color 0.2s',
                position: 'relative',
                padding: '8px 0',
              }}
              onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.86)')}
              onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div
                style={{
                  transform: isActive ? 'scale(1.12)' : 'scale(1)',
                  transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                  filter: isActive ? `drop-shadow(0 0 7px ${color}95)` : 'none',
                }}
              >
                {item.icon(isActive)}
              </div>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.03em',
                  lineHeight: 1,
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 24,
                    height: 2,
                    borderRadius: 99,
                    background: color,
                    boxShadow: `0 0 10px ${color}`,
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
