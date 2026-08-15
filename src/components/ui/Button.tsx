import React from 'react'

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  small?: boolean
  icon?: React.ReactNode
}

export function Btn({ children, variant = 'primary', small, icon, disabled, style: extraStyle, ...props }: BtnProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 'var(--radius-sm)',
    fontWeight: 600, fontSize: small ? 13 : 14, border: 'none', padding: small ? '6px 12px' : '8px 16px',
    transition: 'opacity 0.15s, background 0.15s, transform 0.1s', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...extraStyle
  }
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: 'var(--etec-red)', color: '#fff' },
    secondary: { background: '#fff', color: 'var(--text-1)', border: '1px solid var(--border)' },
    ghost: { background: 'transparent', color: 'var(--text-2)' },
    danger: { background: 'var(--status-rejected-bg)', color: 'var(--status-rejected-text)', border: '1px solid var(--status-rejected-border)' },
  }
  
  return (
    <button 
      style={{ ...base, ...styles[variant] }} 
      disabled={disabled}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)' }}
      onMouseUp={e => { if (!disabled) e.currentTarget.style.transform = 'none' }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.transform = 'none' }}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
