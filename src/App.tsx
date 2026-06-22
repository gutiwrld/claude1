import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { useAuth } from './hooks/useAuth'
import { useLayout } from './hooks/useLayout'
import { useStore, CATEGORIES, Tab } from './hooks/useStore'
import { Dashboard } from './components/organizer/Dashboard'
import { CategoryView } from './components/organizer/CategoryView'
import { ProjectsView } from './components/organizer/ProjectsView'
import { ProfileView } from './components/organizer/ProfileView'
import { NavBar } from './components/organizer/NavBar'
import { Sidebar } from './components/organizer/Sidebar'
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

function OrganizerApp({
  userId,
  user,
  onSignOut,
  onUpdateProfile,
}: {
  userId: string
  user: User
  onSignOut: () => void
  onUpdateProfile: (updates: { name: string }) => Promise<{ error: string | null }>
}) {
  const [tab, setTab] = useState<Tab>('dashboard')
  const { mode, setMode } = useLayout()
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

  const isDesktop = mode === 'desktop'
  const activeCategory = CATEGORIES.find(c => c.key === tab)

  const tabLabel =
    tab === 'projects'
      ? 'Proyectos'
      : tab === 'profile'
        ? 'Mi Perfil'
        : activeCategory?.labelLong ?? activeCategory?.label ?? ''

  const tabColorLight =
    tab === 'projects'
      ? '#34d399'
      : tab === 'profile'
        ? '#f472b6'
        : activeCategory?.colorLight ?? '#f0f0ff'

  // Avatar initials for mobile header button
  const displayName = (user.user_metadata?.full_name as string) || ''
  const initials = displayName
    ? displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : (user.email?.[0]?.toUpperCase() ?? '?')

  // ── Shared header pieces ────────────────────────────────────────────────────

  const headerLeft =
    tab === 'dashboard' ? (
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
        <span
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: tabColorLight,
            letterSpacing: '-0.02em',
          }}
        >
          {tabLabel}
        </span>
      </button>
    )

  const progressBadge = (
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
  )

  // On mobile: avatar button → goes to profile
  const avatarBtn = (
    <button
      onClick={() => setTab('profile')}
      title="Mi perfil"
      style={{
        width: 34,
        height: 34,
        borderRadius: '50%',
        border: tab === 'profile' ? '2px solid #f472b6' : '1.5px solid rgba(255,255,255,0.12)',
        background:
          tab === 'profile'
            ? 'linear-gradient(135deg, #7c3aed, #0284c7)'
            : 'rgba(124,58,237,0.2)',
        color: '#fff',
        fontSize: 12,
        fontWeight: 800,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        transition: 'all 0.2s',
        letterSpacing: '-0.01em',
      }}
      onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.9)')}
      onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {initials}
    </button>
  )

  // ── Page content ─────────────────────────────────────────────────────────────

  const pageContent = (
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
              isDesktop={isDesktop}
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
          isDesktop={isDesktop}
          onAddProject={addProject}
          onDeleteProject={deleteProject}
        />
      )}

      {tab === 'profile' && (
        <ProfileView
          user={user}
          progress={progress}
          totalDone={totalDone}
          totalGoal={totalGoal}
          layoutMode={mode}
          onSetLayout={setMode}
          onSignOut={onSignOut}
          onUpdateName={name => onUpdateProfile({ name })}
        />
      )}
    </main>
  )

  // ── Desktop layout ────────────────────────────────────────────────────────────

  if (isDesktop) {
    return (
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          background: '#06060e',
          color: '#f0f0ff',
        }}
      >
        <Sidebar
          active={tab}
          onChange={setTab}
          user={user}
          totalDone={totalDone}
          totalGoal={totalGoal}
        />

        <div style={{ flex: 1, paddingLeft: 240, minHeight: '100vh' }}>
          <header
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 40,
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
                padding: '0 32px',
              }}
            >
              {headerLeft}
              {progressBadge}
            </div>
          </header>

          <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 32px' }}>
            {pageContent}
          </div>
        </div>
      </div>
    )
  }

  // ── Mobile layout ─────────────────────────────────────────────────────────────

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
          {headerLeft}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {progressBadge}
            {avatarBtn}
          </div>
        </div>
      </header>

      {pageContent}

      <NavBar active={tab} onChange={setTab} />
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const { user, loading, signIn, signUp, signOut, updateProfile } = useAuth()

  if (loading) return <LoadingSpinner />
  if (!user) return <LoginScreen onSignIn={signIn} onSignUp={signUp} />

  return (
    <OrganizerApp
      userId={user.id}
      user={user}
      onSignOut={signOut}
      onUpdateProfile={updateProfile}
    />
  )
}
