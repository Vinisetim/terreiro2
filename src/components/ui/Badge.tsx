import React from 'react'
import { ReservationStatus } from '../../types'
import { STATUS_LABELS } from '../../data/constants'
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react'

export function statusStyle(status: ReservationStatus) {
  const map = {
    APPROVED: { background: 'var(--status-approved-bg)', color: 'var(--status-approved-text)', border: '1px solid var(--status-approved-border)' },
    PENDING: { background: 'var(--status-pending-bg)', color: 'var(--status-pending-text)', border: '1px solid var(--status-pending-border)' },
    REJECTED: { background: 'var(--status-rejected-bg)', color: 'var(--status-rejected-text)', border: '1px solid var(--status-rejected-border)' },
    CANCELLED: { background: 'var(--status-cancelled-bg)', color: 'var(--status-cancelled-text)', border: '1px solid var(--status-cancelled-border)' },
  }
  return map[status]
}

export function Badge({ status, icon = false }: { status: ReservationStatus, icon?: boolean }) {
  const icons = {
    APPROVED: <CheckCircle2 size={14} />,
    PENDING: <Clock size={14} />,
    REJECTED: <AlertCircle size={14} />,
    CANCELLED: <XCircle size={14} />
  }

  return (
    <span style={{ ...statusStyle(status), borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6, letterSpacing: '0.01em' }}>
      {icon && icons[status]}
      {STATUS_LABELS[status]}
    </span>
  )
}
