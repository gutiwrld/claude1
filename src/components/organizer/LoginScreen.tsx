import { useState } from 'react'

interface Props {
  onSignIn: (email: string, password: string) => Promise<{ error: string | null }>
  onSignUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>
}

function fieldStyle(hasError = false): React.CSSProperties {
  return {
    width: '100%',
    borderRadius: 13,
    padding: '13px 16px',
    fontSize: 15,
    fontWeight: 500,
    outline: 'none',
    background: 'rgba(255,255,255,0.05)',
    border: `1.5px solid ${hasError ? '#f87171' : 'rgba(255,255,255,0.1)'}`,
    color: '#f0f0ff',
    caretColor: '#a78bfa',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  }
}

export function LoginScreen({ onSignIn, onSignUp }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const switchMode = (m: 'login' | 'register') => {
    setMode(m)
    setError(null)
  }

  const canSubmit =
    email.trim().includes('@') &&
    password.length >= 6 &&
    (mode === 'login' || name.trim().length > 0)

  const submit = async () => {
    if (!canSubmit) {
      if (!email.trim().includes('@')) { setError('Introduce un email válido'); return }
      if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
      if (mode === 'register' && !name.trim()) { setError('Introduce tu nombre'); return }
      return
    }
    setLoading(true)
    setError(null)
    const result =
      mode === 'login'
        ? await onSignIn(email, password)
        : await onSignUp(email, password, name)
    setLoading(false)
    if (result.error) setError(result.error)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#06060e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background blobs */}
      <div
        style={{
          position: 'absolute',
          left: '-10%',
          top: '10%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '-10%',
          bottom: '10%',
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(2,132,199,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: 380,
          borderRadius: 24,
          padding: '36px 28px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <div
            style={{
              fontSize: 40,
              marginBottom: 12,
              filter: 'drop-shadow(0 0 16px rgba(124,58,237,0.5))',
            }}
          >
            ✦
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 900,
              color: '#f0f0ff',
              letterSpacing: '-0.03em',
            }}
          >
            Mi Carrera
          </h1>
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 14,
              color: 'rgba(240,240,255,0.4)',
              lineHeight: 1.5,
            }}
          >
            Tu espacio personal para el TFM
          </p>
        </div>

        {/* Mode toggle */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 12,
            padding: 3,
            marginBottom: 22,
            gap: 2,
          }}
        >
          {(['login', 'register'] as const).map(m => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 9,
                border: 'none',
                background: mode === m ? 'rgba(124,58,237,0.32)' : 'transparent',
                color: mode === m ? '#a78bfa' : 'rgba(240,240,255,0.4)',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s',
                WebkitTapHighlightColor: 'transparent',
                fontFamily: 'inherit',
              }}
            >
              {m === 'login' ? 'Entrar' : 'Registrarse'}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'register' && (
            <div>
              <label style={labelStyle}>Nombre</label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setError(null) }}
                placeholder="Tu nombre"
                autoFocus
                style={fieldStyle(!!error && mode === 'register' && !name.trim())}
              />
            </div>
          )}

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(null) }}
              placeholder="tu@email.com"
              autoComplete="email"
              autoFocus={mode === 'login'}
              style={fieldStyle(!!error && !email.includes('@'))}
            />
          </div>

          <div>
            <label style={labelStyle}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(null) }}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                style={{ ...fieldStyle(!!error && password.length < 6), paddingRight: 46 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(240,240,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 4,
                  outline: 'none',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  {showPw ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p style={{ margin: '10px 0 0', fontSize: 12, color: '#f87171', lineHeight: 1.4 }}>
            {error}
          </p>
        )}

        <button
          onClick={submit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: 14,
            border: 'none',
            marginTop: 18,
            background:
              canSubmit && !loading
                ? 'linear-gradient(135deg, #7c3aed, #a78bfa)'
                : 'rgba(255,255,255,0.06)',
            color: canSubmit && !loading ? '#fff' : 'rgba(240,240,255,0.3)',
            fontSize: 15,
            fontWeight: 700,
            cursor: canSubmit && !loading ? 'pointer' : 'default',
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
            boxShadow: canSubmit && !loading ? '0 4px 24px rgba(124,58,237,0.4)' : 'none',
            transition: 'all 0.2s',
            fontFamily: 'inherit',
          }}
          onPointerDown={e => {
            if (canSubmit) e.currentTarget.style.transform = 'scale(0.97)'
          }}
          onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {loading
            ? 'Cargando…'
            : mode === 'login'
              ? 'Entrar ✦'
              : 'Crear cuenta ✦'}
        </button>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 700,
  color: 'rgba(240,240,255,0.4)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 6,
}
