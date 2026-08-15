import { UserRole, ReservationStatus, EventType, SpaceType } from '../types'

export const ROLE_LABELS: Record<UserRole, string> = {
  STUDENT: 'Aluno',
  CLASS_REP: 'Representante de Sala',
  TEACHER: 'Professor',
  LIBRARIAN: 'Bibliotecário/Funcionário',
  ADMIN: 'Gestor/Administrador',
  IT_TECH: 'Técnico de TI',
}

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  STUDENT: 'Consulta espaços, disponibilidade e agenda acadêmica',
  CLASS_REP: 'Publica e edita eventos acadêmicos da própria turma',
  TEACHER: 'Cria reservas de laboratórios e gerencia as próprias reservas',
  LIBRARIAN: 'Aprova ou rejeita solicitações de Biblioteca e Espaço Maker',
  ADMIN: 'Acesso total — CRUD de espaços, usuários, reservas e eventos',
  IT_TECH: 'Visualiza laboratórios, reservas e atualiza recursos',
}

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  APPROVED: 'Aprovada',
  PENDING: 'Pendente',
  REJECTED: 'Rejeitada',
  CANCELLED: 'Cancelada',
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  EXAM: 'Prova',
  ASSIGNMENT: 'Trabalho',
  DEADLINE: 'Prazo',
  VISIT: 'Visita',
  ACTIVITY: 'Atividade',
  OTHER: 'Outro',
}

export const EVENT_TYPE_COLORS: Record<EventType, { bg: string; text: string }> = {
  EXAM: { bg: '#fdecea', text: '#941611' },
  ASSIGNMENT: { bg: '#e8f0fe', text: '#1a56a4' },
  DEADLINE: { bg: '#fff8e6', text: '#a05f00' },
  VISIT: { bg: '#e8f5ee', text: '#1a7a4a' },
  ACTIVITY: { bg: '#f0ebfe', text: '#5b21b6' },
  OTHER: { bg: '#f0f2f4', text: '#5c6975' },
}

export const SPACE_TYPE_LABELS: Record<SpaceType, string> = {
  LAB: 'Laboratório',
  LIBRARY: 'Biblioteca',
  MAKER: 'Espaço Maker',
}

export const HOURS = ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00']

export const WEEKDAY_SHORT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
export const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
