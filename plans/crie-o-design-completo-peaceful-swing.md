# Plano — Sistema Integrado de Agendamento Escolar (ETEC Antônio Furlan)

## Contexto

O usuário quer o design completo de uma aplicação web responsiva para a ETEC Antônio Furlan. A base de dados de referência é o PDD (Product Design Document) do Hackathon + identidade visual ETEC (imagem.png) + layout ClickUp como inspiração de organização (image-1.png). O projeto atual é um App.tsx vazio (apenas dot-grid placeholder). Não há roteador nem design system — tudo será construído do zero em React + Tailwind v4.

## Stance & Design Tokens

- **Stance**: Minimalista institucional — limpo, estruturado, profissional, tecnológico
- **Fonts**: `DM Sans` (headings e UI) + `Inter` (body/tabular) — ambas Google Fonts públicas
- **Paleta** (fiel à identidade ETEC):
  - `--primary`: `#941611` (vermelho ETEC) — ações principais, badges destaque, logo
  - `--structure`: `#4A555C` (azul-cinza escuro) — sidebar, headers, navegação
  - `--background`: `#FFFFFF` — fundo principal
  - `--surface`: `#F4F5F7` — fundo de cards/seções
  - `--border`: `#E2E6EA`
  - `--text-primary`: `#1A2128`
  - `--text-secondary`: `#5C6975`
  - Status: `APROVADA` → verde `#1A7A4A`; `PENDENTE` → âmbar `#C97B00`; `REJEITADA` → vermelho `#941611`; `CANCELADA` → cinza `#5C6975`

## Arquivos a modificar

1. **`src/index.css`** — Google Fonts @import + variáveis CSS + reset mínimo + estilos base
2. **`src/App.tsx`** — aplicação completa com navegação por estado React (sem roteador externo)

## Estrutura do App (tudo em App.tsx via componentes locais)

### Tela 1 — Seleção de perfil (entrada/demo)
- Logo ETEC Antônio Furlan (SVG inline com "Etec" + "Antônio Furlan" estilizados nas cores oficiais)
- Cards de perfil selecionáveis: Aluno, Representante de sala, Professor, Bibliotecário/Funcionário, Gestor/Admin, Técnico de TI
- Cada card mostra avatar com ícone, nome, descrição breve das permissões
- Botão "Entrar no sistema" ativa após selecionar
- Fundo branco, centralizado, visual limpo

### Shell da aplicação
- **Sidebar fixa** (240px desktop, retrátil mobile):
  - Logo ETEC topo
  - Navegação: Dashboard, Agenda, Espaços, Minhas Reservas, Agenda Acadêmica, Administração (visível apenas Admin/Gestor), Configurações
  - Rodapé: avatar do usuário, nome, perfil, botão "Trocar perfil"
  - Background `#4A555C`, texto branco, item ativo com destaque vermelho
- **Topbar** (height 56px): título da página, breadcrumb, botão "+ Nova reserva" (vermelho)
- **Main area**: scroll vertical, padding generoso

### Tela 2 — Dashboard
- Linha de 4 stat cards: Reservas Hoje (12), Espaços Disponíveis (5), Pendências (3), Próximos Eventos (4)
- Seção "Próximas reservas" — lista compacta com espaço, horário, status badge
- Seção "Atalhos rápidos" — 4 botões grandes: Nova Reserva, Ver Agenda, Consultar Espaços, Criar Evento
- Seção "Agenda da semana" — mini-calendário horizontal de 5 dias com slots ocupados

### Tela 3 — Agenda de Espaços
- Filtros horizontais: Tipo de espaço, Data, Capacidade
- Toggle views: Dia | Semana | Mês
- Vista Semana: grid de horários (07:00–22:00) × espaços (Lab Info 01, Lab Info 02, Biblioteca, Espaço Maker)
- Blocos coloridos por status (APROVADA verde, PENDENTE âmbar, etc.)
- Clique no slot abre modal de nova reserva pré-preenchido

### Tela 4 — Espaços
- Grid de cards (3 colunas desktop, 2 tablet, 1 mobile)
- Cada card: nome, tipo badge, localização, capacidade, equipamentos (chips), softwares (chips), status disponível/indisponível
- Filtros: Tipo, Capacidade, Equipamento, Software, Status
- Admin vê botões Editar/Inativar/Recursos em cada card

### Tela 5 — Modal de Nova Reserva
- Overlay modal sobre a tela atual
- Campos: Espaço (select), Data, Horário Inicial, Horário Final, Finalidade (textarea), Participantes (number), Recorrência (toggle + tipo + data fim)
- Preview automático de disponibilidade — barra colorida
- Alerta de conflito visual destacado se houver sobreposição
- Botões: Cancelar | Criar Reserva

### Tela 6 — Minhas Reservas
- Tabela com: Espaço, Data, Horário, Finalidade, Status (badge), Ações (Ver/Editar/Cancelar)
- Filtros: Status, Data, Espaço
- Confirmation dialog ao cancelar

### Tela 7 — Agenda Acadêmica
- Mini calendário mensal + lista de eventos ao lado
- Tipos de evento: Prova, Trabalho, Prazo, Visita, Atividade, Outro (cores distintas)
- Formulário inline/modal de novo evento (para Representante/Admin)
- Aluno vê somente leitura

### Tela 8 — Administração
- Tabs: Espaços | Usuários | Reservas | Eventos
- Espaços: tabela com CRUD (criar modal, editar inline, inativar)
- Usuários: lista de perfis simulados (somente visualização no MVP)
- Reservas: tabela global com filtros e ação de aprovar/rejeitar (Biblioteca/Maker)
- Eventos: tabela de eventos acadêmicos com edição

## Dados de demonstração (seed embutido no React state)

3 laboratórios (Lab Info 01 — 30 alunos, Lab Info 02 — 30 alunos, Lab Hardware — 20 alunos), 1 Biblioteca (40), 1 Espaço Maker (25). Reservas: mistura de APROVADA, PENDENTE, CANCELADA em dias próximos a 15/08/2026. Eventos: prova, trabalho, visita. Usuários: 1 de cada perfil.

## Componentes reutilizáveis (inline em App.tsx)

`Badge`, `StatCard`, `SpaceCard`, `ReservationRow`, `EventChip`, `Sidebar`, `Topbar`, `Modal`, `Toast`, `ConfirmDialog`, `CalendarWeekGrid`, `MiniCalendar`, `FilterBar`, `EmptyState`

## Responsividade

- Desktop (≥1024px): sidebar fixa + conteúdo ao lado
- Tablet (768–1023px): sidebar colapsável via hamburguer
- Mobile (<768px): sidebar como drawer, cards em coluna, calendário simplificado

## Verificação

Após implementar: checar hot reload no preview, navegar todas as 8 telas, testar troca de perfil (menu no rodapé da sidebar muda navegação), testar abertura/fechamento do modal de reserva, verificar responsividade redimensionando a janela.
