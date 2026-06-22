import { useState } from 'react'

interface Props {
  onLogin: (email: string) => Promise<{ error: string | null }>
}

export function LoginScreen({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    const trimmed = email.trim()
    if (!trimmed || !trimmed.includes('@')) {
      setError('Introduce un email válido')
      return
    }
    setLoading(true)
    setError(null)
    const { error } = await onLogin(trimmed)
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      setSent(true)
    }
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
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
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
        {/* Logo / title */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
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
              color: 'rgba(240,240,255,0.45)',
              lineHeight: 1.5,
            }}
          >
            Accede con tu email para sincronizar<br />tu progreso en todos tus dispositivos
          </p>
        </div>

        {sent ? (
          /* Confirmation state */
          <div
            style={{
              textAlign: 'center',
              padding: '24px 0',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: '#f0f0ff',
                letterSpacing: '-0.01em',
              }}
            >
              Revisa tu email
            </p>
            <p
              style={{
                margin: '8px 0 0',
                fontSize: 13,
                color: 'rgba(240,240,255,0.5)',
                lineHeight: 1.6,
              }}
            >
              Hemos enviado un enlace mágico a{' '}
              <strong style={{ color: '#a78bfa' }}>{email}</strong>.
              <br />Tócalo para entrar.
            </p>
            <button
              onClick={() => { setSent(false); setEmail('') }}
              style={{
                marginTop: 20,
                background: 'none',
                border: 'none',
                color: 'rgba(240,240,255,0.4)',
                fontSize: 13,
                cursor: 'pointer',
                textDecoration: 'underline',
                outline: 'none',
              }}
            >
              Usar otro email
            </button>
          </div>
        ) : (
          /* Login form */
          <>
            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'rgba(240,240,255,0.45)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 8,
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(null) }}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder="tu@email.com"
                autoComplete="email"
                autoFocus
                style={{
                  width: '100%',
                  borderRadius: 14,
                  padding: '14px 16px',
                  fontSize: 15,
                  fontWeight: 500,
                  outline: 'none',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${error ? '#f87171' : email ? 'rgba(124,58,237,0.6)' : 'rgba(255,255,255,0.08)'}`,
                  color: '#f0f0ff',
                  caretColor: '#a78bfa',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
              />
              {error && (
                <p style={{ margin: '6px 0 0', fontSize: 12, color: '#f87171' }}>{error}</p>
              )}
            </div>

            <button
              onClick={submit}
              disabled={loading || !email.trim()}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: 14,
                border: 'none',
                background:
                  email.trim() && !loading
                    ? 'linear-gradient(135deg, #7c3aed, #a78bfa)'
                    : 'rgba(255,255,255,0.06)',
                color: email.trim() && !loading ? '#fff' : 'rgba(240,240,255,0.3)',
                fontSize: 15,
                fontWeight: 700,
                cursor: email.trim() && !loading ? 'pointer' : 'default',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
                boxShadow:
                  email.trim() && !loading ? '0 4px 24px rgba(124,58,237,0.4)' : 'none',
                transition: 'all 0.2s',
                letterSpacing: '0.01em',
              }}
              onPointerDown={e => { if (email.trim()) e.currentTarget.style.transform = 'scale(0.97)' }}
              onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              onPointerLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {loading ? 'Enviando…' : 'Enviar enlace mágico ✦'}
            </button>

            <p
              style={{
                margin: '16px 0 0',
                fontSize: 12,
                color: 'rgba(240,240,255,0.3)',
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              Sin contraseña — recibirás un enlace de acceso directo
            </p>
          </>
        )}
      </div>
    </div>
  )
}
