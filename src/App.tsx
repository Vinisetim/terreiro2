import { useState, useRef, useEffect } from 'react'
import { GraduationCap, Award, BookOpen, Library, Settings, Monitor, LayoutDashboard, Calendar, Building2, ClipboardList, Clock, Info, CheckCircle2, XCircle, AlertCircle, FileText, Menu, ArrowLeftRight, Inbox, CalendarDays } from 'lucide-react'
import { StatCard } from './components/cards/StatCard'
import { SpaceCard } from './components/cards/SpaceCard'
import { EventCard } from './components/cards/EventCard'

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole = 'STUDENT' | 'CLASS_REP' | 'TEACHER' | 'LIBRARIAN' | 'ADMIN' | 'IT_TECH'
type SpaceType = 'LAB' | 'LIBRARY' | 'MAKER'
type ReservationStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'CANCELLED'
type EventType = 'EXAM' | 'ASSIGNMENT' | 'DEADLINE' | 'VISIT' | 'ACTIVITY' | 'OTHER'
type Screen = 'dashboard' | 'agenda' | 'spaces' | 'my-reservations' | 'academic' | 'admin'

interface User { id: string; name: string; role: UserRole; classGroup?: string; avatar: string }
interface Space { id: string; name: string; type: SpaceType; location: string; capacity: number; equipment: string[]; software: string[]; rules: string; requiresApproval: boolean; active: boolean }
interface Reservation { id: string; spaceId: string; userId: string; title: string; purpose: string; startAt: string; endAt: string; participants: number; status: ReservationStatus; date: string }
interface AcademicEvent { id: string; classId: string; title: string; type: EventType; subject: string; date: string; time?: string; description: string }

// ─── Seed Data ────────────────────────────────────────────────────────────────

const USERS: User[] = [
  { id: 'u1', name: 'Lucas Oliveira', role: 'STUDENT', classGroup: '3ºA Informática', avatar: 'LO' },
  { id: 'u2', name: 'Mariana Costa', role: 'CLASS_REP', classGroup: '3ºA Informática', avatar: 'MC' },
  { id: 'u3', name: 'Prof. Ricardo Santos', role: 'TEACHER', avatar: 'RS' },
  { id: 'u4', name: 'Ana Ferreira', role: 'LIBRARIAN', avatar: 'AF' },
  { id: 'u5', name: 'Carlos Mendes', role: 'ADMIN', avatar: 'CM' },
  { id: 'u6', name: 'Thiago Alves', role: 'IT_TECH', avatar: 'TA' },
]

const SPACES: Space[] = [
  { id: 's1', name: 'Laboratório de Informática 01', type: 'LAB', location: 'Bloco A — Sala 104', capacity: 30, equipment: ['Computadores', 'Projetor', 'Ar-condicionado'], software: ['VS Code', 'Java JDK', 'Photoshop', 'MySQL'], rules: 'Proibido alimentos. Salvar trabalhos em nuvem. Desligar computadores ao sair.', requiresApproval: false, active: true },
  { id: 's2', name: 'Laboratório de Informática 02', type: 'LAB', location: 'Bloco A — Sala 105', capacity: 30, equipment: ['Computadores', 'Projetor', 'Smart TV'], software: ['VS Code', 'Python', 'Figma', 'Node.js'], rules: 'Proibido alimentos. Salvar trabalhos em nuvem.', requiresApproval: false, active: true },
  { id: 's3', name: 'Laboratório de Hardware', type: 'LAB', location: 'Bloco B — Sala 201', capacity: 20, equipment: ['Bancadas', 'Multímetros', 'Ferros de solda', 'Osciloscópio'], software: ['Proteus', 'AutoCAD'], rules: 'EPI obrigatório. Acompanhamento de professor necessário.', requiresApproval: false, active: true },
  { id: 's4', name: 'Biblioteca', type: 'LIBRARY', location: 'Bloco Central — Térreo', capacity: 40, equipment: ['Computadores', 'Impressora', 'Escâner'], software: ['Internet', 'Office'], rules: 'Silêncio. Empréstimo de livros requer cadastro. Restrição de grupos acima de 10.', requiresApproval: true, active: true },
  { id: 's5', name: 'Espaço Maker', type: 'MAKER', location: 'Bloco C — Sala 301', capacity: 25, equipment: ['Impressora 3D', 'Cortadora laser', 'Bancadas', 'Ferramentas'], software: ['Tinkercad', 'Fusion 360'], rules: 'Uso supervisionado. EPI obrigatório para equipamentos. Aprovação necessária.', requiresApproval: true, active: true },
]

const today = '2026-08-15'
const RESERVATIONS: Reservation[] = [
  { id: 'r1', spaceId: 's1', userId: 'u3', title: 'Aula de Programação Web', purpose: 'Aula prática de HTML/CSS', startAt: '07:30', endAt: '09:10', participants: 28, status: 'APPROVED', date: today },
  { id: 'r2', spaceId: 's2', userId: 'u3', title: 'Projeto Final — Python', purpose: 'Orientação de projetos finais', startAt: '09:30', endAt: '11:10', participants: 25, status: 'APPROVED', date: today },
  { id: 'r3', spaceId: 's4', userId: 'u1', title: 'Pesquisa em grupo', purpose: 'Trabalho de conclusão de curso', startAt: '13:00', endAt: '15:00', participants: 5, status: 'PENDING', date: today },
  { id: 'r4', spaceId: 's5', userId: 'u2', title: 'Impressão 3D — Projeto IoT', purpose: 'Impressão de case para projeto', startAt: '10:00', endAt: '12:00', participants: 3, status: 'PENDING', date: today },
  { id: 'r5', spaceId: 's3', userId: 'u3', title: 'Manutenção preventiva', purpose: 'Aula de hardware e montagem', startAt: '14:00', endAt: '16:00', participants: 18, status: 'APPROVED', date: today },
  { id: 'r6', spaceId: 's1', userId: 'u3', title: 'Banco de Dados — SQL', purpose: 'Prática de queries', startAt: '07:30', endAt: '09:10', participants: 30, status: 'APPROVED', date: '2026-08-16' },
  { id: 'r7', spaceId: 's2', userId: 'u6', title: 'Atualização de sistemas', purpose: 'Instalação de atualizações', startAt: '07:00', endAt: '09:00', participants: 1, status: 'APPROVED', date: '2026-08-16' },
  { id: 'r8', spaceId: 's4', userId: 'u1', title: 'Leitura individual', purpose: 'Pesquisa bibliográfica', startAt: '09:00', endAt: '11:00', participants: 1, status: 'CANCELLED', date: '2026-08-14' },
]

