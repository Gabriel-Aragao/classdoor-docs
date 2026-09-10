# 📋 Catálogo de Requisitos do Sistema — Classdoor

**Projeto:** Classdoor  
**Documento:** Requisitos Funcionais (RF) e Requisitos Não-Funcionais (RNF) com Priorização MoSCoW  
**Repositório de Documentação:** `Gabriel-Aragao/classdoor-docs`  
**Versão:** 2.1.0 — Gestão Flexível de Disciplinas/Turmas, Adição Contínua e Blindagem de Anonimato  
**Data:** 2026-09-08  
**Autor:** @Dijkstra (Tech Lead & Arquiteto) & @Ada (Analista de Requisitos) & @Atlas (Product Manager)

---

## 1. Metodologia de Priorização MoSCoW

* **MUST HAVE (Essencial):** Requisitos críticos sem os quais o sistema não pode operar.
* **SHOULD HAVE (Importante):** Requisitos de alto valor agregador, vitais mas com contorno provisório.
* **COULD HAVE (Desejável):** Funcionalidades de refinamento que agregam conveniência.
* **WONT HAVE (Fora de Escopo Atual):** Recursos expressamente postergados para releases futuras.

---

## 2. Catálogo de Requisitos Funcionais (RF01 a RF24)

| ID | Módulo / Épico | Descrição do Requisito Funcional | Prioridade | User Story | Caso de Uso |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **RF01** | Autenticação | Cadastro de novos usuários com nome, e-mail válido (qualquer domínio), senha forte (mínimo 8 caracteres) e perfil (`Estudante` ou `Professor`). | **MUST** | US01 | UC01 |
| **RF02** | Autenticação | Autenticação de usuários existentes via e-mail e senha, gerando token JWT de sessão. | **MUST** | US02 | UC02 |
| **RF03** | Autenticação | Solicitação de recuperação de senha mediante envio de link/código temporário com validade de 30 minutos. | **MUST** | US02 | UC03 |
| **RF04** | Autenticação | Encerramento seguro da sessão ativa (Logout e limpeza de estado). | **MUST** | US02 | UC04 |
| **RF05** | Busca & Catálogo | Busca global textual com auto-complete e debounce para professores e disciplinas na Home. | **MUST** | US03 | UC05 |
| **RF06** | Busca & Catálogo | Filtragem avançada por departamento, período letivo (ex: `2026.1`, `2026.2`) e faixa de nota média (1 a 5 estrelas). | **SHOULD** | US03 | UC06 |
| **RF07** | Busca & Catálogo | Destaques pedagógicos na Home ("Professores Mais Bem Avaliados" e "Disciplinas Populares"). | **SHOULD** | US03 | UC05 |
| **RF08** | Perfis Acadêmicos | Exibição de perfil detalhado do docente com nota geral, dificuldade, recomendação (%) e histograma. | **MUST** | US04 | UC07 |
| **RF09** | Perfis Acadêmicos | Exibição de perfil da disciplina com ementa, créditos, média histórica e lista de turmas/docentes. | **MUST** | US04 | UC07 |
| **RF10** | Gestão de Turmas | O professor deve poder cadastrar turmas selecionando uma disciplina existente ou criando uma nova disciplina no mesmo fluxo. | **MUST** | US08 | UC12 |
| **RF11** | Gestão de Turmas | O professor deve poder associar turmas a períodos letivos semestrais no formato padronizado (dois por ano: `AAAA.1` e `AAAA.2`). | **MUST** | US08 | UC12 |
| **RF12** | Gestão de Turmas | O professor deve poder adicionar alunos à turma em lote (Bulk Import) inserindo múltiplos e-mails separados por vírgula, ponto e vírgula ou quebra de linha. | **MUST** | US08 | UC12 |
| **RF13** | Gestão de Turmas | O sistema deve permitir a adição contínua de mais alunos à turma enquanto nenhuma avaliação tiver sido realizada (`reviews_count == 0`). | **MUST** | US08 | UC12 |
| **RF14** | Gestão de Turmas | O sistema deve bloquear permanentemente a adição de novos alunos à turma a partir do momento em que a primeira avaliação for submetida. | **MUST** | US08 | UC12 |
| **RF15** | Gestão de Turmas | O professor deve controlar a abertura das avaliações através de um toggle de liberação (`isEvaluationOpen`), que por padrão inicia desligado. | **MUST** | US08 | UC12 |
| **RF16** | Gestão de Turmas | O sistema deve impedir a realização de avaliações em turmas com quórum inferior a 5 alunos matriculados. | **MUST** | US05 | UC11 |
| **RF17** | Gestão de Turmas | O sistema deve omitir do professor o status individual de acesso/cadastro dos alunos e quem já realizou avaliação (Cegueira de Acesso Docente). | **MUST** | US08 | UC12 |
| **RF18** | Motor de Avaliação | Envio de avaliação contendo nota geral (1-5), dificuldade (1-5), recomendação (Sim/Não) e comentário textual (mínimo 20 caracteres). | **MUST** | US05 | UC08 |
| **RF19** | Motor de Avaliação | Expurgo preventivo e desassociação total de qualquer metadado de identificação do autor em reviews anônimas. | **MUST** | US05 | UC11 |
| **RF20** | Motor de Avaliação | Envio de avaliação nominal quando autorizada na política da turma (`ALLOW_IDENTIFIED`) e com consentimento expresso do estudante. | **COULD** | US06 | UC09 |
| **RF21** | Moderação & Interação| Voto de utilidade ("Útil" 👍 / Upvote) em avaliações existentes, limitado a 1 voto por usuário/review. | **SHOULD** | US07 | UC10 |
| **RF22** | Gestão Docente | Configuração da política de privacidade das turmas pelo professor (`Somente Anônimo` vs `Permitir Identificado`). | **SHOULD** | US08 | UC12 |
| **RF23** | Analytics Docente | Dashboard com Scorecards, Histograma de notas (1 a 5 estrelas) e Gráfico de evolução semestral temporal. | **SHOULD** | US09 | UC13 |
| **RF24** | Analytics Docente | Exportação de relatórios analíticos de desempenho docente nos formatos CSV anonimizado e PDF executivo. | **COULD** | US09 | UC14 |

