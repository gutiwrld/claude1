import type { User } from '@supabase/supabase-js'
import { Tab } from '../../hooks/useStore'

const ACTIVE_COLORS: Record<Tab, string> = {
  dashboard: '#a78bfa',
  obvs: '#a78bfa',
  lps: '#38bdf8',
  bookpoints: '#fb923c',
  projects: '#34d399',
  profile: '#f472b6',
}

interface NavItem {
  id: Tab
  label: string
  icon: (active: boolean) => React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Inicio',
    icon: active => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 12L12 3l9 9" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'obvs',
    label: 'Observaciones',
    icon: active => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} fill={active ? 'currentColor' : 'none'} fillOpacity={0.22} />
        <path d="M2.05 12C3.3 7.08 7.24 3.5 12 3.5S20.7 7.08 21.95 12C20.7 16.92 16.76 20.5 12 20.5S3.3 16.92 2.05 12Z" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} />
      </svg>
    ),
  },
  {
    id: 'lps',
    label: 'Learning Points',
    icon: active => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" />
        <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'bookpoints',
    label: 'Bookpoints',
    icon: active => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'projects',
    label: 'Proyectos',
    icon: active => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} fill={active ? 'currentColor' : 'none'} fillOpacity={0.18} />
        <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} />
        <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} />
        <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} fill={active ? 'currentColor' : 'none'} fillOpacity={0.18} />
      </svg>
    ),
  },
]

interface Props {
  active: Tab
  onChange: (tab: Tab) => void
  user: User
  totalDone: number
  totalGoal: number
}

export function Sidebar({ active, onChange, user, totalDone, totalGoal }: Props) {
  const displayName = (user.user_metadata?.full_name as string) || ''
  const email = user.email ?? ''
  const initials = displayName
    ? displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : (email[0]?.toUpperCase() ?? '?')

  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: 240,
        background: 'rgba(6,6,14,0.97)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
      }}
    >
      {/* App title */}
      <div style={{ padding: '24px 20px 18px' }}>
        <h1
          style={{
            margin: 0,
            fontSize: 17,
            fontWeight: 900,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #f0f0ff 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Mi Carrera ✦
        </h1>
        <p style={{ margin: '5px 0 0', fontSize: 11, color: 'rgba(240,240,255,0.35)', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
          {totalDone}/{totalGoal} completados
        </p>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 16px 10px' }} />

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '4px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {NAV_ITEMS.map(item => {
          const isActive = active === item.id
          const color = ACTIVE_COLORS[item.id]
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '10px 12px',
                borderRadius: 11,
                border: 'none',
                borderLeft: `2px solid ${isActive ? color : 'transparent'}`,
                background: isActive ? `${color}12` : 'transparent',
                color: isActive ? color : 'rgba(240,240,255,0.5)',
                cursor: 'pointer',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
                transition: 'all 0.18s',
                width: '100%',
                textAlign: 'left',
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent'
              }}
            >
              <div style={{ flexShrink: 0, filter: isActive ? `drop-shadow(0 0 5px ${color}80)` : 'none', transition: 'filter 0.18s' }}>
                {item.icon(isActive)}
              </div>
              {item.label}
            </button>
          )
        })}
      </nav>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 16px' }} />

      {/* Profile button */}
      <button
        onClick={() => onChange('profile')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 18px',
          border: 'none',
          background: active === 'profile' ? 'rgba(244,114,182,0.08)' : 'transparent',
          cursor: 'pointer',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
          marginBottom: 8,
          transition: 'background 0.18s',
          textAlign: 'left',
          width: '100%',
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => {
          if (active !== 'profile') e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
        }}
        onMouseLeave={e => {
          if (active !== 'profile') e.currentTarget.style.background = 'transparent'
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            flexShrink: 0,
            background:
              active === 'profile'
                ? 'linear-gradient(135deg, #7c3aed, #0284c7)'
                : 'rgba(124,58,237,0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 800,
            color: '#fff',
            boxShadow: active === 'profile' ? '0 0 14px rgba(124,58,237,0.4)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          {initials}
        </div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: active === 'profile' ? '#f472b6' : '#f0f0ff',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              transition: 'color 0.18s',
            }}
          >
            {displayName || 'Mi perfil'}
          </div>
          <div
            style={{
              fontSize: 11,
              color: 'rgba(240,240,255,0.35)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginTop: 1,
            }}
          >
            {email}
          </div>
        </div>
      </button>
    </aside>
  )
}