const ACADEMIC_EVENTS: AcademicEvent[] = [
  { id: 'e1', classId: '3A', title: 'Prova de Programação Web', type: 'EXAM', subject: 'Programação Web', date: '2026-08-18', time: '07:30', description: 'Avaliação bimestral — HTML, CSS e JavaScript' },
  { id: 'e2', classId: '3A', title: 'Entrega — Projeto Final', type: 'ASSIGNMENT', subject: 'TCC', date: '2026-08-22', description: 'Entrega do relatório parcial do projeto de conclusão' },
  { id: 'e3', classId: '3A', title: 'Prazo matrícula 2027', type: 'DEADLINE', subject: 'Administrativo', date: '2026-08-25', description: 'Último dia para solicitação de matrícula no próximo ano' },
  { id: 'e4', classId: '3A', title: 'Visita técnica — Empresa XYZ', type: 'VISIT', subject: 'Estágio', date: '2026-08-28', time: '08:00', description: 'Visita à empresa parceira para apresentação de oportunidades de estágio' },
  { id: 'e5', classId: '3A', title: 'Prova de Banco de Dados', type: 'EXAM', subject: 'Banco de Dados', date: '2026-09-02', time: '09:30', description: 'Avaliação — SQL e modelagem relacional' },
]

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<UserRole, string> = {
  STUDENT: 'Aluno',
  CLASS_REP: 'Representante de Sala',
  TEACHER: 'Professor',
  LIBRARIAN: 'Bibliotecário/Funcionário',
  ADMIN: 'Gestor/Administrador',
  IT_TECH: 'Técnico de TI',
}

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  STUDENT: 'Consulta espaços, disponibilidade e agenda acadêmica',
  CLASS_REP: 'Publica e edita eventos acadêmicos da própria turma',
  TEACHER: 'Cria reservas de laboratórios e gerencia as próprias reservas',
  LIBRARIAN: 'Aprova ou rejeita solicitações de Biblioteca e Espaço Maker',
  ADMIN: 'Acesso total — CRUD de espaços, usuários, reservas e eventos',
  IT_TECH: 'Visualiza laboratórios, reservas e atualiza recursos',
}

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  STUDENT: <GraduationCap size={20} />,
  CLASS_REP: <Award size={20} />,
  TEACHER: <BookOpen size={20} />,
  LIBRARIAN: <Library size={20} />,
  ADMIN: <Settings size={20} />,
  IT_TECH: <Monitor size={20} />,
}

const STATUS_LABELS: Record<ReservationStatus, string> = {
  APPROVED: 'Aprovada',
  PENDING: 'Pendente',
  REJECTED: 'Rejeitada',
  CANCELLED: 'Cancelada',
}

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  EXAM: 'Prova',
  ASSIGNMENT: 'Trabalho',
  DEADLINE: 'Prazo',
  VISIT: 'Visita',
  ACTIVITY: 'Atividade',
  OTHER: 'Outro',
}

const EVENT_TYPE_COLORS: Record<EventType, { bg: string; text: string }> = {
  EXAM: { bg: '#fdecea', text: '#941611' },
  ASSIGNMENT: { bg: '#e8f0fe', text: '#1a56a4' },
  DEADLINE: { bg: '#fff8e6', text: '#a05f00' },
  VISIT: { bg: '#e8f5ee', text: '#1a7a4a' },
  ACTIVITY: { bg: '#f0ebfe', text: '#5b21b6' },
  OTHER: { bg: '#f0f2f4', text: '#5c6975' },
}

const SPACE_TYPE_LABELS: Record<SpaceType, string> = {
  LAB: 'Laboratório',
  LIBRARY: 'Biblioteca',
  MAKER: 'Espaço Maker',
}

const HOURS = ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00']

// ─── Utility ─────────────────────────────────────────────────────────────────

function statusStyle(status: ReservationStatus) {
  const map = {
    APPROVED: { background: 'var(--status-approved-bg)', color: 'var(--status-approved-text)', border: '1px solid var(--status-approved-border)' },
    PENDING: { background: 'var(--status-pending-bg)', color: 'var(--status-pending-text)', border: '1px solid var(--status-pending-border)' },
    REJECTED: { background: 'var(--status-rejected-bg)', color: 'var(--status-rejected-text)', border: '1px solid var(--status-rejected-border)' },
    CANCELLED: { background: 'var(--status-cancelled-bg)', color: 'var(--status-cancelled-text)', border: '1px solid var(--status-cancelled-border)' },
  }
  return map[status]
}

function getSpaceName(id: string) { return SPACES.find(s => s.id === id)?.name ?? id }

function getWeekDays(dateStr: string) {
  const d = new Date(dateStr)
  const day = d.getDay()
  const monday = new Date(d)
  monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  return Array.from({ length: 5 }, (_, i) => {
    const dd = new Date(monday)
    dd.setDate(monday.getDate() + i)
    return dd.toISOString().slice(0, 10)
  })
}

const WEEKDAY_SHORT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

// ─── Small Components ─────────────────────────────────────────────────────────

function Badge({ status }: { status: ReservationStatus }) {
  return (
    <span style={{ ...statusStyle(status), borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600, display: 'inline-block', letterSpacing: '0.01em' }}>
      {STATUS_LABELS[status]}
    </span>
  )
}

function EventBadge({ type }: { type: EventType }) {
  const c = EVENT_TYPE_COLORS[type]
  return (
    <span style={{ background: c.bg, color: c.text, borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600, display: 'inline-block' }}>
      {EVENT_TYPE_LABELS[type]}
    </span>
  )
}

function SpaceTypeBadge({ type }: { type: SpaceType }) {
  const colors: Record<SpaceType, { bg: string; color: string }> = {
    LAB: { bg: '#e8f0fe', color: '#1a56a4' },
    LIBRARY: { bg: '#e8f5ee', color: '#1a7a4a' },
    MAKER: { bg: '#f0ebfe', color: '#5b21b6' },
  }
  const c = colors[type]
  return (
    <span style={{ background: c.bg, color: c.color, borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>
      {SPACE_TYPE_LABELS[type]}
    </span>
  )
}

function Chip({ label }: { label: string }) {
  return (
    <span style={{ background: 'var(--surface)', color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 500, display: 'inline-block' }}>
      {label}
    </span>
  )
}

function Btn({ children, variant = 'primary', onClick, small, icon, disabled, style: extraStyle }: { children: React.ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; onClick?: () => void; small?: boolean; icon?: React.ReactNode; disabled?: boolean; style?: React.CSSProperties }) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 'var(--radius-sm)',
    fontWeight: 600, fontSize: small ? 13 : 14, border: 'none', padding: small ? '6px 12px' : '8px 16px',
    transition: 'opacity 0.15s, background 0.15s', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...extraStyle
  }
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: 'var(--etec-red)', color: '#fff' },
    secondary: { background: 'var(--surface)', color: 'var(--text-1)', border: '1px solid var(--border)' },
    ghost: { background: 'transparent', color: 'var(--text-2)' },
    danger: { background: 'var(--status-rejected-bg)', color: 'var(--status-rejected-text)', border: '1px solid var(--status-rejected-border)' },
  }
  return <button style={{ ...base, ...styles[variant] }} onClick={onClick} disabled={disabled}>{icon}{children}</button>
}



function EmptyState({ icon, title, sub }: { icon: React.ReactNode; title: string; sub?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '56px 24px', color: 'var(--text-3)', gap: 12, textAlign: 'center' }}>
      <div style={{ color: 'var(--border)' }}>{icon}</div>
      <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-2)' }}>{title}</div>
      {sub && <div style={{ fontSize: 13 }}>{sub}</div>}
    </div>
  )
}

function Modal({ title, children, onClose, wide }: { title: string; children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,33,40,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', width: wide ? 640 : 480, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 48px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-1)' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 20, lineHeight: 1, padding: 4 }}>✕</button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  )
}

