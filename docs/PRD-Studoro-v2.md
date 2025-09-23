# PRD - Studoro v2.0
**Sistema de Estudos Inteligente com Gamificação**

## 1. VISÃO GERAL DO PRODUTO

### Objetivo
Transformar o Studoro em um sistema completo de estudos que rivaliza com o aprovado.app, mantendo o design espacial único e adicionando funcionalidades avançadas de produtividade.

### Proposta de Valor
- **Timer Inteligente:** Pomodoro + Cronômetro livre com pause/resume
- **Gestão Completa de Matérias:** CRUD, ícones, cores, metas semanais
- **Analytics Avançado:** Relatórios de produtividade, gráficos, tendências
- **Gamificação Completa:** XP, levels, conquistas, streaks
- **Sincronização Multi-dispositivo:** Via Supabase

## 2. FUNCIONALIDADES PRINCIPAIS

### 2.1 Sistema de Matérias
**Funcionalidades:**
- ✅ CRUD completo (criar, editar, excluir matérias)
- ✅ Ícones personalizáveis (biblioteca de 50+ ícones)
- ✅ Cores personalizáveis (paleta de 12 cores)
- 🆕 Metas semanais por matéria (horas/sessões)
- 🆕 Tracking automático de tempo por matéria
- 🆕 Histórico de sessões por matéria
- 🆕 Priorização de matérias

**Dados Supabase:**
```sql
subjects:
- id, user_id, name, icon, color
- target_hours_per_week, total_study_time, total_sessions
- created_at, updated_at
```

### 2.2 Timer Inteligente
**Funcionalidades:**
- ✅ Timer Pomodoro (25min + pausas)
- 🆕 Cronômetro Livre (sem limite de tempo)
- 🆕 Seleção de matéria antes de iniciar
- 🆕 Pausa/Resume com preservação de estado
- 🆕 Sons de notificação personalizáveis
- 🆕 Modos de foco (silencioso, concentração)

**Dados Supabase:**
```sql
study_sessions:
- id, user_id, subject_id, session_type
- started_at, ended_at, duration_minutes
- xp_earned, created_at
```

### 2.3 Dashboard de Analytics
**Funcionalidades:**
- 📊 Tempo total estudado (hoje, semana, mês)
- 📈 Gráfico de produtividade semanal
- 🎯 Progresso das metas por matéria
- 📅 Histórico de sessões (últimas 30)
- 🏆 Conquistas desbloqueadas
- 📱 Estatísticas comparativas (vs semana anterior)

**Métricas Principais:**
- Total de horas estudadas
- Sessões completadas por dia
- Matéria mais estudada
- Streak atual vs recorde
- Taxa de conclusão de metas

### 2.4 Sistema de Gamificação
**Funcionalidades:**
- 🎮 Sistema de XP dinâmico
- 📊 Levels com requisitos progressivos
- 🔥 Streaks diários com multiplicadores
- 🏆 Sistema de conquistas (25+ conquistas)
- 🎖️ Ranking semanal/mensal
- 💎 Recompensas por marcos

**Conquistas Implementadas:**
- Primeira Sessão, Madrugador, Noturno
- Foco Total (25min sem parar)
- Streak Master (7, 30, 100 dias)
- Especialista (50h numa matéria)
- Multitasker (estudar 5 matérias em 1 dia)

### 2.5 Perfil de Usuário
**Funcionalidades:**
- 👤 Perfil pessoal com avatar
- 🎯 Metas pessoais configuráveis
- 📈 Estatísticas históricas
- 🏆 Galeria de conquistas
- ⚙️ Preferências de estudo

## 3. ARQUITETURA TÉCNICA

### 3.1 Frontend
- **React 18** + TypeScript
- **Tailwind CSS** + Design System Espacial
- **Zustand** para estado local + cache
- **React Query** para sincronização
- **Recharts** para gráficos

### 3.2 Backend
- **Supabase** como backend completo
- **PostgreSQL** para dados
- **Row Level Security** para privacidade
- **Realtime** para sincronização instantânea
- **Edge Functions** para lógica complexa

### 3.3 Banco de Dados
```sql
-- Tabelas principais
profiles (id, username, total_xp, current_level, current_streak, longest_streak)
subjects (id, user_id, name, icon, color, target_hours_per_week, total_study_time)
study_sessions (id, user_id, subject_id, session_type, started_at, ended_at, duration_minutes, xp_earned)
achievements (id, name, description, condition_type, condition_value, xp_reward, icon)
user_achievements (id, user_id, achievement_id, unlocked_at)
```

## 4. JORNADA DO USUÁRIO

### 4.1 Primeira Utilização
1. **Boas-vindas** → Explicação das funcionalidades
2. **Criar Matérias** → Pelo menos 2 matérias iniciais
3. **Primeira Sessão** → Tutorial do timer Pomodoro
4. **Gamificação** → Primeiros XP e conquista "Primeira Sessão"

### 4.2 Uso Diário
1. **Dashboard** → Ver progresso do dia anterior
2. **Selecionar Matéria** → Escolher o que estudar
3. **Iniciar Timer** → Pomodoro ou cronômetro livre
4. **Completar Sessão** → XP + atualização de stats
5. **Analytics** → Verificar metas e progresso

## 5. CRONOGRAMA DE IMPLEMENTAÇÃO

### Fase 1: Backend Setup (Hoje)
- ✅ Configurar Supabase
- ✅ Criar tabelas com RLS
- ✅ Implementar auth básico
- ✅ Migrations e seeds iniciais

### Fase 2: Sistema Core (Hoje)
- ✅ Integrar Supabase com estado atual
- ✅ Sistema de matérias persistente
- ✅ Timer com registro de sessões
- ✅ Gamificação básica (XP + levels)

### Fase 3: Analytics (Hoje)
- ✅ Dashboard com métricas
- ✅ Gráficos de produtividade
- ✅ Sistema de conquistas
- ✅ Histórico de sessões

## 6. MÉTRICAS DE SUCESSO

### Engajamento
- Sessões por usuário/dia: Target 3+
- Tempo médio de sessão: Target 25min
- Retenção D7: Target 60%
- Streak médio: Target 5 dias

### Funcionalidade
- Matérias criadas por usuário: Target 5+
- Conquistas desbloqueadas: Target 10+ em 30 dias
- Metas atingidas: Target 70%
- Sincronização: 99.9% uptime

## 7. DIFERENCIAIS vs CONCORRÊNCIA

### vs aprovado.app
- ✅ Design espacial único e moderno
- ✅ Gamificação mais avançada
- ✅ Timer Pomodoro nativo
- ✅ Interface mais intuitiva
- ✅ Sincronização em tempo real

### Funcionalidades Exclusivas
- 🌌 Tema espacial com animações
- ⚡ Timer híbrido (Pomodoro + Livre)
- 🎮 Sistema de conquistas gamificado
- 📊 Analytics em tempo real
- 🔥 Streaks com multiplicadores XP

---

**Status:** ✅ PRD Aprovado - Iniciando Implementação
**Prazo:** Implementação completa hoje
**Responsável:** AI Developer