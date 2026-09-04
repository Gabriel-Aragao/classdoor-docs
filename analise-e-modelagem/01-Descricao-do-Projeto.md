# 📄 01. Descrição do Projeto — Classdoor

**Projeto:** Classdoor  
**Tipo:** Plataforma Acadêmica de Avaliação Docente e Transparência Pedagógica  
**Versão:** 1.0.0 (MVP)  
**Stakeholder / CTO:** @domaragao  
**Gestão de Produto:** @Atlas (Product Manager)  
**Supervisão Técnica:** @Dijkstra (Tech Lead)  

---

## 1. Visão Geral e Proposta de Valor

O **Classdoor** é uma plataforma web colaborativa desenhada para transformar a relação entre estudantes e o corpo docente no ensino superior, inspirada na dinâmica de transparência de plataformas como o Glassdoor. 

Historicamente, as avaliações institucionais de disciplinas e professores ocorrem em sistemas burocráticos fechados, com baixa adesão estudantil e retorno pedagógico restrito. O Classdoor surge para fornecer um ecossistema **ágil, seguro, transparente e centrado em métricas pedagógicas qualitativas e quantitativas**, empoderando estudantes na tomada de decisão de matrícula e oferecendo aos docentes feedbacks acionáveis para o aprimoramento de suas metodologias de ensino.

---

## 2. Pilares Fundamentais & Diferenciais

1. **Garantia de Anonimato Seguro e Transparente (Core Padrão):**
   * Por padrão, toda avaliação submetida por um estudante é **100% anônima**.
   * O sistema implementa uma camada de expurgo que desvincula irrevogavelmente os identificadores do aluno (ID, e-mail, IP) do corpo e metadados da avaliação no banco de dados, eliminando o receio de represálias acadêmicas.

2. **Flexibilidade e Gestão Docente por Turma:**
   * O docente possui um painel administrativo exclusivo onde pode configurar a política de avaliação para cada turma/semestre (permitindo avaliações 100% anônimas ou solicitando identificação opcional/mandatória conforme objetivos pedagógicos).
   * O estudante sempre visualiza avisos e badges visuais explícitos (`🛡️ 100% Anônimo` ou `⚠️ Avaliação Nominal Solicitada`) antes da submissão.

3. **Métricas Pedagógicas Estruturadas (Além da Nota Numérica Simples):**
   * Avaliação multicritério composta por:
     - **Rating Geral (1 a 5 estrelas):** Média global da experiência.
     - **Nível de Dificuldade / Exigência (1 a 5 estrelas):** Complexidade de conteúdo e rigor.
     - **Taxa de Recomendação (% Recomendaria):** Indicador binário de recomendação.
     - **Tags Pedagógicas Padronizadas:** Indicadores qualitativos como *Didático*, *Provas Justas*, *Pontual*, *Estimula Projetos*, *Carga Elevada*, *Trabalho em Grupo*.

4. **Transparência e Utilidade Social (Upvoting & Moderação):**
   * Feed de avaliações com botão de *"Útil"* (Upvote) para destacar contribuições construtivas.
   * Filtros avançados por departamento, disciplina, semestre letivo e faixa de pontuação.

---

## 3. Perfis de Usuários (Público-Alvo)

| Perfil | Descrição e Objetivos no Sistema |
| :--- | :--- |
| **Estudante de Graduação / Pós-Graduação** | Busca informações sobre disciplinas e docentes para planejar sua grade curricular; consulta avaliações de colegas; submete feedbacks honestos de forma anônima ou identificada sobre suas experiências. |
| **Professor / Docente** | Acessa seu painel analítico com médias consolidadas, gráficos de evolução temporal por semestre, distribuição de tags pedagógicas e relatórios estruturados para melhoria contínua; configura a política de privacidade das suas turmas. |
| **Coordenador de Curso / Administrador** | Monitora métricas de satisfação agregadas por departamento; modera feedbacks que violem os termos de uso (discurso de ódio, assédio, calúnia); cadastra a grade institucional de professores e disciplinas. |

---

## 4. Escopo do MVP (Histórias de Usuário US01 a US09)

O MVP está delimitado em 4 épicos funcionais:

```
[Épico 1: Autenticação & Onboarding]
 ├── US01: Cadastro de Usuário (Estudante/Docente com e-mail institucional)
 └── US02: Autenticação, Sessão e Recuperação de Senha

[Épico 2: Descoberta & Catálogo Acadêmico]
 └── US03: Página Inicial (Home), Hero Search com Autocomplete e Filtros

[Épico 3: Perfis Acadêmicos & Motor de Avaliação]
 ├── US04: Perfil Detalhado do Docente e Feed de Avaliações
 ├── US05: Envio de Avaliação 100% Anônima (Core Padrão)
 ├── US06: Envio de Avaliação Identificada (Opção Condicional)
 └── US07: Visualização e Votação de Utilidade em Avaliações (Upvote)

[Épico 4: Gestão Docente & Painel Analítico]
 ├── US08: Painel do Docente e Alternância de Política de Anonimato
 └── US09: Dashboard de Métricas, Gráficos e Exportação de Relatórios
```

---

## 5. Arquitetura e Stack Tecnológica de Referência

* **Frontend:** React 19 (JavaScript puro / JSX), Vite, Bootstrap 5 / Bootswatch Flatly, Bootstrap Icons, Zustand, TanStack Query, React Router v6.
* **Backend:** Java 21, Spring Boot 3.3.x, Spring Data JPA, Spring Security (JWT + BCrypt), Flyway / Liquibase.
* **Banco de Dados:** PostgreSQL 16 relacional.
* **Design & UI SSOT:** [Figma Classdoor](https://www.figma.com/design/LxCytRCFqQGshvVnVnDxum/Classdoor?t=SFiBuyhBNLwICYN1-0).
