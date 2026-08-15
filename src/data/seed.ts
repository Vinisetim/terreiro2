import { User, Space, Reservation, AcademicEvent } from '../types'

export const USERS: User[] = [
  { id: 'u1', name: 'Lucas Oliveira', role: 'STUDENT', classGroup: '3ºA Informática', avatar: 'LO' },
  { id: 'u2', name: 'Mariana Costa', role: 'CLASS_REP', classGroup: '3ºA Informática', avatar: 'MC' },
  { id: 'u3', name: 'Prof. Ricardo Santos', role: 'TEACHER', avatar: 'RS' },
  { id: 'u4', name: 'Ana Ferreira', role: 'LIBRARIAN', avatar: 'AF' },
  { id: 'u5', name: 'Carlos Mendes', role: 'ADMIN', avatar: 'CM' },
  { id: 'u6', name: 'Thiago Alves', role: 'IT_TECH', avatar: 'TA' },
]

export const SPACES: Space[] = [
  { id: 's1', name: 'Laboratório de Informática 01', type: 'LAB', location: 'Bloco A — Sala 104', capacity: 30, equipment: ['Computadores', 'Projetor', 'Ar-condicionado'], software: ['VS Code', 'Java JDK', 'Photoshop', 'MySQL'], rules: 'Proibido alimentos. Salvar trabalhos em nuvem. Desligar computadores ao sair.', requiresApproval: false, active: true },
  { id: 's2', name: 'Laboratório de Informática 02', type: 'LAB', location: 'Bloco A — Sala 105', capacity: 30, equipment: ['Computadores', 'Projetor', 'Smart TV'], software: ['VS Code', 'Python', 'Figma', 'Node.js'], rules: 'Proibido alimentos. Salvar trabalhos em nuvem.', requiresApproval: false, active: true },
  { id: 's3', name: 'Laboratório de Hardware', type: 'LAB', location: 'Bloco B — Sala 201', capacity: 20, equipment: ['Bancadas', 'Multímetros', 'Ferros de solda', 'Osciloscópio'], software: ['Proteus', 'AutoCAD'], rules: 'EPI obrigatório. Acompanhamento de professor necessário.', requiresApproval: false, active: true },
  { id: 's4', name: 'Biblioteca', type: 'LIBRARY', location: 'Bloco Central — Térreo', capacity: 40, equipment: ['Computadores', 'Impressora', 'Escâner'], software: ['Internet', 'Office'], rules: 'Silêncio. Empréstimo de livros requer cadastro. Restrição de grupos acima de 10.', requiresApproval: true, active: true },
  { id: 's5', name: 'Espaço Maker', type: 'MAKER', location: 'Bloco C — Sala 301', capacity: 25, equipment: ['Impressora 3D', 'Cortadora laser', 'Bancadas', 'Ferramentas'], software: ['Tinkercad', 'Fusion 360'], rules: 'Uso supervisionado. EPI obrigatório para equipamentos. Aprovação necessária.', requiresApproval: true, active: true },
]

export const today = '2026-08-15'
export const RESERVATIONS: Reservation[] = [
  { id: 'r1', spaceId: 's1', userId: 'u3', title: 'Aula de Programação Web', purpose: 'Aula prática de HTML/CSS', startAt: '07:30', endAt: '09:10', participants: 28, status: 'APPROVED', date: today },
  { id: 'r2', spaceId: 's2', userId: 'u3', title: 'Projeto Final — Python', purpose: 'Orientação de projetos finais', startAt: '09:30', endAt: '11:10', participants: 25, status: 'APPROVED', date: today },
  { id: 'r3', spaceId: 's4', userId: 'u1', title: 'Pesquisa em grupo', purpose: 'Trabalho de conclusão de curso', startAt: '13:00', endAt: '15:00', participants: 5, status: 'PENDING', date: today },
  { id: 'r4', spaceId: 's5', userId: 'u2', title: 'Impressão 3D — Projeto IoT', purpose: 'Impressão de case para projeto', startAt: '10:00', endAt: '12:00', participants: 3, status: 'PENDING', date: today },
  { id: 'r5', spaceId: 's3', userId: 'u3', title: 'Manutenção preventiva', purpose: 'Aula de hardware e montagem', startAt: '14:00', endAt: '16:00', participants: 18, status: 'APPROVED', date: today },
  { id: 'r6', spaceId: 's1', userId: 'u3', title: 'Banco de Dados — SQL', purpose: 'Prática de queries', startAt: '07:30', endAt: '09:10', participants: 30, status: 'APPROVED', date: '2026-08-16' },
  { id: 'r7', spaceId: 's2', userId: 'u6', title: 'Atualização de sistemas', purpose: 'Instalação de atualizações', startAt: '07:00', endAt: '09:00', participants: 1, status: 'APPROVED', date: '2026-08-16' },
  { id: 'r8', spaceId: 's4', userId: 'u1', title: 'Leitura individual', purpose: 'Pesquisa bibliográfica', startAt: '09:00', endAt: '11:00', participants: 1, status: 'CANCELLED', date: '2026-08-14' },
]

export const ACADEMIC_EVENTS: AcademicEvent[] = [
  { id: 'e1', classId: '3A', title: 'Prova de Programação Web', type: 'EXAM', subject: 'Programação Web', date: '2026-08-18', time: '07:30', description: 'Avaliação bimestral — HTML, CSS e JavaScript' },
  { id: 'e2', classId: '3A', title: 'Entrega — Projeto Final', type: 'ASSIGNMENT', subject: 'TCC', date: '2026-08-22', description: 'Entrega do relatório parcial do projeto de conclusão' },
  { id: 'e3', classId: '3A', title: 'Prazo matrícula 2027', type: 'DEADLINE', subject: 'Administrativo', date: '2026-08-25', description: 'Último dia para solicitação de matrícula no próximo ano' },
  { id: 'e4', classId: '3A', title: 'Visita técnica — Empresa XYZ', type: 'VISIT', subject: 'Estágio', date: '2026-08-28', time: '08:00', description: 'Visita à empresa parceira para apresentação de oportunidades de estágio' },
  { id: 'e5', classId: '3A', title: 'Prova de Banco de Dados', type: 'EXAM', subject: 'Banco de Dados', date: '2026-09-02', time: '09:30', description: 'Avaliação — SQL e modelagem relacional' },
]