function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t) }, [onClose])
  const colors = { success: { bg: 'var(--status-approved-bg)', color: 'var(--status-approved-text)', border: 'var(--status-approved-border)', icon: '✓' }, error: { bg: 'var(--status-rejected-bg)', color: 'var(--status-rejected-text)', border: 'var(--status-rejected-border)', icon: '✕' }, info: { bg: '#e8f0fe', color: '#1a56a4', border: '#9ab3ef', icon: 'ℹ' } }
  const c = colors[type]
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, background: c.bg, color: c.color, border: `1px solid ${c.border}`, borderRadius: 'var(--radius)', padding: '12px 18px', fontSize: 14, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 2000, display: 'flex', alignItems: 'center', gap: 10, maxWidth: 360 }}>
      <span style={{ fontSize: 16 }}>{c.icon}</span>
      <span style={{ flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.7, fontSize: 16 }}>✕</button>
    </div>
  )
}

function ConfirmDialog({ title, message, onConfirm, onCancel, danger }: { title: string; message: string; onConfirm: () => void; onCancel: () => void; danger?: boolean }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,33,40,0.45)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', width: 400, padding: 28, boxShadow: '0 24px 48px rgba(0,0,0,0.18)' }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{title}</h3>
        <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn variant="secondary" onClick={onCancel}>Cancelar</Btn>
          <Btn variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>Confirmar</Btn>
        </div>
      </div>
    </div>
  )
}

function FormField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{hint}</p>}
    </div>
  )
}

const inputStyle: React.CSSProperties = { width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontSize: 14, color: 'var(--text-1)', background: '#fff', outline: 'none' }

// ─── Profile Selection Screen ─────────────────────────────────────────────────

