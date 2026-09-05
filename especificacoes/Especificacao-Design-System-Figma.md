# Especificação de Design System & Modelos de Tela (Figma / Bootswatch) — Classdoor

**Projeto:** Classdoor  
**Documento:** Arquitetura de UI/UX, Design Tokens, Vitrine de Ícones Oficiais, Biblioteca de Assets e Estrutura Multi-Páginas no Figma  
**Data:** 2026-09-01 (Atualizado: 2026-09-04)  
**Responsável UI/UX:** @Iris (UI/UX Designer)  
**Stakeholder / CTO:** @domaragao  
**Equipe:** @Atlas (PM), @Dijkstra (Tech Lead), @Aria (Frontend), @Peter (Backend), @QA (Quality Assurance), @Hermes (Friday)  
**Link Oficial do Figma (SSOT):** [Classdoor no Figma](https://www.figma.com/design/LxCytRCFqQGshvVnVnDxum/Classdoor?t=SFiBuyhBNLwICYN1-0)

> **📌 Fonte Única da Verdade (SSOT):** O arquivo oficial do **Figma** ([Classdoor no Figma](https://www.figma.com/design/LxCytRCFqQGshvVnVnDxum/Classdoor?t=SFiBuyhBNLwICYN1-0)) é a **Fonte Única da Verdade (Single Source of Truth)** para todo o design visual, tokens, biblioteca de ícones, componentes reutilizáveis e fluxos de prototipagem interativa do projeto Classdoor. O modelo legado no Penpot foi substituído.

---

## 🎨 Diretriz Oficial de Ícones: Bootstrap Icons (Monocromáticos)

Em total conformidade com os critérios de acessibilidade (WCAG 2.1 AA) e com o ecossistema **React 19 + Bootswatch Flatly**:
1. **Eliminação de Emojis Nativos:** Todos os emojis coloridos do sistema operacional foram removidos das interfaces no Figma e código, eliminando disparidades visuais entre plataformas.
2. **Ícones Monocromáticos (Bootstrap Icons `bi-*`):** Todos os ícones herdam dinamicamente a cor semântica do componente ou texto correspondente (`currentColor`, `text-primary`, `text-success`, `text-muted`), assegurando contraste > 4.5:1.

---

## 🎨 Estrutura Multi-Páginas no Workspace Figma (3 Páginas Oficiais)

O arquivo oficial do Classdoor no Figma está estruturado em **três páginas dedicadas**:

### 📄 Página 1: `Desktop` (Grid 12 Colunas — 1440px)
| # | Nome do Frame / Prancheta | User Stories | Dimensões | Elementos & Escopo |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `1A. Desktop - Login (US02)` ⭐ *(Starting Point)* | US02 | 1440 × 900 px | Formulário de login, alternância para cadastro e recuperação |
| 2 | `1B. Desktop - Cadastro (US01)` | US01 | 1440 × 900 px | Formulário de criação de conta institucional |
| 3 | `1C. Desktop - Recuperação de Senha (US02)` | US02 | 1440 × 900 px | Formulário de envio de link de recuperação |
| 4 | `2. Home & Busca Global (US03)` | US03 | 1440 × 960 px | Hero section, busca centralizada, autocomplete e catálogo |
| 5 | `3. Perfil de Docente & Reviews (US04 & US07)` | US04, US07 | 1440 × 1000 px | Scorecards de métricas pedagógicas e feed de avaliações |
| 6 | `4. Modal de Avaliação Anônima & Nominal (US05 & US06)` | US05, US06 | 1440 × 960 px | Modal com sliders/estrelas, tags e toggle de anonimato |
| 7 | `5. Painel Docente & Dashboard (US08 & US09)` | US08, US09 | 1440 × 960 px | Gráficos de evolução, relatórios e exportação PDF/CSV |

---

### 📱 Página 2: `Mobile` (Viewport 390px — Mobile-First)
| # | Nome do Frame / Prancheta | User Stories | Dimensões | Elementos & Escopo |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `1A. Mobile - Login (US02)` ⭐ *(Starting Point)* | US02 | 390 × 844 px | Fluxo de autenticação mobile com layout em coluna única |
| 2 | `1B. Mobile - Cadastro de Usuário (US01)` | US01 | 390 × 844 px | Cadastro responsivo otimizado para teclado virtual |
| 3 | `1C. Mobile - Recuperação de Senha (US02)` | US02 | 390 × 844 px | Recuperação de credenciais em viewport compacto |
| 4 | `2. Mobile - Home & Busca Global (US03)` | US03 | 390 × 844 px | Barra de busca sticky, filtros em bottom-sheet |
| 5 | `3. Mobile - Perfil Docente & Reviews (US04 & US07)` | US04, US07 | 390 × 844 px | Scorecards verticais e listagem de reviews em cards |
| 6 | `4. Mobile - Modal de Avaliação (US05 & US06)` | US05, US06 | 390 × 844 px | Modal full-screen para submissão de feedback |
| 7 | `5. Mobile - Painel Docente & Dashboard (US08 & US09)` | US08, US09 | 390 × 844 px | Dashboard adaptado com métricas empilhadas |

---

### 🎨 Página 3: `Design System & Tokens`
- **Seção 1:** Paleta de Cores Semântica (`Bootswatch Flatly` / 10 Cores Oficiais).
- **Seção 2:** Escala Tipográfica (`Inter` / 7 Escalas).
- **Seção 3:** Biblioteca de Componentes Mestres (*Buttons*, *Badges*, *Inputs*, *Scorecards*).
- **Seção 4:** Componentes de Card & Scorecard de Métricas Pedagógicas.
- **Seção 5 (Vitrine Oficial de Ícones - Bootstrap Icons):**
  - *Autenticação & Segurança:* `bi-mortarboard-fill`, `bi-shield-check`, `bi-shield-lock-fill`, `bi-key-fill`, `bi-envelope-fill`, `bi-check-circle-fill`.
  - *Busca & Navegação:* `bi-search`, `bi-funnel-fill`, `bi-person-fill`, `bi-person-badge-fill`, `bi-building`, `bi-arrow-left`.
  - *Tags Pedagógicas:* `bi-lightbulb-fill` (Didático), `bi-file-earmark-check-fill` (Provas Justas), `bi-clock-fill` (Pontualidade), `bi-people-fill` (Trabalho em Grupo), `bi-rocket-takeoff-fill` (Projetos), `bi-lightning-charge-fill` (Carga/Exigência).
  - *Reviews & Analytics:* `bi-star-fill` (Rating), `bi-hand-thumbs-up-fill` (Upvote Útil), `bi-graph-up` (Evolução), `bi-file-earmark-pdf-fill` (PDF), `bi-file-earmark-spreadsheet-fill` (CSV), `bi-box-arrow-right` (Logout).

---

## 🔗 Fluxos de Prototipagem Interativa Conectados

### Navegação Desktop & Mobile
1. **Alternância Login / Cadastro / Recuperação de Senha:**
   - `1A. Login` ◄──(Abas de Alternância)──► `1B. Cadastro`
   - `1A. Login` ──(Esqueci minha senha)──► `1C. Recuperação de Senha` ──(Voltar ao Login)──► `1A. Login`
2. **Acesso à Plataforma:**
   - Botão *"Entrar no Classdoor"* (1A) ou *"Criar Minha Conta"* (1B) avança para `2. Home & Busca Global`.
3. **Descoberta & Perfil:**
   - Botão *"Ver Perfil do Professor"* (2. Home) navega para `3. Perfil Docente & Reviews`.
   - Botão *"← Voltar"* (3. Perfil) retorna para `2. Home & Busca Global`.
4. **Motor de Avaliações:**
   - Botão *"⭐ Avaliar Este Professor"* (3. Perfil) abre `4. Modal de Avaliação`.
   - Botões *"✕ Fechar"* e *"Publicar Minha Avaliação"* (4. Modal) retornam para `3. Perfil Docente & Reviews`.
5. **Dashboard & Logout:**
   - Atalho de perfil ou botão navega para `5. Painel Docente & Dashboard`.
   - Botão *"Sair"* (2. Home e 5. Dashboard) retorna para `1A. Login`.

---

## 1. Fundações Visuais & Design Tokens (Bootstrap 5 / Bootswatch)
- **Primary (`#2C3E50`):** Identidade institucional, navegação e botões principais.
- **Success / Accent (`#18BC9C`):** Indicador de anonimato (`🛡️ 100% Anônimo`), aprovações e submissões.
- **Warning (`#F39C12`):** Estrelas de avaliação e destaques.
- **Danger (`#E74C3C`):** Alertas de validação e notas baixas.
- **Background (`#F8F9FA`):** Fundo limpo e ergonômico.
- **Surface (`#FFFFFF`):** Cards e modais elevados com bordas suaves (`#E9ECEF`).

---

## 2. Entregáveis e Artefatos do Projeto
1. 🎨 **Workspace Figma (SSOT):** 14 pranchetas/frames oficiais distribuídas nas páginas `Desktop` (7 telas) e `Mobile` (7 telas), além da página `Design System & Tokens` com vitrine de 24 ícones oficiais e tokens cadastrados ([Link do Figma](https://www.figma.com/design/LxCytRCFqQGshvVnVnDxum/Classdoor?t=SFiBuyhBNLwICYN1-0)).
2. 📄 **Documentação Oficial:** [`especificacoes/Especificacao-Design-System-Figma.md`](https://github.com/Gabriel-Aragao/classdoor-docs/blob/main/especificacoes/Especificacao-Design-System-Figma.md) sincronizada no GitHub Docs e no Obsidian Vault.
