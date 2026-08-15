import React from 'react'
import { Space } from '../../types'
import { Badge } from '../ui/Badge'
import { Btn } from '../ui/Button'
import { SPACE_TYPE_LABELS } from '../../data/constants'
import { MapPin, Users, Monitor, Library, Wrench, ArrowRight } from 'lucide-react'

interface SpaceCardProps {
  space: Space
  isAvailable: boolean
  isAdmin: boolean
  onReserve: (id: string) => void
  onViewDetails: (space: Space) => void
}

export function SpaceCard({ space, isAvailable, isAdmin, onReserve, onViewDetails }: SpaceCardProps) {
  const getHeaderStyle = (type: Space['type']) => {
    switch (type) {
      case 'LAB': return { bg: '#E8EDF2', text: '#2C3E50', border: '#D1DAE3' }
      case 'LIBRARY': return { bg: '#F5E6E5', text: '#941611', border: '#EDCFCD' }
      case 'MAKER': return { bg: '#E5EEEB', text: '#2A5C45', border: '#CEDDD7' }
    }
  }

  const getIcon = (type: Space['type']) => {
    switch (type) {
      case 'LAB': return <Monitor size={24} />
      case 'LIBRARY': return <Library size={24} />
      case 'MAKER': return <Wrench size={24} />
    }
  }

  const headerStyle = getHeaderStyle(space.type)

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
        height: '100%'
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
      {/* Header com tom pastel */}
      <div style={{ background: headerStyle.bg, padding: '24px 20px', borderBottom: `1px solid ${headerStyle.border}` }}>
        <div style={{ color: headerStyle.text, marginBottom: 12 }}>
          {getIcon(space.type)}
        </div>
        <h3 style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-1)', lineHeight: 1.2, marginBottom: 8 }}>
          {space.name}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={14} /> {space.location}
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: headerStyle.text, background: headerStyle.border, padding: '4px 12px', borderRadius: 20 }}>
            {SPACE_TYPE_LABELS[space.type]}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: isAvailable ? 'var(--status-approved-text)' : 'var(--status-rejected-text)', background: isAvailable ? 'var(--status-approved-bg)' : 'var(--status-rejected-bg)', padding: '4px 12px', borderRadius: 20 }}>
            {isAvailable ? '● Disponível' : '● Ocupado'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-2)', marginBottom: 16 }}>
          <Users size={16} /> Capacidade: <strong>{space.capacity} pessoas</strong>
        </div>

        {space.requiresApproval && (
          <div style={{ fontSize: 12, color: 'var(--status-pending-text)', fontWeight: 600, marginBottom: 16 }}>
            ⚠️ Requer aprovação prévia
          </div>
        )}

        <div style={{ marginBottom: 'auto' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {space.equipment.slice(0, 3).map(e => (
              <span key={e} style={{ background: 'var(--surface)', color: 'var(--text-2)', borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 500 }}>
                {e}
              </span>
            ))}
            {space.equipment.length > 3 && (
              <span style={{ background: 'var(--surface)', color: 'var(--text-2)', borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 500 }}>
                +{space.equipment.length - 3} mais
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)' }}>
        <button 
          onClick={() => onViewDetails(space)}
          style={{ background: 'none', border: 'none', color: 'var(--text-2)', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
        >
          Explorar <ArrowRight size={16} />
        </button>
        
        <div style={{ display: 'flex', gap: 8 }}>
          {isAdmin && <Btn variant="ghost" small>Editar</Btn>}
          <Btn variant="primary" small onClick={() => onReserve(space.id)}>Reservar</Btn>
        </div>
      </div>
    </div>
  )
}
