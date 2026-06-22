import { useEffect, useRef, useState, useId } from 'react'

interface Props {
  progress: number
  size: number
  strokeWidth: number
  color: string
  colorGlow: string
  children?: React.ReactNode
}

export function ProgressRing({ progress, size, strokeWidth, color, colorGlow, children }: Props) {
  const id = useId()
  const filterId = `glow-${id.replace(/:/g, '')}`
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const targetOffset = circumference * (1 - Math.min(1, Math.max(0, progress)))
  const [mounted, setMounted] = useState(false)

  const ref = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  const currentOffset = mounted ? targetOffset : circumference

  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)', display: 'block' }}
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          ref={ref}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={currentOffset}
          filter={progress > 0 ? `url(#${filterId})` : undefined}
          style={{
            transition: mounted
              ? 'stroke-dashoffset 1.3s cubic-bezier(0.16, 1, 0.3, 1)'
              : 'none',
          }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
      {/* Subtle glow behind ring when near complete */}
      {progress >= 1 && (
        <div
          style={{
            position: 'absolute',
            inset: strokeWidth,
            borderRadius: '50%',
            background: colorGlow,
            filter: 'blur(12px)',
            opacity: 0.6,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}
