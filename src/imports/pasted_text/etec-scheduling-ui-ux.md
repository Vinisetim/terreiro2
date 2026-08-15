Use este prompt no **Figma AI**, anexando também o PDF do PDD como referência. A identidade visual deve seguir as cores e características do material da ETEC, enquanto a organização visual deve se inspirar no ClickUp da imagem, sem copiar a interface. O PDD define o MVP, as telas e as funcionalidades do sistema.  

# Design de UI/UX — Sistema Integrado de Agendamento Escolar ETEC Antônio Furlan

Crie o design completo de uma aplicação web responsiva para a **ETEC Antônio Furlan**, chamada **Sistema Integrado de Agendamento Escolar**.

Use o **PDF PDD anexado como fonte principal de verdade para funcionalidades, perfis, fluxos e telas**. Não invente funcionalidades que não estejam previstas no PDD.

## 1. Identidade visual

Utilize a identidade visual apresentada na referência da ETEC São Paulo:

* Vermelho principal: **RGB 148, 22, 17** / **CMYK 0, 100, 100, 30** / Pantone **7626 C**
* Azul/cinza escuro: **RGB 74, 85, 92** / **CMYK 32, 0, 0, 77** / Pantone **7545 C**
* Branco como cor predominante de fundo.
* Preto/cinza muito escuro para textos.
* Visual institucional, moderno, limpo e profissional.
* Utilizar o vermelho principalmente para ações importantes, estados de destaque e elementos relacionados à identidade da ETEC.
* Utilizar o azul/cinza escuro para navegação, títulos, elementos estruturais e informações secundárias.
* Evitar excesso de cores.
* Criar uma hierarquia visual clara e acessível.

A identidade deve transmitir **tecnologia, organização, educação e confiabilidade**, sem parecer excessivamente corporativa.

## 2. Referência de layout

Use a interface do **ClickUp fornecida na imagem como referência de organização e experiência de uso**, principalmente:

* Sidebar vertical fixa.
* Navegação por módulos.
* Área principal ampla.
* Cards e blocos de informação.
* Barra superior com ações e contexto da página.
* Uso de filtros.
* Organização semelhante a um sistema de gestão profissional.

IMPORTANTE: não copie o design do ClickUp. Use apenas os conceitos de organização, hierarquia, navegação e gerenciamento de informações.

A interface final deve parecer um **produto próprio da ETEC**, com identidade visual institucional.

## 3. Estrutura geral

Criar uma aplicação desktop-first, mas totalmente responsiva para notebook, tablet e smartphone.

### Sidebar

Criar uma sidebar moderna contendo:

* Logo ETEC Antônio Furlan.
* Dashboard
* Agenda
* Espaços
* Minhas reservas
* Agenda acadêmica
* Administração
* Configurações

Na parte inferior:

* Perfil do usuário
* Nome do usuário
* Tipo/perfil atual
* Botão para alternar usuário/perfil para demonstração

A navegação deve mudar de acordo com as permissões do perfil.

## 4. Dashboard

Criar um dashboard moderno inspirado na organização do ClickUp.

Mostrar:

### Resumo

* Reservas de hoje
* Próximos eventos
* Espaços disponíveis
* Reservas pendentes
* Atalhos principais

### Cards principais

Criar cards com informações resumidas e visualmente fáceis de entender.

Exemplo:

**Reservas hoje**
12 reservas

**Espaços disponíveis**
5 espaços

**Pendências**
3 solicitações

**Próximos eventos**
4 eventos

### Atalhos

Criar botões destacados:

* Nova reserva
* Ver agenda
* Consultar espaços
* Criar evento

## 5. Agenda de espaços

Criar uma tela de calendário com visual profissional.

Permitir alternar entre:

* Dia
* Semana
* Mês

A visualização principal deve mostrar claramente:

* Horários
* Espaços
* Reservas
* Status das reservas

Utilizar diferentes tratamentos visuais para:

* APROVADA
* PENDENTE
* REJEITADA
* CANCELADA

Adicionar filtros:

* Tipo de espaço
* Data
* Horário
* Capacidade
* Equipamento
* Software

Adicionar botão destacado:

**+ Nova reserva**

O usuário deve conseguir identificar rapidamente horários livres e ocupados.

## 6. Tela de espaços

Criar uma página com cards ou lista de espaços.

Cada espaço deve mostrar:

* Nome
* Tipo
* Localização
* Capacidade
* Status
* Equipamentos
* Softwares
* Regras
* Disponibilidade

Tipos:

* Laboratório
* Biblioteca
* Espaço Maker

Exemplo de card:

**Laboratório de Informática 01**

Capacidade: 30 pessoas

Localização: Bloco A

Equipamentos: Computadores, projetor

Softwares: VS Code, Java, Photoshop

Status: Disponível

Botão:

**Ver disponibilidade**

Para administradores, adicionar:

* Editar
* Inativar
* Gerenciar recursos

## 7. Formulário de nova reserva

