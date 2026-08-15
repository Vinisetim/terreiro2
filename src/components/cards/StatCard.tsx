import React from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  variant?: 'neutral' | 'accent' | 'success' | 'warning'
}

export function StatCard({ label, value, icon, variant = 'neutral' }: StatCardProps) {
  const getStyle = () => {
    switch (variant) {
      case 'accent': return { bg: '#F5E6E5', text: '#941611', border: '#EDCFCD' }
      case 'success': return { bg: '#E8F5EE', text: '#1A7A4A', border: '#CBE8D9' }
      case 'warning': return { bg: '#FFF8E6', text: '#A05F00', border: '#FFE4A8' }
      case 'neutral': default: return { bg: '#F8F9FA', text: '#4A555C', border: '#E2E8F0' }
    }
  }

  const style = getStyle()

  return (
    <div 
      style={{ 
        background: '#fff', 
        border: '1px solid var(--border)', 
        borderRadius: 'var(--radius-lg)', 
        overflow: 'hidden', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => { 
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; 
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' 
      }}
      onMouseLeave={e => { 
        (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; 
        (e.currentTarget as HTMLElement).style.transform = 'none' 
      }}
    >
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ background: style.bg, color: style.text, padding: 16, borderRadius: 'var(--radius-md)', border: `1px solid ${style.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <div>
          <div style={{ color: 'var(--text-2)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            {label}
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.2 }}>
            {value}
          </div>
        </div>
      </div>
    </div>
  )
}
