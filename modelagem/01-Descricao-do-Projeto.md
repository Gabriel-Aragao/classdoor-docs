# 📖 Descrição Geral do Projeto — Classdoor

**Projeto:** Classdoor  
**Tipo:** Plataforma Web de Avaliação e Feedback Acadêmico  
**Repositório de Documentação:** `Gabriel-Aragao/classdoor-docs`  
**SSOT de Design:** [Figma Classdoor](https://www.figma.com/design/LxCytRCFqQGshvVnVnDxum/Classdoor?t=SFiBuyhBNLwICYN1-0)  
**Stack de Engenharia:** React 19 + Bootswatch Flatly (Frontend) \| Spring Boot 3 + Java 21 (Backend) \| PostgreSQL (Banco de Dados)

---

## 1. Visão do Produto
O **Classdoor** é uma plataforma acadêmica colaborativa inspirada no modelo do *Glassdoor/RateMyProfessors*, projetada para proporcionar transparência, engajamento e aprimoramento contínuo no ambiente universitário. A plataforma permite que estudantes avaliem disciplinas e docentes com garantia absoluta de anonimato como padrão, ao mesmo tempo em que fornece aos professores e coordenadores painéis analíticos consolidados sobre o desempenho pedagógico.

---

## 2. Objetivos Principais
1. **Transparência Acadêmica:** Permitir que alunos tomem decisões informadas no momento da matrícula com base em métricas reais de didática, nível de exigência, critérios de avaliação e pontualidade.
2. **Segurança e Confiança:** Proteger integralmente a identidade dos alunos através de uma política de **anonimato por padrão (Privacy by Design)**, eliminando riscos de retaliação acadêmica.
3. **Feedback Construtivo para Docentes:** Oferecer aos professores dados estruturados, tendências temporais e relatórios analíticos para apoiar o aperfeiçoamento didático.
4. **Governança Flexível:** Permitir que docentes configurem políticas de avaliação em suas turmas (somente anônimo ou abertura para avaliações nominais consensuais).

---

## 3. Público-Alvo e Personas

| Persona | Perfil | Principais Necessidades |
| :--- | :--- | :--- |
| **Estudante Universitário** | Aluno de graduação ou pós-graduação autenticado via e-mail institucional. | Consultar reputação de disciplinas/docentes, buscar filtros por curso, emitir feedbacks anônimos sinceros e votar em reviews úteis. |
| **Professor / Docente** | Docente vinculado a um ou mais departamentos acadêmicos. | Acompanhar métricas de satisfação pedagógica, analisar evolução histórica por semestre, gerenciar políticas de turma e exportar relatórios. |
| **Coordenador de Curso** | Gestor acadêmico do departamento/faculdade. | Visão agregada do corpo docente, identificação de gargalos pedagógicos e relatórios institucionais. |
| **Visitante / Aluno Prospectivo** | Usuário não autenticado na web. | Navegar na Home institucional, explorar catálogo público e visualizar resumos de cursos. |

---

## 4. Pilares de Engenharia e Princípios Arquiteturais

### 🛡️ 4.1. Privacidade por Design (Privacy by Design)
- **Anonimato Default:** Nenhuma informação de identidade (ID do usuário, nome, e-mail, IP de origem) é vinculada ao registro público de avaliação anônima no banco de dados.
- **Isolamento de Auditoria:** O controle de "apenas uma avaliação por aluno/turma" é garantido por hashes criptográficos unidirecionais desconectados do payload da review.

### ⚡ 4.2. Usabilidade e Alta Velocidade
- **Frontend Moderno:** Desenvolvido em **React 19** com o tema **Bootswatch Flatly (Bootstrap 5)**, garantindo ergonomia visual, tipografia refinada e total responsividade (Desktop 1440px e Mobile 390px).
- **Backend Robusto:** Arquitetura limpa em camadas com **Spring Boot 3 / Java 21**, seguindo contratos REST rigorosos e validação preventiva com Bean Validation (`@Valid`).

### 📊 4.3. Indicadores Pedagógicos Padronizados
- **Rating Geral (1 a 5 Estrelas):** Nota quantitativa média ponderada.
- **Nível de Dificuldade (1 a 5):** Percepção de esforço e exigência da disciplina.
- **Taxa de Recomendação (%):** Proporção de alunos que recomendariam a matéria.
- **Tags Pedagógicas Oficiais:** Qualificadores estruturados (ex.: Didático, Provas Justas, Exige Presença, Trabalho em Grupo, Focado em Projetos).
