# Especificação de Design System & Modelos de Tela (Penpot / Bootswatch) — Classdoor

**Projeto:** Classdoor  
**Documento:** Arquitetura de UI/UX, Design Tokens, Biblioteca de Assets (Ativos/Componentes) e Estrutura Multi-Páginas no Penpot  
**Data:** 2026-09-01  
**Responsável UI/UX:** @Iris (UI/UX Designer)  
**Stakeholder / CTO:** @domaragao  
**Equipe:** @Atlas (PM), @Dijkstra (Tech Lead), @Aria (Frontend), @Peter (Backend), @QA (Quality Assurance), @Hermes (Friday)  

---

## 🎨 Biblioteca de Assets & Design Tokens no Penpot

Os tokens e ativos foram formalmente cadastrados no painel nativo de **Assets (Ativos/Componentes)** e **Tokens** do Penpot:

### 1. Paleta de Cores da Biblioteca (`LibraryColor` — 10 Cores Oficiais)
- **Primary (Navy):** `#2C3E50` (Ações primárias, Navbar, Headers)
- **Success / Accent (Teal):** `#18BC9C` (Badges de anonimato, submissões, confirmações)
- **Warning (Amber):** `#F39C12` (Rating por estrelas ★, avisos moderados)
- **Danger (Coral):** `#E74C3C` (Erros de validação, notas baixas)
- **Info (Blue):** `#3498DB` (Tags secundárias, links informativos)
- **Surface (White):** `#FFFFFF` (Fundo de cards e modais)
- **Background (Light):** `#F8F9FA` (Superfície geral da tela)
- **Text Dark:** `#2C3E50` (Texto principal — WCAG AAA)
- **Text Muted:** `#7B8A8B` (Texto de apoio e legendas — WCAG AA)
- **Border / Stroke:** `#CED4DA` (Bordas de inputs e divisores)

### 2. Escala Tipográfica da Biblioteca (`LibraryTypography` — 7 Escalas)
- **Display 1 — Hero:** 28px, Bold (700), Line-height 36px
- **Heading 2 — Page Title:** 22px, Bold (700), Line-height 28px
- **Heading 3 — Card Title:** 18px, SemiBold (600), Line-height 24px
- **Heading 4 — Section:** 16px, SemiBold (600), Line-height 22px
- **Body Regular:** 14px, Regular (400), Line-height 20px
- **Body SemiBold / Label:** 13px, SemiBold (600), Line-height 18px
- **Small / Badge / Caption:** 11px, SemiBold (600), Line-height 14px

### 3. Catálogo de Design Tokens (`TokenCatalog` — 27 Tokens)
- **Cores:** `color.primary`, `color.success`, `color.warning`, `color.danger`, `color.info`, `color.background`, `color.surface`, `color.text.dark`, `color.text.muted`, `color.border`
- **Espaçamentos:** `spacing.xs` (4px), `spacing.sm` (8px), `spacing.md` (16px), `spacing.lg` (24px), `spacing.xl` (32px), `spacing.xxl` (48px)
- **Bordas / Raio:** `radius.sm` (4px), `radius.md` (8px), `radius.lg` (12px), `radius.pill` (24px)
- **Tamanhos de Fonte:** `fontSize.xs` (11px), `fontSize.sm` (13px), `fontSize.base` (14px), `fontSize.md` (16px), `fontSize.lg` (18px), `fontSize.xl` (22px), `fontSize.xxl` (28px)

---

## 📑 Estrutura Multi-Páginas no Workspace Penpot (3 Páginas Oficiais)

1. **📄 Página 1: `Desktop` (Grid 12 Colunas — 1440px):**
   - `1A. Desktop - Login (US02)` ⭐ *(Flow Starting Point)*
   - `1B. Desktop - Cadastro (US01)`
   - `2. Home & Busca Global (US03)`
   - `3. Perfil de Docente & Reviews (US04 & US07)`
   - `4. Modal de Avaliação Anônima & Nominal (US05 & US06)`
   - `5. Painel Docente & Dashboard (US08 & US09)`

2. **📱 Página 2: `Mobile` (Viewport 390px — Mobile-First):**
   - `1A. Mobile - Login (US02)` ⭐ *(Flow Starting Point)*
   - `1B. Mobile - Cadastro de Usuário (US01)`
   - `2. Mobile - Home & Busca Global (US03)`
   - `3. Mobile - Perfil Docente & Reviews (US04 & US07)`
   - `4. Mobile - Modal de Avaliação (US05 & US06)`
   - `5. Mobile - Painel Docente & Dashboard (US08 & US09)`

3. **🎨 Página 3: `Design System & Tokens`:**
   - Vitrine visual com amostras cromáticas de todos os tokens de cor.
   - Escala tipográfica completa documentada.
   - Mostruário de componentes reutilizáveis (botões, badges, inputs, scorecards de métricas).

---

## 🔗 Fluxos e Conexões de Prototipagem Interativa (Navegação Ativa)

- **Desktop Flow:** `1A. Login` ◄──► `1B. Cadastro` ──► `2. Home` ──► `3. Perfil` ◄──► `4. Modal` | `5. Dashboard`
- **Mobile Flow:** `1A. Login` ◄──► `1B. Cadastro` ──► `2. Home` ──► `3. Perfil` ◄──► `4. Modal` | `5. Dashboard`

---

## 🌐 Entregáveis Sincronizados
1. 🎨 **Arquivo Penpot (Fonte Única da Verdade):** 3 páginas completas com 12 pranchetas responsivas + vitrine de tokens, biblioteca de componentes e fluxos interativos.
2. 📄 **Documentação Técnica:** [`especificacoes/Especificacao-Design-System-Penpot.md`](Especificacao-Design-System-Penpot.md) sincronizada entre GitHub Docs e Obsidian Vault.
