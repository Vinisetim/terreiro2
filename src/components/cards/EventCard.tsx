import React from 'react'
import { AcademicEvent } from '../../types'
import { EVENT_TYPE_LABELS, EVENT_TYPE_COLORS } from '../../data/constants'
import { FileText, PenTool, Calendar, MapPin, Activity, CircleEllipsis, CalendarDays } from 'lucide-react'

interface EventCardProps {
  event: AcademicEvent
}

export function EventCard({ event }: EventCardProps) {
  const getIcon = (type: AcademicEvent['type']) => {
    switch (type) {
      case 'EXAM': return <FileText size={18} />
      case 'ASSIGNMENT': return <PenTool size={18} />
      case 'DEADLINE': return <Calendar size={18} />
      case 'VISIT': return <MapPin size={18} />
      case 'ACTIVITY': return <Activity size={18} />
      case 'OTHER': return <CircleEllipsis size={18} />
    }
  }

  const colors = EVENT_TYPE_COLORS[event.type] || EVENT_TYPE_COLORS['OTHER']

  return (
    <div 
      style={{ 
        background: '#fff', 
        border: '1px solid var(--border)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '20px', 
        display: 'flex', 
        gap: '20px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => { 
        (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'; 
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' 
      }}
      onMouseLeave={e => { 
        (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)'; 
        (e.currentTarget as HTMLElement).style.transform = 'none' 
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px', borderRight: '1px solid var(--border)', paddingRight: '20px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-2)', textTransform: 'uppercase', fontWeight: 600 }}>
          {new Date(event.date).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
        </div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--etec-red)', lineHeight: 1 }}>
          {new Date(event.date).getDate() + 1}
        </div>
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ 
            background: colors.bg, 
            color: colors.text, 
            padding: '4px 10px', 
            borderRadius: '20px', 
            fontSize: '11px', 
            fontWeight: 700, 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '4px' 
          }}>
            {getIcon(event.type)} {EVENT_TYPE_LABELS[event.type]}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-2)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <CalendarDays size={14} /> {event.subject}
          </span>
        </div>
        
        <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-1)', marginBottom: '4px' }}>
          {event.title}
        </h4>
        
        <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.4, marginBottom: '12px' }}>
          {event.description}
        </p>

        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-2)', fontWeight: 500 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} /> Turma {event.classId}
          </span>
          {event.time && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} /> Horário: {event.time}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
