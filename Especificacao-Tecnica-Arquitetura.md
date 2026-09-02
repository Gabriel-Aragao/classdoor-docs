# Especificação Técnica e Arquitetural — Classdoor

**Projeto:** Classdoor  
**Tipo:** Plataforma de Avaliação de Disciplinas e Professores por Estudantes  
**Data:** 2026-09-01 (Atualizado com diretriz Bootswatch/Bootstrap)  
**Arquiteto / Tech Lead:** @Dijkstra (Tech Lead)  
**Stakeholders:** @domaragao (CTO/PO), @atlas (Product Manager), @aria (Frontend), @peter (Backend), @iris (UI/UX), @qa (Quality Assurance), @hermes (Friday / Communication Hub)

---

## 1. Visão Geral & Regras de Negócio Centrais

O **Classdoor** é uma plataforma inspirada no Glassdoor voltada para o ambiente acadêmico, permitindo que estudantes avaliem disciplinas, cursos e professores.

### 1.1 Privacidade & Anonimato (Core Rule)
1. **Padrão Obrigatório (Default):** As avaliações são **100% anônimas**. Nenhum dado que permita correlacionar o autor ao conteúdo (ID de usuário, nome, e-mail institucional, IP ou token identificável) é exibido publicamente ou vinculado à avaliação na visão do professor/comunidade.
2. **Modo Identificado (Configurável):** Quando habilitado explicitamente pelo docente nas configurações da disciplina/turma, o formulário passa a permitir ou exigir a identificação do estudante mediante consentimento prévio claro na interface.
3. **Mecanismo Anti-Abuso:** Validação de vínculo acadêmico prévio (ex: login institucional / token de sessão descartável) para evitar spam e garantir legitimidade sem comprometer o anonimato na persistência do review.

---

## 2. Arquitetura do Frontend React

Conforme diretrizes aprovadas pelo CTO/PO (@domaragao):
- **Framework:** **React 19**
- **Linguagem:** **JavaScript puro (ESNext / JSX)** — *sem TypeScript*
- **Build Tool:** **Vite**
- **Estilização / UI Library:** **Bootstrap 5 + Bootswatch** (temas estilizados prontos e consistentes) — *substituindo Tailwind CSS*

### 2.1 Stack do Frontend
- **UI & Estilização:** **Bootstrap 5** integrado com **Bootswatch** (temas como *Flatly*, *Morph*, *Zephyr* ou *Pulse*, importados via CSS/SASS ou pacote npm `bootswatch`).
- **Componentes React / Bootstrap:** Componentização nativa via JSX utilizando classes utilitárias e componentes padrão do Bootstrap 5 (`card`, `btn`, `navbar`, `modal`, `badge`, `form-select`, etc.) ou `react-bootstrap` / `reactstrap`.
- **Ícones:** `bootstrap-icons` ou `lucide-react` padronizado.
- **Gerenciamento de Estado Global:** `Zustand` (leve, minimalista e sem boilerplate).
- **Server State & Cache:** `@tanstack/react-query` (gerenciamento de cache, refetching, deduplicação e estados de loading/error).
- **Roteamento:** `react-router-dom` v6+.
- **Formulários & Validação:** `react-hook-form` + validação via schema com `zod` ou `yup`.
- **Cliente HTTP:** `axios` com interceptors centralizados para tratamento de autenticação e RFC 7807 (`ProblemDetails`).