function ProfileSelectScreen({ onSelect }: { onSelect: (user: User) => void }) {
  const [selected, setSelected] = useState<User | null>(null)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9fb 0%, #eef1f4 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Logo */}
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 16, padding: '16px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid var(--border)' }}>
          <div style={{ width: 48, height: 48, background: 'var(--etec-red)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 18, fontStyle: 'italic', fontFamily: 'DM Sans' }}>E</span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--etec-slate)', lineHeight: 1, letterSpacing: '-0.02em' }}>Etec</div>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--etec-red)', letterSpacing: '0.02em' }}>Antônio Furlan</div>
          </div>
        </div>
        <h1 style={{ marginTop: 28, fontSize: 26, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Sistema Integrado de Agendamento</h1>
        <p style={{ marginTop: 8, color: 'var(--text-3)', fontSize: 14 }}>Selecione seu perfil para continuar — modo demonstração</p>
      </div>

      {/* Profile cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, width: '100%', maxWidth: 860, marginBottom: 32 }}>
        {USERS.map(u => {
          const isSelected = selected?.id === u.id
          return (
            <div key={u.id} onClick={() => setSelected(u)} style={{ background: '#fff', border: `2px solid ${isSelected ? 'var(--etec-red)' : 'var(--border)'}`, borderRadius: 'var(--radius-lg)', padding: '20px 18px', cursor: 'pointer', transition: 'all 0.15s', boxShadow: isSelected ? '0 0 0 3px rgba(148,22,17,0.1)' : '0 1px 4px rgba(0,0,0,0.05)', transform: isSelected ? 'translateY(-2px)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: isSelected ? 'var(--etec-red)' : 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, transition: 'background 0.15s' }}>
                  {ROLE_ICONS[u.role]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-1)' }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: isSelected ? 'var(--etec-red)' : 'var(--text-3)', fontWeight: 600, marginTop: 1 }}>{ROLE_LABELS[u.role]}</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>{ROLE_DESCRIPTIONS[u.role]}</p>
              {u.classGroup && <div style={{ marginTop: 8, fontSize: 12, color: 'var(--etec-slate)', fontWeight: 600 }}>📋 {u.classGroup}</div>}
            </div>
          )
        })}
      </div>

      <Btn variant="primary" onClick={() => selected && onSelect(selected)} disabled={!selected} style={{ padding: '12px 36px', fontSize: 15, borderRadius: 8 }}>
        Entrar no sistema →
      </Btn>
      {!selected && <p style={{ marginTop: 10, fontSize: 12, color: 'var(--text-4)' }}>Selecione um perfil acima</p>}
    </div>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

interface NavItem { id: Screen; label: string; icon: React.ReactNode; roles: UserRole[] | 'all' }

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: 'all' },
  { id: 'agenda', label: 'Agenda', icon: <Calendar size={20} />, roles: 'all' },
  { id: 'spaces', label: 'Espaços', icon: <Building2 size={20} />, roles: 'all' },
  { id: 'my-reservations', label: 'Minhas Reservas', icon: <ClipboardList size={20} />, roles: ['STUDENT', 'CLASS_REP', 'TEACHER', 'LIBRARIAN', 'IT_TECH', 'ADMIN'] },
  { id: 'academic', label: 'Agenda Acadêmica', icon: <GraduationCap size={20} />, roles: 'all' },
  { id: 'admin', label: 'Administração', icon: <Settings size={20} />, roles: ['ADMIN', 'LIBRARIAN'] },
]

function Sidebar({ currentScreen, currentUser, onNavigate, onSwitchProfile, collapsed, onToggle }: { currentScreen: Screen; currentUser: User; onNavigate: (s: Screen) => void; onSwitchProfile: () => void; collapsed: boolean; onToggle: () => void }) {
  const visibleNav = NAV_ITEMS.filter(n => n.roles === 'all' || n.roles.includes(currentUser.role))

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 98, display: 'none' }} className="mobile-overlay" onClick={onToggle} />}
      <aside style={{ position: 'fixed', top: 0, left: collapsed ? -240 : 0, width: 240, height: '100vh', background: 'var(--etec-slate)', display: 'flex', flexDirection: 'column', zIndex: 99, transition: 'left 0.25s cubic-bezier(.4,0,.2,1)', boxShadow: collapsed ? 'none' : '2px 0 12px rgba(0,0,0,0.15)' }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'var(--etec-red)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 16, fontStyle: 'italic' }}>E</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#fff', lineHeight: 1 }}>Etec</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 500, marginTop: 1 }}>Antônio Furlan</div>
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Agendamento Escolar</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
          {visibleNav.map(item => {
            const active = currentScreen === item.id
            return (
              <button key={item.id} onClick={() => { onNavigate(item.id); if (window.innerWidth < 768) onToggle() }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 6, border: active ? '1px solid rgba(148,22,17,0.3)' : '1px solid transparent', background: active ? 'rgba(148,22,17,0.18)' : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,0.68)', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginBottom: 2, textAlign: 'left', borderLeft: active ? '3px solid var(--etec-red)' : '3px solid transparent', transition: 'all 0.12s' }}>
                <span style={{ fontSize: 16, width: 20, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding: '12px 12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 50, background: 'var(--etec-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              {currentUser.avatar}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 500 }}>{ROLE_LABELS[currentUser.role]}</div>
            </div>
          </div>
          <button onClick={onSwitchProfile} style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, padding: '7px 12px', cursor: 'pointer' }}>
            ⇄ Trocar perfil
          </button>
        </div>
      </aside>
    </>
  )
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar({ title, subtitle, onNewReservation, onMenuToggle, canReserve }: { title: string; subtitle?: string; onNewReservation: () => void; onMenuToggle: () => void; canReserve: boolean }) {
  return (
    <header style={{ height: 56, background: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10, gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onMenuToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 20, padding: 4, display: 'flex', alignItems: 'center' }}>☰</button>
        <div>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1 }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{subtitle}</p>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500, fontFamily: 'Inter' }}>Sex, 15 ago 2026</div>
        {canReserve && <Btn variant="primary" onClick={onNewReservation} icon={<span style={{ fontSize: 16, lineHeight: 1 }}>+</span>}>Nova reserva</Btn>}
      </div>
    </header>
  )
}

// ─── Dashboard Screen ─────────────────────────────────────────────────────────

function DashboardScreen({ user, onNavigate, onNewReservation, reservations }: { user: User; onNavigate: (s: Screen) => void; onNewReservation: () => void; reservations: Reservation[] }) {
  const todayRes = reservations.filter(r => r.date === today)
  const available = SPACES.filter(s => s.active && !reservations.some(r => r.date === today && r.spaceId === s.id && r.status === 'APPROVED')).length
  const pending = reservations.filter(r => r.status === 'PENDING').length
  const upcoming = ACADEMIC_EVENTS.filter(e => e.date >= today).length

  const weekDays = getWeekDays(today)

  return (
    <div style={{ padding: '28px 28px 40px' }}>
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-1)' }}>Bom dia, {user.name.split(' ')[0]}! 👋</h2>
        <p style={{ color: 'var(--text-3)', fontSize: 14, marginTop: 4 }}>Aqui está um resumo do seu dia em <strong>15 de agosto de 2026</strong>.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="Reservas hoje" value={todayRes.length} icon={<Calendar size={24} />} variant="accent" />
        <StatCard label="Espaços disponíveis" value={available} icon={<Building2 size={24} />} variant="success" />
        <StatCard label="Pendências" value={pending} icon={<Clock size={24} />} variant="warning" />
        <StatCard label="Próximos eventos" value={upcoming} icon={<GraduationCap size={24} />} variant="neutral" />
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Upcoming reservations */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 700, fontSize: 15 }}>Reservas de hoje</h3>
              <button onClick={() => onNavigate('agenda')} style={{ background: 'none', border: 'none', color: 'var(--etec-red)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Ver agenda →</button>
            </div>
            <div>
              {todayRes.length === 0 ? <EmptyState icon={<Inbox size={48} />} title="Nenhuma reserva hoje" /> : todayRes.map(r => (
                <div key={r.id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{getSpaceName(r.spaceId)} · {r.startAt}–{r.endAt}</div>
                  </div>
                  <Badge status={r.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Week overview */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontWeight: 700, fontSize: 15 }}>Visão da semana</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0 }}>
              {weekDays.map((d, i) => {
                const dayRes = reservations.filter(r => r.date === d)
                const isToday = d === today
                return (
                  <div key={d} style={{ padding: '14px 12px', borderRight: i < 4 ? '1px solid var(--border)' : 'none', background: isToday ? 'var(--etec-red-light)' : 'transparent' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: isToday ? 'var(--etec-red)' : 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{WEEKDAY_SHORT[i]}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: isToday ? 'var(--etec-red)' : 'var(--text-1)', marginBottom: 8 }}>{d.slice(8)}</div>
                    {dayRes.length === 0 ? <div style={{ fontSize: 12, color: 'var(--text-4)' }}>Livre</div> : dayRes.slice(0, 2).map(r => (
                      <div key={r.id} style={{ fontSize: 11, padding: '3px 6px', borderRadius: 4, marginBottom: 4, background: r.status === 'APPROVED' ? 'var(--status-approved-bg)' : 'var(--status-pending-bg)', color: r.status === 'APPROVED' ? 'var(--status-approved-text)' : 'var(--status-pending-text)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.startAt} {getSpaceName(r.spaceId).split(' ')[0]}</div>
                    ))}
                    {dayRes.length > 2 && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>+{dayRes.length - 2} mais</div>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Quick actions */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Atalhos rápidos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: <Calendar size={18} />, label: 'Nova reserva', action: onNewReservation, primary: true },
                { icon: <CalendarDays size={18} />, label: 'Ver agenda', action: () => onNavigate('agenda') },
                { icon: <Building2 size={18} />, label: 'Consultar espaços', action: () => onNavigate('spaces') },
                { icon: <GraduationCap size={18} />, label: 'Agenda acadêmica', action: () => onNavigate('academic') },
              ].map(q => (
                <button key={q.label} onClick={q.action} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${q.primary ? 'var(--etec-red)' : 'var(--border)'}`, background: q.primary ? 'var(--etec-red-light)' : 'var(--surface)', color: q.primary ? 'var(--etec-red)' : 'var(--text-1)', fontWeight: 600, fontSize: 14, cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s' }}>
                  <span style={{ fontSize: 18 }}>{q.icon}</span>
                  <span>{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming academic events */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 700, fontSize: 15 }}>Próximos eventos</h3>
              <button onClick={() => onNavigate('academic')} style={{ background: 'none', border: 'none', color: 'var(--etec-red)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Ver todos →</button>
            </div>
            {ACADEMIC_EVENTS.slice(0, 4).map(ev => (
              <div key={ev.id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: EVENT_TYPE_COLORS[ev.type].bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: EVENT_TYPE_COLORS[ev.type].text, lineHeight: 1 }}>{ev.date.slice(8)}</div>
                  <div style={{ fontSize: 10, color: EVENT_TYPE_COLORS[ev.type].text, fontWeight: 600 }}>{MONTH_NAMES[parseInt(ev.date.slice(5, 7)) - 1].slice(0, 3)}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{ev.subject}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Agenda Screen ────────────────────────────────────────────────────────────

function AgendaScreen({ onNewReservation, reservations }: { onNewReservation: (spaceId?: string, date?: string, hour?: string) => void; reservations: Reservation[] }) {
  const [view, setView] = useState<'day' | 'week'>('week')
  const [currentDate, setCurrentDate] = useState(today)
  const [filterType, setFilterType] = useState<SpaceType | 'ALL'>('ALL')

  const weekDays = getWeekDays(currentDate)
  const filteredSpaces = SPACES.filter(s => s.active && (filterType === 'ALL' || s.type === filterType))

  function moveDate(n: number) {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + (view === 'day' ? n : n * 7))
    setCurrentDate(d.toISOString().slice(0, 10))
  }

  function getReservationForSlot(spaceId: string, date: string, hour: string): Reservation | undefined {
    return reservations.find(r => r.spaceId === spaceId && r.date === date && r.startAt <= hour && r.endAt > hour && (r.status === 'APPROVED' || r.status === 'PENDING'))
  }

  const displayDays = view === 'day' ? [currentDate] : weekDays

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20, minHeight: 0 }}>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {(['day', 'week'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: '7px 16px', border: 'none', background: view === v ? 'var(--etec-slate)' : 'transparent', color: view === v ? '#fff' : 'var(--text-2)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              {v === 'day' ? 'Dia' : 'Semana'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <button onClick={() => moveDate(-1)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, width: 32, height: 32, cursor: 'pointer', fontWeight: 700 }}>‹</button>
          <span style={{ padding: '0 10px', fontSize: 14, fontWeight: 600, color: 'var(--text-1)', minWidth: 160, textAlign: 'center' }}>
            {view === 'day' ? `${parseInt(currentDate.slice(8))} de ${MONTH_NAMES[parseInt(currentDate.slice(5, 7)) - 1]}` : `${parseInt(weekDays[0].slice(8))}–${parseInt(weekDays[4].slice(8))} ${MONTH_NAMES[parseInt(weekDays[0].slice(5, 7)) - 1]}`}
          </span>
          <button onClick={() => moveDate(1)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, width: 32, height: 32, cursor: 'pointer', fontWeight: 700 }}>›</button>
        </div>
        <button onClick={() => setCurrentDate(today)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--text-2)' }}>Hoje</button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)' }}>Tipo:</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value as SpaceType | 'ALL')} style={{ ...inputStyle, width: 'auto', padding: '7px 12px', fontSize: 13 }}>
            <option value="ALL">Todos</option>
            <option value="LAB">Laboratório</option>
            <option value="LIBRARY">Biblioteca</option>
            <option value="MAKER">Espaço Maker</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        {(['APPROVED', 'PENDING', 'REJECTED', 'CANCELLED'] as ReservationStatus[]).map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, ...statusStyle(s) as any, border: 'none' }} />
            <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>{STATUS_LABELS[s]}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'auto', flex: 1 }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: `72px repeat(${filteredSpaces.length}, 1fr)`, borderBottom: '2px solid var(--border)', position: 'sticky', top: 0, background: '#fff', zIndex: 2 }}>
          <div style={{ padding: '12px 8px', borderRight: '1px solid var(--border)' }} />
          {filteredSpaces.map(s => (
            <div key={s.id} style={{ padding: '10px 12px', borderRight: '1px solid var(--border)', minWidth: 120 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-1)' }}>{s.name.replace('Laboratório de Informática', 'Lab Info').replace('Laboratório de Hardware', 'Lab HW')}</div>
              <SpaceTypeBadge type={s.type} />
            </div>
          ))}
        </div>
        {/* Time slots */}
        {HOURS.map((hour, hi) => (
          <div key={hour} style={{ display: 'grid', gridTemplateColumns: `72px repeat(${filteredSpaces.length}, 1fr)`, borderBottom: hi < HOURS.length - 1 ? '1px solid var(--surface-2)' : 'none' }}>
            <div style={{ padding: '8px', borderRight: '1px solid var(--border)', fontSize: 12, color: 'var(--text-4)', fontWeight: 600, fontFamily: 'Inter', textAlign: 'right', paddingRight: 10 }}>{hour}</div>
            {filteredSpaces.map(s => {
              const date = displayDays[0]
              const res = getReservationForSlot(s.id, date, hour)
              const isStart = res && res.startAt === hour
              return (
                <div key={s.id} onClick={() => !res && onNewReservation(s.id, date, hour)} style={{ borderRight: '1px solid var(--surface-2)', minHeight: 36, padding: 3, cursor: res ? 'default' : 'pointer', position: 'relative', transition: 'background 0.1s' }}
                  onMouseEnter={e => { if (!res) (e.currentTarget as HTMLElement).style.background = 'var(--etec-red-light)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                  {isStart && res && (
                    <div style={{ ...statusStyle(res.status), borderRadius: 5, padding: '4px 8px', fontSize: 12, fontWeight: 600, lineHeight: 1.3, overflow: 'hidden' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{res.title}</div>
                      <div style={{ fontSize: 11, opacity: 0.8 }}>{res.startAt}–{res.endAt} · {res.participants}p</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Spaces Screen ────────────────────────────────────────────────────────────

function SpacesScreen({ user, onNewReservation, reservations }: { user: User; onNewReservation: (spaceId?: string) => void; reservations: Reservation[] }) {
  const [filterType, setFilterType] = useState<SpaceType | 'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null)

  const isAdmin = user.role === 'ADMIN' || user.role === 'IT_TECH'

  const filtered = SPACES.filter(s => s.active && (filterType === 'ALL' || s.type === filterType) && (search === '' || s.name.toLowerCase().includes(search.toLowerCase())))

  function isAvailableNow(s: Space) {
    return !reservations.some(r => r.spaceId === s.id && r.date === today && r.status === 'APPROVED')
  }

  return (
    <div style={{ padding: '24px 28px' }}>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <input placeholder="🔍  Buscar espaço..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 240 }} />
        <div style={{ display: 'flex', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {(['ALL', 'LAB', 'LIBRARY', 'MAKER'] as const).map(t => (
            <button key={t} onClick={() => setFilterType(t)} style={{ padding: '8px 16px', border: 'none', background: filterType === t ? 'var(--etec-slate)' : 'transparent', color: filterType === t ? '#fff' : 'var(--text-2)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              {t === 'ALL' ? 'Todos' : SPACE_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? <EmptyState icon="🏫" title="Nenhum espaço encontrado" sub="Tente ajustar os filtros acima" /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
          {filtered.map(s => (
            <SpaceCard 
              key={s.id} 
              space={s} 
              isAvailable={isAvailableNow(s)} 
              isAdmin={isAdmin} 
              onReserve={(id) => onNewReservation(id)} 
              onViewDetails={(space) => setSelectedSpace(space)} 
            />
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selectedSpace && (
        <Modal title={selectedSpace.name} onClose={() => setSelectedSpace(null)} wide>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            <SpaceTypeBadge type={selectedSpace.type} />
            <span style={{ fontSize: 12, fontWeight: 600, color: isAvailableNow(selectedSpace) ? 'var(--status-approved-text)' : 'var(--status-rejected-text)', background: isAvailableNow(selectedSpace) ? 'var(--status-approved-bg)' : 'var(--status-rejected-bg)', padding: '2px 10px', borderRadius: 20 }}>
              {isAvailableNow(selectedSpace) ? '● Disponível agora' : '● Ocupado agora'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Localização</div>
              <div style={{ fontSize: 14, color: 'var(--text-1)', fontWeight: 500 }}>{selectedSpace.location}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Capacidade</div>
              <div style={{ fontSize: 14, color: 'var(--text-1)', fontWeight: 500 }}>{selectedSpace.capacity} pessoas</div>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Equipamentos</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{selectedSpace.equipment.map(e => <Chip key={e} label={e} />)}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Softwares</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{selectedSpace.software.map(sw => <Chip key={sw} label={sw} />)}</div>
          </div>
          <div style={{ marginBottom: 20, background: 'var(--surface)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Regras de uso</div>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{selectedSpace.rules}</p>
          </div>
          {selectedSpace.requiresApproval && (
            <div style={{ background: 'var(--status-pending-bg)', border: '1px solid var(--status-pending-border)', borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: 'var(--status-pending-text)', fontWeight: 600 }}>⚠️ Este espaço requer aprovação de um funcionário/gestor antes de ser confirmado.</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn variant="secondary" onClick={() => setSelectedSpace(null)}>Fechar</Btn>
            <Btn variant="primary" onClick={() => { setSelectedSpace(null); onNewReservation(selectedSpace.id) }}>Fazer reserva</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── New Reservation Modal ────────────────────────────────────────────────────

function NewReservationModal({ onClose, onSuccess, preSpaceId, preDate, preHour, reservations }: { onClose: () => void; onSuccess: (msg: string, res?: Reservation) => void; preSpaceId?: string; preDate?: string; preHour?: string; reservations: Reservation[] }) {
  const [spaceId, setSpaceId] = useState(preSpaceId ?? '')
  const [date, setDate] = useState(preDate ?? today)
  const [startAt, setStartAt] = useState(preHour ?? '07:30')
  const [endAt, setEndAt] = useState('09:10')
  const [purpose, setPurpose] = useState('')
  const [participants, setParticipants] = useState(1)
  const [recurrent, setRecurrent] = useState(false)

  const space = SPACES.find(s => s.id === spaceId)

  const conflict = spaceId && reservations.some(r => r.spaceId === spaceId && r.date === date && r.status !== 'CANCELLED' && r.status !== 'REJECTED' && !(endAt <= r.startAt || startAt >= r.endAt))
  const overCapacity = space && participants > space.capacity

  function handleSubmit() {
    if (conflict || overCapacity || !spaceId || !purpose) return
    const requiresApproval = space?.requiresApproval
    const newRes: Reservation = {
      id: `r${Date.now()}`, spaceId: spaceId, userId: 'u1', title: purpose.split('\n')[0], purpose,
      startAt, endAt, participants, status: requiresApproval ? 'PENDING' : 'APPROVED', date
    }
    onSuccess(requiresApproval ? 'Solicitação enviada! Aguardando aprovação do responsável.' : 'Reserva criada com sucesso! 🎉', newRes)
    onClose()
  }

  return (
    <Modal title="Nova reserva" onClose={onClose} wide>
      <FormField label="Espaço *">
        <select value={spaceId} onChange={e => setSpaceId(e.target.value)} style={inputStyle}>
          <option value="">Selecionar espaço...</option>
          {SPACES.filter(s => s.active).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </FormField>

      {space && (
        <div style={{ background: 'var(--surface)', borderRadius: 8, padding: '12px 16px', marginBottom: 18, fontSize: 13, color: 'var(--text-2)' }}>
          📍 {space.location} · 👥 Capacidade: {space.capacity} pessoas
          {space.requiresApproval && <span style={{ marginLeft: 10, color: 'var(--status-pending-text)', fontWeight: 600 }}>⚠️ Requer aprovação</span>}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <FormField label="Data *">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
        </FormField>
        <FormField label="Início *">
          <select value={startAt} onChange={e => setStartAt(e.target.value)} style={inputStyle}>
            {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </FormField>
        <FormField label="Fim *">
          <select value={endAt} onChange={e => setEndAt(e.target.value)} style={inputStyle}>
            {HOURS.filter(h => h > startAt).map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </FormField>
      </div>

      <FormField label="Finalidade *">
        <textarea value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="Descreva o objetivo da reserva..." style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} />
      </FormField>

      <FormField label="Participantes *" hint={space ? `Máximo: ${space.capacity} pessoas` : undefined}>
        <input type="number" min={1} max={space?.capacity ?? 999} value={participants} onChange={e => setParticipants(Number(e.target.value))} style={inputStyle} />
      </FormField>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '12px 16px', background: 'var(--surface)', borderRadius: 8 }}>
        <input type="checkbox" id="recurrent" checked={recurrent} onChange={e => setRecurrent(e.target.checked)} style={{ width: 16, height: 16 }} />
        <label htmlFor="recurrent" style={{ fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Reserva recorrente (semanal)</label>
      </div>

      {/* Conflict alert */}
      {conflict && (
        <div style={{ background: 'var(--status-rejected-bg)', border: '1px solid var(--status-rejected-border)', borderRadius: 8, padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, color: 'var(--status-rejected-text)', fontSize: 14, marginBottom: 4 }}>⛔ Horário indisponível</div>
          <div style={{ color: 'var(--status-rejected-text)', fontSize: 13 }}>Este espaço já possui uma reserva ativa neste período. Escolha outro horário ou espaço.</div>
        </div>
      )}

      {/* Over capacity alert */}
      {overCapacity && !conflict && (
        <div style={{ background: 'var(--status-rejected-bg)', border: '1px solid var(--status-rejected-border)', borderRadius: 8, padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, color: 'var(--status-rejected-text)', fontSize: 14 }}>⚠️ Quantidade excede a capacidade do espaço ({space?.capacity} pessoas)</div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
        <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
        <Btn variant="primary" onClick={handleSubmit} disabled={!!(conflict || overCapacity || !spaceId || !purpose)}>
          {space?.requiresApproval ? 'Enviar solicitação' : 'Criar reserva'}
        </Btn>
      </div>
    </Modal>
  )
}

// ─── My Reservations Screen ───────────────────────────────────────────────────

function MyReservationsScreen({ user, onNewReservation, reservations, setReservations }: { user: User; onNewReservation: () => void; reservations: Reservation[]; setReservations: React.Dispatch<React.SetStateAction<Reservation[]>> }) {
  const [filterStatus, setFilterStatus] = useState<ReservationStatus | 'ALL'>('ALL')
  const [confirm, setConfirm] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const mine = reservations.filter(r => r.userId === user.id && (filterStatus === 'ALL' || r.status === filterStatus))

  function cancelReservation(id: string) {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'CANCELLED' } : r))
    setConfirm(null)
    setToast('Reserva cancelada. O horário foi liberado.')
  }

  return (
    <div style={{ padding: '24px 28px' }}>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {(['ALL', 'APPROVED', 'PENDING', 'CANCELLED', 'REJECTED'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '7px 14px', border: 'none', background: filterStatus === s ? 'var(--etec-slate)' : 'transparent', color: filterStatus === s ? '#fff' : 'var(--text-2)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              {s === 'ALL' ? 'Todos' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <Btn variant="primary" small onClick={onNewReservation} icon={<span>+</span>}>Nova reserva</Btn>
      </div>

      {mine.length === 0 ? <EmptyState icon="📋" title="Nenhuma reserva encontrada" sub="Clique em Nova reserva para começar" /> : (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface)', borderBottom: '2px solid var(--border)' }}>
                {['Espaço', 'Data', 'Horário', 'Finalidade', 'Participantes', 'Status', 'Ações'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mine.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: i < mine.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600 }}>{getSpaceName(r.spaceId)}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-2)', fontFamily: 'Inter' }}>{r.date.split('-').reverse().join('/')}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-2)', fontFamily: 'Inter', whiteSpace: 'nowrap' }}>{r.startAt}–{r.endAt}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-2)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.purpose}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-2)', textAlign: 'center', fontFamily: 'Inter' }}>{r.participants}</td>
                  <td style={{ padding: '14px 16px' }}><Badge status={r.status} /></td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {r.status !== 'CANCELLED' && r.status !== 'REJECTED' && (
                        <Btn variant="danger" small onClick={() => setConfirm(r.id)}>Cancelar</Btn>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirm && <ConfirmDialog title="Cancelar reserva" message="Tem certeza que deseja cancelar esta reserva? O horário será liberado imediatamente." danger onConfirm={() => cancelReservation(confirm)} onCancel={() => setConfirm(null)} />}
      {toast && <Toast msg={toast} type="success" onClose={() => setToast(null)} />}
    </div>
  )
}

// ─── Academic Calendar Screen ─────────────────────────────────────────────────

function AcademicScreen({ user }: { user: User }) {
  const canCreate = user.role === 'CLASS_REP' || user.role === 'ADMIN'
  const [events, setEvents] = useState(ACADEMIC_EVENTS)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', type: 'EXAM' as EventType, subject: '', date: '', time: '', description: '' })

  function handleCreate() {
    if (!form.title || !form.date || !form.subject) return
    setEvents(prev => [...prev, { id: `e${Date.now()}`, classId: '3A', ...form }])
    setShowForm(false)
    setForm({ title: '', type: 'EXAM', subject: '', date: '', time: '', description: '' })
    setToast('Evento acadêmico publicado com sucesso!')
  }

  const upcoming = events.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  const past = events.filter(e => e.date < today).sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div style={{ padding: '24px 28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Agenda Acadêmica</h2>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 3 }}>Turma 3ºA Informática — 2026</p>
        </div>
        {canCreate && <Btn variant="primary" onClick={() => setShowForm(true)} icon={<span>+</span>}>Novo evento</Btn>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        {/* Events list */}
        <div>
          {upcoming.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Próximos eventos</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {upcoming.map(ev => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Passados</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {past.map(ev => (
                  <div key={ev.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center', opacity: 0.65 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--surface-2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-3)', lineHeight: 1 }}>{ev.date.slice(8)}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-4)', fontWeight: 600 }}>{MONTH_NAMES[parseInt(ev.date.slice(5, 7)) - 1].slice(0, 3)}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{ev.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{ev.subject}</div>
                    </div>
                    <EventBadge type={ev.type} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mini legend */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Tipos de evento</h3>
          {(Object.entries(EVENT_TYPE_LABELS) as [EventType, string][]).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: EVENT_TYPE_COLORS[k].bg, border: `2px solid ${EVENT_TYPE_COLORS[k].text}` }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-2)' }}>{v}</span>
            </div>
          ))}
          {!canCreate && (
            <div style={{ marginTop: 16, padding: '12px', background: 'var(--surface)', borderRadius: 8, fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>
              ℹ️ Apenas Representantes de sala e Gestores podem publicar eventos acadêmicos.
            </div>
          )}
        </div>
      </div>

      {/* Create event modal */}
      {showForm && (
        <Modal title="Novo evento acadêmico" onClose={() => setShowForm(false)}>
          <FormField label="Título *">
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Ex: Prova de Programação Web" style={inputStyle} />
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormField label="Tipo *">
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as EventType }))} style={inputStyle}>
                {(Object.entries(EVENT_TYPE_LABELS) as [EventType, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </FormField>
            <FormField label="Disciplina *">
              <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Ex: Programação Web" style={inputStyle} />
            </FormField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormField label="Data *">
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
            </FormField>
            <FormField label="Horário (opcional)">
              <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} style={inputStyle} />
            </FormField>
          </div>
          <FormField label="Descrição">
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Detalhes sobre o evento..." style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} />
          </FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
            <Btn variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Btn>
            <Btn variant="primary" onClick={handleCreate} disabled={!form.title || !form.date || !form.subject}>Publicar evento</Btn>
          </div>
        </Modal>
      )}

      {toast && <Toast msg={toast} type="success" onClose={() => setToast(null)} />}
    </div>
  )
}

// ─── Admin Screen ─────────────────────────────────────────────────────────────

function AdminScreen({ user, reservations, setReservations }: { user: User; reservations: Reservation[]; setReservations: React.Dispatch<React.SetStateAction<Reservation[]>> }) {
  const [tab, setTab] = useState<'spaces' | 'users' | 'reservations' | 'events'>('spaces')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [showNewSpace, setShowNewSpace] = useState(false)

  function approve(id: string) {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r))
    setToast({ msg: 'Reserva aprovada com sucesso!', type: 'success' })
  }

  function reject(id: string) {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r))
    setToast({ msg: 'Reserva rejeitada.', type: 'info' })
  }

  const isLibrarian = user.role === 'LIBRARIAN'

  const tabs = [
    { id: 'spaces', label: '🏫 Espaços' },
    { id: 'users', label: '👥 Usuários' },
    { id: 'reservations', label: '📋 Reservas' },
    { id: 'events', label: '🎓 Eventos' },
  ] as const

  return (
    <div style={{ padding: '24px 28px' }}>
      <div style={{ display: 'flex', gap: 0, marginBottom: 28, background: 'var(--surface)', borderRadius: 10, padding: 4, border: '1px solid var(--border)', width: 'fit-content' }}>
        {tabs.filter(t => !isLibrarian || t.id === 'reservations').map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '9px 20px', borderRadius: 7, border: 'none', background: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? 'var(--text-1)' : 'var(--text-3)', fontWeight: tab === t.id ? 700 : 500, fontSize: 14, cursor: 'pointer', boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Spaces tab */}
      {tab === 'spaces' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>Gerenciar espaços</h3>
            <Btn variant="primary" small onClick={() => setShowNewSpace(true)} icon={<span>+</span>}>Novo espaço</Btn>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface)', borderBottom: '2px solid var(--border)' }}>
                  {['Nome', 'Tipo', 'Localização', 'Cap.', 'Aprovação', 'Status', 'Ações'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SPACES.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: i < SPACES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '13px 16px', fontWeight: 600, fontSize: 14 }}>{s.name}</td>
                    <td style={{ padding: '13px 16px' }}><SpaceTypeBadge type={s.type} /></td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-2)' }}>{s.location}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, fontFamily: 'Inter', textAlign: 'center' }}>{s.capacity}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13 }}>{s.requiresApproval ? <span style={{ color: 'var(--status-pending-text)', fontWeight: 600 }}>Sim</span> : <span style={{ color: 'var(--text-3)' }}>Não</span>}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ background: s.active ? 'var(--status-approved-bg)' : 'var(--status-cancelled-bg)', color: s.active ? 'var(--status-approved-text)' : 'var(--status-cancelled-text)', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>
                        {s.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Btn variant="secondary" small>Editar</Btn>
                        <Btn variant="ghost" small>Recursos</Btn>
                        <Btn variant="danger" small>Inativar</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users tab */}
      {tab === 'users' && (
        <div>
          <div style={{ marginBottom: 18 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>Usuários simulados</h3>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>No MVP, os usuários são simulados. Seleção de perfil disponível na tela inicial.</p>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface)', borderBottom: '2px solid var(--border)' }}>
                  {['Avatar', 'Nome', 'Perfil', 'Turma', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {USERS.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: i < USERS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 50, background: 'var(--etec-slate)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>{u.avatar}</div>
                    </td>
                    <td style={{ padding: '13px 16px', fontWeight: 600, fontSize: 14 }}>{u.name}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>{ROLE_LABELS[u.role]}</span>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-3)' }}>{u.classGroup ?? '—'}</td>
                    <td style={{ padding: '13px 16px' }}><span style={{ background: 'var(--status-approved-bg)', color: 'var(--status-approved-text)', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>Ativo</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reservations tab */}
      {tab === 'reservations' && (
        <div>
          <div style={{ marginBottom: 18 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>{isLibrarian ? 'Solicitações pendentes' : 'Todas as reservas'}</h3>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface)', borderBottom: '2px solid var(--border)' }}>
                  {['Espaço', 'Título', 'Data', 'Horário', 'Participantes', 'Status', 'Ações'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reservations.filter(r => !isLibrarian || r.status === 'PENDING').map((r, i, arr) => (
                  <tr key={r.id} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600 }}>{getSpaceName(r.spaceId).split(' ').slice(0, 3).join(' ')}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13 }}>{r.title}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, fontFamily: 'Inter' }}>{r.date.split('-').reverse().join('/')}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, fontFamily: 'Inter', whiteSpace: 'nowrap' }}>{r.startAt}–{r.endAt}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, textAlign: 'center', fontFamily: 'Inter' }}>{r.participants}</td>
                    <td style={{ padding: '13px 16px' }}><Badge status={r.status} /></td>
                    <td style={{ padding: '13px 16px' }}>
                      {r.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Btn variant="primary" small onClick={() => approve(r.id)}>Aprovar</Btn>
                          <Btn variant="danger" small onClick={() => reject(r.id)}>Rejeitar</Btn>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Events tab */}
      {tab === 'events' && (
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 18 }}>Eventos acadêmicos</h3>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface)', borderBottom: '2px solid var(--border)' }}>
                  {['Título', 'Tipo', 'Disciplina', 'Turma', 'Data', 'Ações'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ACADEMIC_EVENTS.map((ev, i) => (
                  <tr key={ev.id} style={{ borderBottom: i < ACADEMIC_EVENTS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '13px 16px', fontWeight: 600, fontSize: 14 }}>{ev.title}</td>
                    <td style={{ padding: '13px 16px' }}><EventBadge type={ev.type} /></td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-2)' }}>{ev.subject}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-2)' }}>{ev.classId}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, fontFamily: 'Inter' }}>{ev.date.split('-').reverse().join('/')}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Btn variant="secondary" small>Editar</Btn>
                        <Btn variant="danger" small>Excluir</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New space modal placeholder */}
      {showNewSpace && (
        <Modal title="Novo espaço" onClose={() => setShowNewSpace(false)} wide>
          <FormField label="Nome do espaço *"><input placeholder="Ex: Laboratório de Informática 03" style={inputStyle} /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormField label="Tipo *">
              <select style={inputStyle}><option>Laboratório</option><option>Biblioteca</option><option>Espaço Maker</option></select>
            </FormField>
            <FormField label="Capacidade *"><input type="number" placeholder="30" style={inputStyle} /></FormField>
          </div>
          <FormField label="Localização"><input placeholder="Ex: Bloco A — Sala 106" style={inputStyle} /></FormField>
          <FormField label="Regras de uso"><textarea placeholder="Regras e restrições do espaço..." style={{ ...inputStyle, minHeight: 80 }} /></FormField>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <input type="checkbox" id="req-approval" style={{ width: 16, height: 16 }} />
            <label htmlFor="req-approval" style={{ fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Requer aprovação de funcionário</label>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
            <Btn variant="secondary" onClick={() => setShowNewSpace(false)}>Cancelar</Btn>
            <Btn variant="primary" onClick={() => { setShowNewSpace(false); setToast({ msg: 'Espaço criado com sucesso!', type: 'success' }) }}>Criar espaço</Btn>
          </div>
        </Modal>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

// ─── App Shell ────────────────────────────────────────────────────────────────

function AppShell({ user, onSwitchProfile }: { user: User; onSwitchProfile: () => void }) {
  const [reservations, setReservations] = useState<Reservation[]>(RESERVATIONS)
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showNewReservation, setShowNewReservation] = useState(false)
  const [preSpaceId, setPreSpaceId] = useState<string | undefined>()
  const [preDate, setPreDate] = useState<string | undefined>()
  const [preHour, setPreHour] = useState<string | undefined>()
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)

  const canReserve = ['TEACHER', 'STUDENT', 'CLASS_REP', 'ADMIN', 'LIBRARIAN'].includes(user.role)

  function openNewReservation(spaceId?: string, date?: string, hour?: string) {
    setPreSpaceId(spaceId)
    setPreDate(date)
    setPreHour(hour)
    setShowNewReservation(true)
  }

  const screenTitles: Record<Screen, { title: string; subtitle?: string }> = {
    dashboard: { title: 'Dashboard', subtitle: 'Visão geral do sistema' },
    agenda: { title: 'Agenda de Espaços', subtitle: 'Visualize disponibilidade e gerencie reservas' },
    spaces: { title: 'Espaços', subtitle: 'Laboratórios, Biblioteca e Espaço Maker' },
    'my-reservations': { title: 'Minhas Reservas', subtitle: 'Suas reservas e solicitações' },
    academic: { title: 'Agenda Acadêmica', subtitle: 'Provas, trabalhos e compromissos da turma' },
    admin: { title: 'Administração', subtitle: 'Gestão de espaços, usuários e reservas' },
  }

  const { title, subtitle } = screenTitles[screen]

  useEffect(() => {
    function handleResize() { setSidebarOpen(window.innerWidth >= 768) }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--surface)' }}>
      <Sidebar currentScreen={screen} currentUser={user} onNavigate={setScreen} onSwitchProfile={onSwitchProfile} collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(v => !v)} />

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? 240 : 0, transition: 'margin-left 0.25s cubic-bezier(.4,0,.2,1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar title={title} subtitle={subtitle} onNewReservation={() => openNewReservation()} onMenuToggle={() => setSidebarOpen(v => !v)} canReserve={canReserve} />

        <main style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {screen === 'dashboard' && <DashboardScreen user={user} onNavigate={setScreen} onNewReservation={() => openNewReservation()} reservations={reservations} />}
          {screen === 'agenda' && <AgendaScreen onNewReservation={openNewReservation} reservations={reservations} />}
          {screen === 'spaces' && <SpacesScreen user={user} onNewReservation={spaceId => openNewReservation(spaceId)} reservations={reservations} />}
          {screen === 'my-reservations' && <MyReservationsScreen user={user} onNewReservation={() => openNewReservation()} reservations={reservations} setReservations={setReservations} />}
          {screen === 'academic' && <AcademicScreen user={user} />}
          {screen === 'admin' && <AdminScreen user={user} reservations={reservations} setReservations={setReservations} />}
        </main>
      </div>

      {/* Overlay when sidebar open on mobile */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 98 }} onClick={() => setSidebarOpen(false)} />
      )}

      {showNewReservation && (
        <NewReservationModal
          onClose={() => setShowNewReservation(false)}
          onSuccess={(msg, newRes) => {
            setToast({ msg, type: 'success' })
            if (newRes) setReservations(prev => [...prev, newRes])
          }}
          preSpaceId={preSpaceId}
          preDate={preDate}
          preHour={preHour}
          reservations={reservations}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  if (!currentUser) return <ProfileSelectScreen onSelect={setCurrentUser} />
  return <AppShell user={currentUser} onSwitchProfile={() => setCurrentUser(null)} />
}
