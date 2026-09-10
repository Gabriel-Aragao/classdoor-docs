# 📖 Descrição Geral do Projeto — Classdoor

**Projeto:** Classdoor  
**Tipo:** Plataforma Web de Avaliação e Feedback Acadêmico  
**Repositório de Documentação:** `Gabriel-Aragao/classdoor-docs`  
**SSOT de Design:** [Figma Classdoor](https://www.figma.com/design/LxCytRCFqQGshvVnVnDxum/Classdoor?t=SFiBuyhBNLwICYN1-0)  
**Stack de Engenharia:** React 19 + Bootswatch Flatly (Frontend) | Spring Boot 3 + Java 21 (Backend) | PostgreSQL 16+ (Banco de Dados)  
**Versão da Especificação:** 2.1.0 (Gestão Flexível de Disciplinas/Turmas, Adição Contínua e Blindagem de Anonimato)

---

## 1. Visão do Produto
O **Classdoor** é uma plataforma acadêmica colaborativa inspirada no modelo do *Glassdoor/RateMyProfessors*, projetada para proporcionar transparência, engajamento e aprimoramento contínuo no ambiente universitário. A plataforma permite que estudantes avaliem disciplinas e docentes com garantia absoluta de anonimato como padrão, ao mesmo tempo em que fornece aos professores e coordenadores painéis analíticos consolidados sobre o desempenho pedagógico.

---

## 2. Objetivos Principais
1. **Transparência Acadêmica:** Permitir que alunos tomem decisões informadas no momento da matrícula com base em métricas reais de didática, nível de exigência, critérios de avaliação e pontualidade.
2. **Segurança e Confiança:** Proteger integralmente a identidade dos alunos através de uma política de **anonimato por padrão (Privacy by Design)**, eliminando riscos de retaliação acadêmica.
3. **Feedback Construtivo para Docentes:** Oferecer aos professores dados estruturados, tendências temporais e relatórios analíticos para apoiar o aperfeiçoamento didático.
4. **Governança Flexível de Turmas e Disciplinas:** Permitir que docentes criem disciplinas no fluxo de turmas, realizem a adição contínua de alunos em lote e regulem a liberação das avaliações via toggle com quórum mínimo.

---

## 3. Modelo de Domínio e Relacionamentos Acadêmicos
1. **Professor e Disciplinas (1:N):** Um professor pode ministrar uma ou múltiplas disciplinas simultaneamente.
2. **Disciplina e Turmas (1:N):** Cada disciplina pode ter múltiplas turmas distribuídas por períodos letivos semestrais padronizados (dois por ano, ex.: `2026.1`, `2026.2`, `2027.1`, `2027.2`).
3. **Alunos e Matrículas (N:M):** Cada turma possui sua lista de alunos matriculados (`class_enrollments`). Um mesmo aluno pode estar matriculado em diferentes disciplinas e em diferentes turmas da mesma disciplina (em períodos iguais ou distintos).
4. **Criação Flexível de Turmas:** No momento do cadastro de uma nova turma, o professor pode:
   * **Selecionar uma disciplina existente** no catálogo acadêmico; ou
   * **Cadastrar uma nova disciplina** diretamente no fluxo de criação da turma (informando código, nome, ementa e departamento).
5. **Adição Contínua de Alunos (Bulk Import):** O docente pode adicionar e-mails de alunos em lote a qualquer momento enquanto nenhuma avaliação tiver sido realizada na turma (`reviews_count == 0`).
6. **Trava de Integridade da Turma:** A partir do momento em que a primeira avaliação for submetida, a lista de alunos da turma é permanentemente travada contra novas adições.
7. **Controle de Liberação (Toggle):** O professor controla a abertura do período avaliativo através do toggle `isEvaluationOpen` (desligado por padrão).
8. **Quórum Mínimo de Segurança:** O sistema bloqueia avaliações em turmas com menos de 5 alunos matriculados, prevenindo desanonimização por dedução estatística.
9. **Cegueira de Acesso Docente:** O professor não tem acesso a relatórios individuais de quem já avaliou ou acessou a plataforma.

---

## 4. Público-Alvo e Personas

| Persona | Perfil | Principais Necessidades |
| :--- | :--- | :--- |
| **Estudante Universitário** | Aluno de graduação ou pós-graduação autenticado via qualquer e-mail válido. | Consultar reputação de disciplinas/docentes, buscar filtros por curso/período, emitir feedbacks anônimos sinceros e votar em reviews úteis. |
| **Professor / Docente** | Docente vinculado a departamentos acadêmicos. | Criar disciplinas e turmas semestrais, importar alunos em lote, controlar abertura de avaliações, acompanhar métricas e exportar relatórios. |
| **Visitante / Aluno Prospectivo** | Usuário não autenticado na web. | Navegar na Home institucional, explorar catálogo público de professores/disciplinas e visualizar métricas gerais. |

---

## 5. Pilares de Engenharia e Princípios Arquiteturais

### 🛡️ 5.1. Privacidade por Design (Privacy by Design)
- **Cadastro Universal:** Cadastro e login disponíveis com qualquer e-mail válido (sem restrição corporativa/institucional).
- **Anonimato Default:** Nenhuma informação de identidade (ID do usuário, nome, e-mail, IP de origem) é vinculada ao registro público de avaliação anônima no banco de dados.
- **Isolamento de Auditoria (`audit_hash`):** O controle de unicidade ("apenas uma avaliação por aluno/turma") é garantido por hash criptográfico SHA-256 (`salt + user_id + class_id`) sem revelar a autoria.

### ⚡ 5.2. Usabilidade e Alta Velocidade
- **Frontend Moderno:** Desenvolvido em **React 19** com o tema **Bootswatch Flatly (Bootstrap 5)**, garantindo ergonomia visual, tipografia refinada e total responsividade (Desktop 1440px e Mobile 390px).
- **Backend Robusto:** Arquitetura limpa em camadas com **Spring Boot 3 / Java 21**, contratos REST e tratamento padronizado RFC 7807 (`ProblemDetail`).

### 📊 5.3. Indicadores Pedagógicos Padronizados
- **Rating Geral (1 a 5 Estrelas):** Nota quantitativa média ponderada.
- **Nível de Dificuldade (1 a 5):** Percepção de esforço e exigência da disciplina.
- **Taxa de Recomendação (%):** Proporção de alunos que recomendariam a matéria.
- **Tags Pedagógicas Oficiais:** Qualificadores estruturados (Didático, Provas Justas, Exige Presença, Trabalho em Grupo, Focado em Projetos, Alta Carga de Leituras).