### 2.2 Estrutura de Diretórios Modular (Feature-Driven em JS/JSX)
```text
src/
├── app/                  # Configuração de providers (QueryClient, Router, ThemeProvider)
│   ├── App.jsx
│   ├── main.jsx
│   └── routes.jsx
├── assets/               # Imagens, SVGs e ícones estáticos
│   ├── icons/
│   └── images/
├── components/           # Componentes reutilizáveis baseados em Bootstrap/Bootswatch
│   ├── ui/               # Button.jsx, Input.jsx, Card.jsx, Modal.jsx, Badge.jsx
│   ├── layout/           # Navbar.jsx, Footer.jsx, Sidebar.jsx, Container.jsx
│   └── feedback/         # RatingStars.jsx, DifficultyMeter.jsx, AlertMessage.jsx
├── features/             # Módulos verticais de negócio
│   ├── auth/             # Login institucional, onboarding, fluxo de sessão
│   ├── professors/       # Perfil do professor, listagem, filtros por departamento
│   ├── courses/          # Disciplinas, ementas, histórico de turmas
│   ├── reviews/          # Criação de review (anônimo vs nominal), lista de cards, upvotes
│   └── dashboard/        # Painel do docente (métricas agregadas e toggles de privacidade)
├── hooks/                # Custom hooks utilitários globais
├── services/             # Instância do Axios e funções de integração com a API
│   ├── api.js
│   ├── professorService.js
│   ├── courseService.js
│   └── reviewService.js
├── store/                # Stores do Zustand (userStore.js, filterStore.js)
├── styles/               # index.scss / index.css com importação do tema Bootswatch + overrides
└── utils/                # Formatadores de data, helpers e sanitizadores
```

---

## 3. Diretrizes de Integração com o Backend Spring Boot (Java)

### 3.1 Contrato RESTful & OpenAPI
- **OpenAPI 3.1 First:** Backend disponibiliza especificação viva em `/v3/api-docs` para sincronização com o frontend.
- **Formato de Erro:** Padrão RFC 7807 (`ProblemDetail` nativo do Spring Boot 3 / Spring 6).
- **Paginação:** Padrão `Pageable` do Spring (`page`, `size`, `sort`) retornando envelope estruturado:
  ```json
  {
    "content": [...],
    "page": {
      "number": 0,
      "size": 10,
      "totalElements": 150,
      "totalPages": 15
    }
  }
  ```

### 3.2 Contrato de Dados para Submissão de Reviews (Payload)
```json
{
  "targetType": "PROFESSOR", // "PROFESSOR" | "COURSE"
  "targetId": "uuid-do-alvo",
  "rating": 4.5,
  "difficultyRating": 3.0,
  "recommend": true,
  "tags": ["didatico", "provas-justas", "exige-presenca"],
  "comment": "Texto da avaliação detalhada...",
  "isAnonymous": true,
  "studentIdentifier": null // Somente preenchido se isAnonymous == false
}
```

---

## 4. Diretrizes de Design & Handoff (Penpot com @iris)

1. **Design System Alinhado ao Bootstrap / Bootswatch:**
   - @iris deve adotar a grade de 12 colunas padrão do Bootstrap e componentes com especificações nativas de espaçamento (`gap`, `m-*`, `p-*`), cores semânticas (`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`) e raios de borda padronizados pelo tema Bootswatch selecionado.
2. **Component-Driven:** Componentes no Penpot com variantes explícitas e nomes em PascalCase alinhados aos componentes React/Bootstrap.
3. **Acessibilidade (A11y):** Contraste mínimo WCAG 2.1 AA (4.5:1 para texto normal, 3:1 para títulos).
4. **Fluxos de Telas no Penpot:**
   - **Busca / Home:** Busca instantânea por Professor / Disciplina.
   - **Perfil (Professor / Disciplina):** Visão consolidada de métricas (rating geral, % recomendação, dificuldade) e lista filtrável de cards de reviews.
   - **Formulário de Avaliação:** Sliders/estrelas intuitivos com badge/alert visual transparente indicando o status de anonimato.
   - **Painel do Docente:** Gerenciamento de privacidade e leitura de feedbacks agregados.

---

## 5. Governança e Qualidade

- **Commits:** Padrão obrigatório `[agente] - mensagem`.
- **Review de PRs:** Gate exclusivo do **@qa** (merge policy: aprovação @qa + all checks passing).
- **Documentação:** Manutenção contínua de especificações técnicas e decisões de arquitetura centralizadas no Obsidian.
