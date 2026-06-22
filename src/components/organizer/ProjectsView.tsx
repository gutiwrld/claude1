import { useState } from 'react'
import { Project, Task, Category } from '../../hooks/useStore'
import { AddProjectModal } from './AddProjectModal'

interface Props {
  projects: Project[]
  tasks: Record<Category, Task[]>
  isDesktop?: boolean
  onAddProject: (project: Omit<Project, 'id' | 'createdAt'>) => void
  onDeleteProject: (id: string) => void
}

const COLOR = '#059669'
const COLOR_LIGHT = '#34d399'
const COLOR_GLOW = 'rgba(5,150,105,0.35)'

export function ProjectsView({ projects, tasks, isDesktop, onAddProject, onDeleteProject }: Props) {
  const [showAdd, setShowAdd] = useState(false)

  function getLinkedCounts(projectId: string) {
    const counts: Record<Category, number> = { obvs: 0, lps: 0, bookpoints: 0 }
    for (const cat of ['obvs', 'lps', 'bookpoints'] as Category[]) {
      counts[cat] = tasks[cat].filter(t => t.projectId === projectId).length
    }
    return counts
  }

  return (
    <>
      <div
        style={{
          padding: '12px 20px',
          paddingBottom: isDesktop ? '48px' : 'max(96px, calc(80px + env(safe-area-inset-bottom)))',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Header card */}
        <div
          style={{
            borderRadius: 20,
            padding: '20px 22px',
            background: `linear-gradient(135deg, ${COLOR_GLOW} 0%, rgba(255,255,255,0.015) 100%)`,
            border: `1px solid ${COLOR}30`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: -10,
              top: -10,
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: COLOR_GLOW,
              filter: 'blur(28px)',
              pointerEvents: 'none',
            }}
          />
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#f0f0ff' }}>
            Proyectos
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(240,240,255,0.5)' }}>
            {projects.length} proyecto{projects.length !== 1 ? 's' : ''} activo{projects.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Project list */}
        {projects.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p
              style={{
                margin: '0 0 2px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(240,240,255,0.35)',
              }}
            >
              Todos los proyectos
            </p>
            {projects.map((project, i) => {
              const counts = getLinkedCounts(project.id)
              const totalLinked = counts.obvs + counts.lps + counts.bookpoints
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  counts={counts}
                  totalLinked={totalLinked}
                  index={i}
                  onDelete={() => onDeleteProject(project.id)}
                />
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', paddingTop: 64, paddingBottom: 32 }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>🗂️</div>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                color: 'rgba(240,240,255,0.3)',
              }}
            >
              Sin proyectos
            </p>
            <p
              style={{
                margin: '6px 0 0',
                fontSize: 13,
                color: 'rgba(240,240,255,0.2)',
              }}
            >
              Crea tu primer proyecto con el botón +
            </p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAdd(true)}
        aria-label="Añadir proyecto"
        style={{
          position: 'fixed',
          bottom: isDesktop ? 24 : 'max(84px, calc(76px + env(safe-area-inset-bottom)))',
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 18,
          border: 'none',
          background: `linear-gradient(135deg, ${COLOR}, ${COLOR_LIGHT})`,
          boxShadow: `0 8px 28px ${COLOR_GLOW}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
          transition: 'transform 0.12s, box-shadow 0.2s',
          zIndex: 30,
        }}
        onPointerDown={e => {
          e.currentTarget.style.transform = 'scale(0.88)'
          e.currentTarget.style.boxShadow = `0 4px 14px ${COLOR_GLOW}`
        }}
        onPointerUp={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = `0 8px 28px ${COLOR_GLOW}`
        }}
        onPointerLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = `0 8px 28px ${COLOR_GLOW}`
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      {showAdd && (
        <AddProjectModal
          onAdd={project => {
            onAddProject(project)
            setShowAdd(false)
          }}
          onClose={() => setShowAdd(false)}
        />
      )}
    </>
  )
}

function ProjectCard({
  project,
  counts,
  totalLinked,
  index,
  onDelete,
}: {
  project: Project
  counts: Record<Category, number>
  totalLinked: number
  index: number
  onDelete: () => void
}) {
  const CATEGORY_LABELS_LOCAL: Record<Category, string> = {
    obvs: 'OBVs',
    lps: 'LPs',
    bookpoints: 'Books',
  }

  return (
    <div
      style={{
        borderRadius: 16,
        padding: '16px',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${project.color}20`,
        animation: `slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${index * 50}ms both`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle color glow */}
      <div
        style={{
          position: 'absolute',
          right: -10,
          top: -10,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: project.color + '20',
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          {/* Emoji circle */}
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: project.color + '18',
              border: `1px solid ${project.color}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            {project.emoji}
          </div>
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: '#f0f0ff',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {project.name}
            </p>
            {project.description && (
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: 12,
                  color: 'rgba(240,240,255,0.4)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={onDelete}
          aria-label="Eliminar proyecto"
          style={{
            width: 28,
            height: 28,
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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 18L18 6M6 6l12 12" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Stats row */}
      <div
        style={{
          marginTop: 12,
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        {(['obvs', 'lps', 'bookpoints'] as Category[]).map(cat => (
          <div
            key={cat}
            style={{
              padding: '4px 10px',
              borderRadius: 99,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: counts[cat] > 0 ? project.color : 'rgba(240,240,255,0.25)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {counts[cat]}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(240,240,255,0.35)', fontWeight: 500 }}>
              {CATEGORY_LABELS_LOCAL[cat]}
            </span>
          </div>
        ))}

        {totalLinked > 0 && (
          <div
            style={{
              padding: '4px 10px',
              borderRadius: 99,
              background: project.color + '15',
              border: `1px solid ${project.color}25`,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: project.color,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {totalLinked} total
            </span>
          </div>
        )}
      </div>

      {/* Color bar at bottom */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${project.color}, ${project.color}40)`,
          borderRadius: '0 0 16px 16px',
        }}
      />
    </div>
  )
}

