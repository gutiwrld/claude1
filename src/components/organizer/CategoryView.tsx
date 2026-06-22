import { useState } from 'react'
import { CategoryConfig, Task, Project } from '../../hooks/useStore'
import { AddModal } from './AddModal'
import { OBVModal } from './OBVModal'
import { OBVCard } from './OBVCard'

interface Props {
  config: CategoryConfig
  tasks: Task[]
  projects: Project[]
  progress: { done: number; total: number }
  onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function CategoryView({ config, tasks, projects, progress, onAdd, onToggle, onDelete }: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const pct = progress.total > 0 ? progress.done / progress.total : 0
  const pending = tasks.filter(t => !t.done)
  const done = tasks.filter(t => t.done)
  const isObvs = config.key === 'obvs'

  return (
    <>
      <div
        style={{
          padding: '12px 20px',
          paddingBottom: 'max(96px, calc(80px + env(safe-area-inset-bottom)))',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Header progress card */}
        <div
          style={{
            borderRadius: 20,
            padding: '20px 22px',
            background: `linear-gradient(135deg, ${config.colorGlow} 0%, rgba(255,255,255,0.015) 100%)`,
            border: `1px solid ${config.color}30`,
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
              background: config.colorGlow,
              filter: 'blur(28px)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 16,
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#f0f0ff' }}>
                {config.labelLong}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(240,240,255,0.5)' }}>
                {progress.done} de {progress.total} completados
              </p>
            </div>
            <span
              style={{
                fontSize: 38,
                fontWeight: 900,
                color: config.colorLight,
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {Math.round(pct * 100)}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 99,
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: 99,
                background: `linear-gradient(90deg, ${config.color}, ${config.colorLight})`,
                width: `${pct * 100}%`,
                transition: 'width 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: `0 0 10px ${config.colorGlow}`,
              }}
            />
          </div>
        </div>

        {/* Pending tasks */}
        {pending.length > 0 && (
          <div>
            <p
              style={{
                margin: '0 0 10px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(240,240,255,0.35)',
              }}
            >
              Pendientes — {pending.length}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pending.map((task, i) =>
                isObvs ? (
                  <OBVCard
                    key={task.id}
                    task={task}
                    index={i}
                    projects={projects}
                    onToggle={() => onToggle(task.id)}
                    onDelete={() => onDelete(task.id)}
                  />
                ) : (
                  <TaskCard
                    key={task.id}
                    task={task}
                    config={config}
                    index={i}
                    onToggle={() => onToggle(task.id)}
                    onDelete={() => onDelete(task.id)}
                  />
                )
              )}
            </div>
          </div>
        )}

        {/* Completed tasks */}
        {done.length > 0 && (
          <div>
            <p
              style={{
                margin: '0 0 10px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(240,240,255,0.35)',
              }}
            >
              Completados — {done.length}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {done.map((task, i) =>
                isObvs ? (
                  <OBVCard
                    key={task.id}
                    task={task}
                    index={i}
                    projects={projects}
                    onToggle={() => onToggle(task.id)}
                    onDelete={() => onDelete(task.id)}
                  />
                ) : (
                  <TaskCard
                    key={task.id}
                    task={task}
                    config={config}
                    index={i}
                    onToggle={() => onToggle(task.id)}
                    onDelete={() => onDelete(task.id)}
                  />
                )
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {tasks.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 64, paddingBottom: 32 }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>{config.emoji}</div>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                color: 'rgba(240,240,255,0.3)',
              }}
            >
              Sin {config.label} todavía
            </p>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(240,240,255,0.2)' }}>
              Toca el botón + para añadir
            </p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAdd(true)}
        aria-label={`Añadir ${config.label}`}
        style={{
          position: 'fixed',
          bottom: 'max(84px, calc(76px + env(safe-area-inset-bottom)))',
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 18,
          border: 'none',
          background: `linear-gradient(135deg, ${config.color}, ${config.colorLight})`,
          boxShadow: `0 8px 28px ${config.colorGlow}`,
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
          e.currentTarget.style.boxShadow = `0 4px 14px ${config.colorGlow}`
        }}
        onPointerUp={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = `0 8px 28px ${config.colorGlow}`
        }}
        onPointerLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = `0 8px 28px ${config.colorGlow}`
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      {showAdd &&
        (isObvs ? (
          <OBVModal
            projects={projects}
            onAdd={task => {
              onAdd(task)
              setShowAdd(false)
            }}
            onClose={() => setShowAdd(false)}
          />
        ) : (
          <AddModal
            config={config}
            onAdd={task => {
              onAdd(task)
              setShowAdd(false)
            }}
            onClose={() => setShowAdd(false)}
          />
        ))}
    </>
  )
}

function TaskCard({
  task,
  config,
  index,
  onToggle,
  onDelete,
}: {
  task: Task
  config: CategoryConfig
  index: number
  onToggle: () => void
  onDelete: () => void
}) {
  const [checkPress, setCheckPress] = useState(false)

  return (
    <div
      style={{
        borderRadius: 14,
        padding: '13px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: task.done ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${task.done ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.07)'}`,
        animation: `slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${index * 40}ms both`,
        transition: 'background 0.3s, border-color 0.3s',
        opacity: task.done ? 0.6 : 1,
      }}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        onPointerDown={() => setCheckPress(true)}
        onPointerUp={() => setCheckPress(false)}
        onPointerLeave={() => setCheckPress(false)}
        aria-label={task.done ? 'Marcar como pendiente' : 'Marcar como completado'}
        style={{
          flexShrink: 0,
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: `2px solid ${task.done ? config.color : 'rgba(255,255,255,0.2)'}`,
          background: task.done ? config.color : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
          transform: checkPress ? 'scale(0.8)' : 'scale(1)',
          transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: task.done ? `0 0 10px ${config.colorGlow}` : 'none',
        }}
      >
        {task.done && (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M2 6l3 3 5-5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Text */}
      <span
        style={{
          flex: 1,
          fontSize: 14,
          fontWeight: 500,
          color: task.done ? 'rgba(240,240,255,0.3)' : 'rgba(240,240,255,0.88)',
          textDecoration: task.done ? 'line-through' : 'none',
          textDecorationColor: 'rgba(240,240,255,0.2)',
          transition: 'color 0.3s',
          wordBreak: 'break-word',
        }}
      >
        {task.text}
      </span>

      {/* Delete */}
      <button
        onClick={onDelete}
        aria-label="Eliminar tarea"
        style={{
          flexShrink: 0,
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
          <path
            d="M6 18L18 6M6 6l12 12"
            stroke="#f87171"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}
