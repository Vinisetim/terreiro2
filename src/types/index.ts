export type UserRole = 'STUDENT' | 'CLASS_REP' | 'TEACHER' | 'LIBRARIAN' | 'ADMIN' | 'IT_TECH'
export type SpaceType = 'LAB' | 'LIBRARY' | 'MAKER'
export type ReservationStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'CANCELLED'
export type EventType = 'EXAM' | 'ASSIGNMENT' | 'DEADLINE' | 'VISIT' | 'ACTIVITY' | 'OTHER'
export type Screen = 'dashboard' | 'agenda' | 'spaces' | 'my-reservations' | 'academic' | 'admin'

export interface User { id: string; name: string; role: UserRole; classGroup?: string; avatar: string }
export interface Space { id: string; name: string; type: SpaceType; location: string; capacity: number; equipment: string[]; software: string[]; rules: string; requiresApproval: boolean; active: boolean }
export interface Reservation { id: string; spaceId: string; userId: string; title: string; purpose: string; startAt: string; endAt: string; participants: number; status: ReservationStatus; date: string }
export interface AcademicEvent { id: string; classId: string; title: string; type: EventType; subject: string; date: string; time?: string; description: string }
