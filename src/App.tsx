import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useStore, CATEGORIES, Tab } from './hooks/useStore'
import { Dashboard } from './components/organizer/Dashboard'
import { CategoryView } from './components/organizer/CategoryView'
import { ProjectsView } from './components/organizer/ProjectsView'
import { NavBar } from './components/organizer/NavBar'
import { LoginScreen } from './components/organizer/LoginScreen'

// ─── Loading spinner ──────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#06060e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '3px solid rgba(124,58,237,0.2)',
          borderTopColor: '#7c3aed',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ color: 'rgba(240,240,255,0.35)', fontSize: 13, margin: 0 }}>Cargando…</p>
    </div>
  )
}

// ─── Main organizer (authenticated) ──────────────────────────────────────────

function OrganizerApp({ userId, onSignOut }: { userId: string; onSignOut: () => void }) {
  const [tab, setTab] = useState<Tab>('dashboard')
  const {
    store,
    loading,
    addTask,
    toggleTask,
    deleteTask,
    addProject,
    deleteProject,
    daysLeft,
    progress,
    totalDone,
    totalGoal,
  } = useStore(userId)

  if (loading) return <LoadingSpinner />

  const activeCategory = CATEGORIES.find(c => c.key === tab)

  const tabLabel =
    tab === 'projects'
      ? 'Proyectos'
      : activeCategory?.labelLong ?? activeCategory?.label ?? ''

  const tabColorLight =
    tab === 'projects' ? '#34d399' : activeCategory?.colorLight ?? '#f0f0ff'

  return (
    <div
      style={{
        minHeight: '100%',
        maxWidth: 512,
        margin: '0 auto',
        background: '#06060e',
        color: '#f0f0ff',
        position: 'relative',
      }}
    >
      {/* Top bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          paddingTop: 'env(safe-area-inset-top, 0px)',
          background: 'rgba(6,6,14,0.92)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 56,
            padding: '0 20px',
          }}
        >
          {tab === 'dashboard' ? (
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 20,
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
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: 'rgba(240,240,255,0.38)',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                }}
              >
                {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
            </div>
          ) : (
            <button
              onClick={() => setTab('dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="rgba(240,240,255,0.55)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span style={{ fontSize: 20, fontWeight: 900, color: tabColorLight, letterSpacing: '-0.02em' }}>
                {tabLabel}
              </span>
            </button>
          )}

          {/* Right side: progress badge + sign out */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: 99,
                background: 'rgba(124,58,237,0.14)',
                color: '#a78bfa',
                border: '1px solid rgba(124,58,237,0.22)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {totalDone}/{totalGoal}
            </div>
            <button
              onClick={onSignOut}
              title="Cerrar sesión"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
              onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.9)')}
              onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-label="Cerrar sesión">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="rgba(240,240,255,0.4)" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 17l5-5-5-5M21 12H9" stroke="rgba(240,240,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main>
        {tab === 'dashboard' && (
          <Dashboard
            progress={progress}
            daysLeft={daysLeft}
            totalDone={totalDone}
            totalGoal={totalGoal}
            projects={store.projects}
            onTabChange={setTab}
          />
        )}

        {CATEGORIES.map(
          cat =>
            tab === cat.key && (
              <CategoryView
                key={cat.key}
                config={cat}
                tasks={store[cat.key]}
                projects={store.projects}
                progress={progress[cat.key]}
                onAdd={task => addTask(cat.key, task)}
                onToggle={id => toggleTask(cat.key, id)}
                onDelete={id => deleteTask(cat.key, id)}
              />
            )
        )}

        {tab === 'projects' && (
          <ProjectsView
            projects={store.projects}
            tasks={{ obvs: store.obvs, lps: store.lps, bookpoints: store.bookpoints }}
            onAddProject={addProject}
            onDeleteProject={deleteProject}
          />
        )}
      </main>

      <NavBar active={tab} onChange={setTab} />
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const { user, loading, signInWithEmail, signOut } = useAuth()

  if (loading) return <LoadingSpinner />
  if (!user) return <LoginScreen onLogin={signInWithEmail} />

  return <OrganizerApp userId={user.id} onSignOut={signOut} />
}