Criar uma tela/modal clara e simples.

Campos:

* Espaço
* Data
* Horário inicial
* Horário final
* Finalidade
* Quantidade de participantes
* Recorrência

Mostrar automaticamente:

* Capacidade máxima do espaço.
* Disponibilidade.
* Conflitos de horário.

Quando existir conflito, mostrar uma mensagem visual clara:

**Horário indisponível**

**Este espaço já possui uma reserva neste período.**

Nunca permitir que o usuário pense que a reserva foi criada quando existe conflito.

## 8. Minhas reservas

Criar uma página contendo todas as reservas do usuário.

Utilizar tabela/lista com:

* Espaço
* Data
* Horário
* Finalidade
* Status
* Ações

Ações:

* Ver detalhes
* Editar
* Cancelar

Utilizar badges de status visualmente claros.

## 9. Agenda acadêmica

Criar uma página específica para eventos acadêmicos.

Mostrar calendário + lista de eventos.

Tipos:

* Prova
* Trabalho
* Prazo
* Visita
* Atividade
* Outro

Cada evento deve apresentar:

* Título
* Disciplina
* Turma
* Data
* Horário
* Descrição
* Tipo

Adicionar botão:

**+ Novo evento**

Representantes podem criar e editar eventos da própria turma.

Alunos podem somente visualizar.

## 10. Administração

Criar uma área administrativa organizada como um painel de gestão.

Seções:

### Espaços

* Criar
* Editar
* Inativar
* Gerenciar recursos

### Usuários

Como o MVP utiliza usuários simulados, permitir apenas visualização/seleção dos usuários necessários para demonstração.

### Reservas

Permitir consultar e administrar reservas.

### Eventos

Permitir consultar e gerenciar eventos acadêmicos.

## 11. Perfis

Criar experiência baseada nos seguintes perfis:

* Aluno
* Representante de sala
* Professor
* Bibliotecário/Funcionário
* Gestor/Administrador
* Técnico de TI

A interface deve alterar menus e ações conforme o perfil.

Exemplo:

### Aluno

Pode consultar espaços, disponibilidade e agenda acadêmica.

### Professor

Pode criar reservas de laboratórios e gerenciar suas próprias reservas.

### Bibliotecário/Funcionário

Pode aprovar ou rejeitar solicitações da Biblioteca e Espaço Maker.

### Administrador

Possui acesso aos módulos administrativos.

## 12. UX e componentes

Criar um design system consistente.

Componentes:

* Buttons
* Inputs
* Selects
* Dropdowns
* Cards
* Tables
* Badges
* Modals
* Toast notifications
* Tabs
* Calendar
* Sidebar
* Header
* Empty states
* Loading states
* Error states
* Confirmation dialogs

Utilizar bordas levemente arredondadas, sombras discretas e bastante espaço em branco.

Não deixar a interface visualmente carregada.

## 13. Estados do sistema

Criar estados visuais para:

* Sucesso
* Erro
* Conflito
* Pendente
* Aprovado
* Rejeitado
* Cancelado
* Disponível
* Indisponível

Exemplo de sucesso:

**Reserva criada com sucesso!**

Exemplo de conflito:

**Não foi possível criar a reserva. Este horário já está ocupado.**

## 14. Responsividade

Criar versões:

* Desktop
* Tablet
* Mobile

No mobile:

* Sidebar deve virar menu lateral retrátil.
* Cards devem se reorganizar verticalmente.
* Calendário deve ser adaptado para telas pequenas.
* Formulários devem utilizar largura total.
* Ações importantes devem permanecer facilmente acessíveis.

## 15. Estilo visual desejado

O resultado deve parecer um **SaaS moderno de gestão escolar**, combinando:

**ETEC + ClickUp + dashboard administrativo moderno**

Visual:

* Minimalista
* Institucional
* Tecnológico
* Organizado
* Profissional
* Acessível

Não utilizar aparência genérica de template.

A identidade ETEC deve ser imediatamente reconhecível.

## 16. Telas que devem ser criadas

Criar pelo menos estas telas:

1. Entrada / Seleção de perfil
2. Dashboard
3. Agenda de espaços
4. Espaços
5. Detalhes do espaço
6. Nova reserva
7. Minhas reservas
8. Detalhes da reserva
9. Agenda acadêmica
10. Criar evento acadêmico
11. Administração
12. Gerenciamento de espaços

Criar também os principais estados de interação e mensagens de feedback.

## 17. Prioridade

Priorize nesta ordem:

1. Clareza da navegação
2. Agenda e reservas
3. Visualização de disponibilidade
4. Dashboard
5. Gestão de espaços
6. Agenda acadêmica
7. Administração
8. Responsividade
9. Polimento visual

O design deve representar fielmente o MVP descrito no PDD, cujo foco é centralizar reservas de laboratórios, biblioteca, Espaço Maker e compromissos acadêmicos. 

Crie componentes reutilizáveis e mantenha consistência visual entre todas as telas.