---

## 3. Catálogo de Requisitos Não-Funcionais (RNF)

| ID | Categoria | Descrição Técnica | Métrica / Critério de Aceitação |
| :--- | :--- | :--- | :--- |
| **RNF01** | **Segurança & Criptografia** | Senhas criptografadas com BCrypt (fator de custo 12) / Argon2id; autenticação JWT com HMAC-SHA256; transporte sobre HTTPS/TLS 1.3; isolamento de auditoria via SHA-256 (`audit_hash`). | Zero vazamentos de credenciais ou dados de autoria em reviews. |
| **RNF02** | **Desempenho & Latência** | Consultas paginadas de busca, filtros de catálogo e carregamento de perfis sob carga nominal. | $P_{95} < 300\text{ms}$ em todas as rotas públicas de consulta. |
| **RNF03** | **Responsividade & Design** | Interface fluida adaptada para Desktop (1440px) e Mobile (390px) seguindo o tema Bootswatch Flatly. | Conformidade total com o Figma SSOT oficial. |
| **RNF04** | **Disponibilidade & ACID** | Modelo relacional PostgreSQL 16+ na 3ª Forma Normal (3FN), garantindo integridade referencial com transações ACID. | 99.9% de uptime em produção. |
| **RNF05** | **Acessibilidade (A11y)** | Conformidade com acessibilidade visual, suporte a leitores de tela e contraste semântico. | Padrão WCAG 2.1 AA (contraste $\ge 4.5:1$). |
| **RNF06** | **Compatibilidade Web** | Suporte sem polyfills pesados nos principais navegadores modernos. | Chrome 120+, Firefox 120+, Safari 17+, Edge 120+. |

---

## 4. Regras de Negócio Críticas (RN)

1. **RN01 - Blindagem do Anonimato:** Em avaliações anônimas (`is_anonymous = true`), os campos de identificação do autor são expurgados do payload persistido.
2. **RN02 - Unicidade por Hash de Auditoria:** O sistema calcula `audit_hash = SHA-256(salt + user_id + class_id)` para impedir que um mesmo estudante avalie a mesma turma mais de uma vez.
3. **RN03 - Trava de Adição de Alunos:** O professor só pode adicionar alunos a uma turma enquanto a contagem de avaliações for zero (`reviews_count == 0`). Assim que a 1ª avaliação for submetida, a lista de discentes é permanentemente bloqueada contra novas adições.
4. **RN04 - Quórum Mínimo:** Nenhuma turma pode receber avaliações com menos de 5 alunos matriculados (`enrollments_count >= 5`).
5. **RN05 - Toggle de Liberação:** O envio de avaliações exige que o professor tenha ativado o toggle `isEvaluationOpen = true`.
6. **RN06 - Cegueira de Acesso Docente:** O docente não tem acesso à lista de quem já acessou ou enviou avaliações.
