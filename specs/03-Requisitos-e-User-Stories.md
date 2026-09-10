# 📋 03. Catálogo de Requisitos e Especificação de User Stories — Classdoor

**Projeto:** Classdoor  
**Documento:** Requisitos Funcionais (RF), Não-Funcionais (RNF) e User Stories com Critérios de Aceitação BDD  
**Versão:** 2.0.0 — Revisão de Governança, Proteção de Anonimato e Gestão de Turmas  
**Data:** 2026-09-08  
**Autor:** @Dijkstra (Tech Lead & Arquiteto de Software Sênior)  
**Stakeholder / CTO & PO:** @domaragao  
**Colaboradores:** @Ada (Analista de Requisitos) & @Atlas (Product Manager)  

---

## 1. Catálogo de Requisitos do Sistema

### 1.1 Requisitos Funcionais (RF — Priorização MoSCoW)

| ID | Módulo / Épico | Requisito Funcional | Prioridade | User Story | Caso de Uso |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **RF01** | Autenticação | Cadastro de novos usuários com nome, e-mail válido (qualquer domínio válido), senha forte e perfil (`Estudante` ou `Professor`). | **MUST** | US01 | UC01 |
| **RF02** | Autenticação | Autenticação de usuários existentes via e-mail e senha, gerando token JWT de sessão. | **MUST** | US02 | UC02 |
| **RF03** | Autenticação | Solicitação de recuperação de senha mediante envio de link/código temporário com validade de 30 minutos. | **MUST** | US02 | UC03 |
| **RF04** | Autenticação | Encerramento seguro da sessão ativa (Logout e limpeza de estado). | **MUST** | US02 | UC04 |
| **RF05** | Busca & Catálogo | Busca global textual com auto-complete e debounce para professores e disciplinas na Home. | **MUST** | US03 | UC05 |
| **RF06** | Busca & Catálogo | Filtragem avançada por departamento, período letivo e faixa de nota média (1 a 5 estrelas). | **SHOULD** | US03 | UC06 |
| **RF07** | Busca & Catálogo | Destaques pedagógicos na Home ("Professores Mais Bem Avaliados" e "Disciplinas Populares"). | **SHOULD** | US03 | UC05 |
| **RF08** | Perfis Acadêmicos | Exibição de perfil detalhado do docente com nota geral, dificuldade, recomendação (%) e histograma. | **MUST** | US04 | UC07 |
| **RF09** | Perfis Acadêmicos | Exibição de perfil da disciplina com ementa, créditos, média histórica e lista de docentes associados. | **MUST** | US04 | UC07 |
| **RF10** | Gestão de Turmas | O professor deve poder cadastrar novas turmas vinculadas às suas disciplinas, informando código da turma e semestre letivo. | **MUST** | US08 | UC12 |
| **RF11** | Gestão de Turmas | O professor deve poder adicionar alunos à turma em lote (Bulk Import) inserindo múltiplos e-mails separados por vírgula ou quebra de linha. | **MUST** | US08 | UC12 |
| **RF12** | Gestão de Turmas | O sistema deve bloquear a adição de novos alunos à turma a partir do momento em que a primeira avaliação for submetida. | **MUST** | US08 | UC12 |
| **RF13** | Gestão de Turmas | O professor deve controlar a abertura das avaliações através de um toggle de liberação (`isEvaluationOpen`), que por padrão inicia desligado. | **MUST** | US08 | UC12 |
| **RF14** | Gestão de Turmas | O sistema deve impedir a realização de avaliações em turmas com quórum inferior a 5 alunos matriculados. | **MUST** | US05 | UC11 |
| **RF15** | Gestão de Turmas | O sistema deve omitir do professor o status de acesso/cadastro dos alunos e quais já avaliaram (Cegueira de Acesso Docente). | **MUST** | US08 | UC12 |
| **RF16** | Motor de Avaliação | Envio de avaliação contendo nota geral (1-5), dificuldade (1-5), recomendação (Sim/Não) e comentário textual (mínimo 20 caracteres), sem tags. | **MUST** | US05 | UC08 |
| **RF17** | Motor de Avaliação | Expurgo preventivo e desassociação total de qualquer metadado de identificação do autor em reviews anônimas. | **MUST** | US05 | UC11 |
| **RF18** | Motor de Avaliação | Envio de avaliação nominal quando autorizada na política da turma (`ALLOW_IDENTIFIED`) e com consentimento expresso do estudante. | **COULD** | US06 | UC09 |
| **RF19** | Moderação & Interação| Voto de utilidade ("Útil" 👍 / Upvote) em avaliações existentes, limitado a 1 voto por usuário/review. | **SHOULD** | US07 | UC10 |
| **RF20** | Gestão Docente | Configuração da política de privacidade das turmas pelo professor (`Somente Anônimo` vs `Permitir Identificado`). | **SHOULD** | US08 | UC12 |
| **RF21** | Analytics Docente | Dashboard com Scorecards, Histograma de notas (1-5 estrelas) e Gráfico de evolução semestral temporal. | **SHOULD** | US09 | UC13 |
| **RF22** | Analytics Docente | Exportação de relatórios analíticos de desempenho docente nos formatos CSV anonimizado e PDF executivo. | **COULD** | US09 | UC14 |

---

### 1.2 Requisitos Não-Funcionais (RNF)

| ID | Categoria | Descrição do Requisito Não-Funcional | Métrica / Critério Técnico |
| :--- | :--- | :--- | :--- |
| **RNF01** | **Segurança & Privacidade** | Criptografia de senhas com BCrypt (fator de custo 12) / Argon2id; tokens JWT com HMAC-SHA256; transporte estrito sobre HTTPS/TLS 1.3; isolamento de auditoria de reviews via HMAC-SHA256 (`audit_hash`). | Zero senhas ou identificadores expostos; anonimato protegido contra processos de eliminação. |
| **RNF02** | **Desempenho & Latência** | Tempo de resposta para consultas de catálogo, busca e visualização de perfis sob carga nominal. | P95 < 300ms. |
| **RNF03** | **Responsividade & UI** | Interface fluida adaptada para Desktop (1440px) e Mobile (390px) seguindo o tema Bootswatch Flatly. | Conformidade total com o Figma SSOT. |
| **RNF04** | **Disponibilidade & Integridade** | Modelo relacional PostgreSQL 16+ na 3ª Forma Normal (3FN) com transações ACID e índices otimizados. | 99.9% de uptime em produção. |
| **RNF05** | **Acessibilidade (A11y)** | Acessibilidade visual e navegabilidade total por teclado. | Padrão WCAG 2.1 nível AA (contraste >= 4.5:1). |
| **RNF06** | **Compatibilidade** | Suporte sem polyfills pesados nos principais navegadores modernos. | Chrome 120+, Firefox 120+, Safari 17+, Edge 120+. |

---

## 2. Jornada do Usuário & Mapeamento de Épicos

```text
1. Autenticação & Cadastro (Login / Criação de Conta com Qualquer E-mail Válido / Onboarding)
   └── 2. Gestão de Turmas e Discentes pelo Professor (Criação de Turma / Bulk Add / Toggle de Liberação / Quórum >= 5)
        └── 3. Tela Principal & Catálogo de Busca (Home / Filtros / Navegação)
             └── 4. Perfil Detalhado (Professor / Disciplina / Métricas / Reviews)
                  └── 5. Motor de Avaliações sem Tags (Avaliação Anônima / Identificada / Upvote)
                       └── 6. Dashboard Analítico & Relatórios Estruturados (Histograma / Série Temporal / CSV / PDF)
```

---

## 3. Especificação Completa das User Stories

### Épico 1: Autenticação & Gestão de Acesso

#### 🔹 US01: Criação de Conta / Cadastro de Usuário (Qualquer E-mail Válido)
* **Como** estudante ou professor
* **Quero** criar uma conta no Classdoor informando meus dados e qualquer e-mail válido (institucional, Gmail, Outlook, etc.)
* **Para que** eu possa acessar a plataforma de forma segura e autenticada sem restrição de domínio.

##### Critérios de Aceitação (Gherkin / BDD):
* **Cenário 1: Cadastro com qualquer e-mail válido com sucesso**
  * **Dado** que o visitante informa Nome Completo, E-mail com formato válido (ex.: `estudante@gmail.com` ou `prof@universidade.edu`), Senha com no mínimo 8 caracteres e Perfil (`Estudante` ou `Professor`);
  * **Quando** clicar em *"Criar Minha Conta"*;
  * **Então** a conta deve ser criada com senha criptografada (BCrypt) e o usuário deve ser redirecionado para a tela de Login com mensagem de sucesso.
* **Cenário 2: Tentativa com e-mail duplicado**
  * **Dado** que o e-mail informado já existe no banco de dados;
  * **Quando** submeter o formulário;
  * **Então** o sistema deve retornar erro amigável (RFC 7807) informando que o e-mail já está em uso e sugerindo recuperação de senha.

---

#### 🔹 US02: Autenticação / Login & Recuperação de Senha
* **Como** usuário cadastrado
* **Quero** realizar login com meu e-mail e senha ou recuperar minha senha
* **Para que** eu acesse as funcionalidades protegidas e recupere meu acesso quando necessário.

##### Critérios de Aceitação (Gherkin / BDD):
* **Cenário 1: Login com credenciais válidas**
  * **Dado** que o usuário informa e-mail e senha corretos;
  * **Quando** clicar em *"Entrar no Classdoor"*;
  * **Então** o sistema emite token JWT com a role correspondente (`ROLE_STUDENT` ou `ROLE_PROFESSOR`) e redireciona para a Home com a sessão ativa.
* **Cenário 2: Recuperação de senha**
  * **Dado** que o usuário clica em *"Esqueci minha senha"* e informa seu e-mail cadastrado;
  * **Quando** submeter a solicitação;
  * **Então** o sistema gera um token temporário com expiração de 30 minutos e despacha o e-mail de recuperação.
* **Cenário 3: Logout seguro**
  * **Dado** que o usuário está autenticado;
  * **Quando** clicar em *"Sair"* na Navbar;
  * **Então** a sessão local deve ser limpa e o usuário deve ser redirecionado para a tela de Login.

---

### Épico 2: Tela Principal & Catálogo de Busca

#### 🔹 US03: Tela Principal (Home / Landing Page) e Busca Global
* **Como** estudante, professor ou visitante
* **Quero** acessar a Home do Classdoor e pesquisar por professores ou disciplinas
* **Para que** eu encontre rapidamente o que desejo consultar e veja os destaques da instituição.

##### Critérios de Aceitação (Gherkin / BDD):
* **Cenário 1: Busca em tempo real com debounce**
  * **Dado** que o usuário digita no campo de busca da Hero Section;
  * **Quando** cessar a digitação por mais de 300ms;
  * **Então** o sistema exibe os resultados de professores e disciplinas correspondentes no grid.
* **Cenário 2: Aplicação de filtros**
  * **Dado** que o usuário seleciona filtros por Departamento e Semestre Letivo;
  * **Quando** a lista atualizar;
  * **Então** apenas os registros que satisfaçam todos os critérios devem ser exibidos.
* **Cenário 3: Seção de destaques**
  * **Dado** o carregamento da Home;
  * **Quando** a página renderizar;
  * **Então** devem ser exibidos os cards de "Professores Mais Bem Avaliados" e "Disciplinas Populares".

---

### Épico 3: Perfis Acadêmicos & Métricas

#### 🔹 US04: Visualização de Perfil do Professor / Disciplina
* **Como** estudante ou professor
* **Quero** acessar a página de perfil detalhada de um professor ou disciplina
* **Para que** eu consulte o histórico de avaliações, indicadores pedagógicos e opiniões da comunidade.

##### Critérios de Aceitação (Gherkin / BDD):
* **Cenário 1: Exibição de scorecards e métricas**
  * **Dado** que o usuário acessa `/professores/:id` ou `/disciplinas/:id`;
  * **Quando** a página carregar;
  * **Então** deve exibir Nota Geral (1 a 5 estrelas), Dificuldade (1 a 5), Taxa de Recomendação (%) e histograma de distribuição de estrelas.
* **Cenário 2: Feed e ordenação de avaliações**
  * **Dado** o feed de avaliações no perfil;
  * **Quando** o usuário alternar a ordenação entre *"Mais Recentes"*, *"Melhor Avaliadas"* e *"Mais Úteis"*;
  * **Então** a lista deve ser reorganizada instantaneamente conforme o critério selecionado.

---

### Épico 4: Motor de Avaliações & Blindagem de Anonimato

#### 🔹 US05: Envio de Avaliação 100% Anônima (Sem Tags e com Quórum Mínimo)
* **Como** estudante autenticado matriculado na turma
* **Quero** avaliar um professor ou disciplina de forma estritamente anônima sem uso de tags
* **Para que** eu emita meu feedback sincero com total proteção contra retaliação e eliminação.

##### Critérios de Aceitação (Gherkin / BDD):
* **Cenário 1: Submissão anônima com quórum e liberação atendidos**
  * **Dado** que o estudante está matriculado em uma turma com pelo menos 5 alunos matriculados (`studentsCount >= 5`);
  * **E** o toggle de avaliações da turma está liberado pelo professor (`isEvaluationOpen == true`);
  * **E** o estudante preenche Nota Geral (1-5), Dificuldade (1-5), Recomendação (Sim/Não) e comentário textual (mínimo 20 e máximo 1000 caracteres), sem tags;
  * **Quando** submeter a avaliação;
  * **Então** o sistema expurga `user_id` e IP na persistência pública, calcula o `audit_hash` para evitar duplicidade, exibe o autor como *"Estudante Anônimo"* e atualiza as médias em tempo real.
* **Cenário 2: Tentativa de avaliação com toggle desligado**
  * **Dado** que o professor ainda não ativou a liberação de avaliações da turma (`isEvaluationOpen == false`);
  * **Quando** o estudante tentar submeter uma avaliação;
  * **Então** o sistema bloqueia o envio com mensagem: *"As avaliações para esta turma ainda não foram abertas pelo professor."*
* **Cenário 3: Tentativa de avaliação em turma com menos de 5 alunos**
  * **Dado** que a turma possui menos de 5 alunos matriculados;
  * **Quando** houver tentativa de avaliação;
  * **Então** o sistema impede a submissão com mensagem: *"A turma precisa de no mínimo 5 alunos matriculados para receber avaliações anônimas seguras."*

---

#### 🔹 US06: Envio de Avaliação Nominal (Opcional)
* **Como** estudante autenticado
* **Quero** enviar uma avaliação nominal quando expressamente permitido pela política da turma
* **Para que** meu feedback assinado contribua para o reconhecimento do docente.

##### Critérios de Aceitação (Gherkin / BDD):
* **Cenário 1: Submissão nominal autorizada**
  * **Dado** que a turma possui política `ALLOW_IDENTIFIED` e está liberada para avaliações com quórum $\ge 5$;
  * **Quando** o estudante desmarcar a opção anônima e marcar o checkbox obrigatório *"Concordo em exibir meu nome público"*;
  * **Então** a avaliação é gravada e exibida com o nome público do estudante.
* **Cenário 2: Tentativa nominal em turma restrita**
  * **Dado** que a turma possui política `ANONYMOUS_ONLY`;
  * **Quando** houver tentativa de envio nominal;
  * **Então** o sistema bloqueia a submissão retornando `403 Forbidden`.

---

#### 🔹 US07: Interação de Voto Útil (Upvote) em Avaliações
* **Como** estudante ou professor autenticado
* **Quero** marcar um comentário como "Útil"
* **Para que** feedbacks construtivos fiquem em evidência.

##### Critérios de Aceitação (Gherkin / BDD):
* **Cenário 1: Upvote com idempotência**
  * **Dado** que o usuário clica no botão *"Útil 👍"*;
  * **Quando** o voto for registrado;
  * **Então** o contador público incrementa imediatamente e cliques repetidos do mesmo usuário na mesma avaliação são bloqueados.

---

### Épico 5: Gestão Docente de Turmas, Alunos & Políticas

#### 🔹 US08: Gestão de Turmas, Adição de Alunos em Lote e Controle de Anonimato
* **Como** professor autenticado
* **Quero** criar turmas, adicionar alunos em lote via e-mail, controlar a abertura das avaliações e definir a política de privacidade
* **Para que** eu gerencie minhas turmas de forma ágil sem comprometer a identidade ou anonimato dos discentes.

##### Critérios de Aceitação (Gherkin / BDD):
* **Cenário 1: Criação de turma**
  * **Dado** que o professor acessa seu painel de gestão;
  * **Quando** preencher o código da turma (ex: "Turma 01"), selecionar a disciplina e o semestre letivo (ex: "2026.1");
  * **Então** a turma é criada com status ativo, `isEvaluationOpen = false` e política padrão `ANONYMOUS_ONLY`.
* **Cenário 2: Adição de alunos em lote (Bulk Import)**
  * **Dado** que a turma criada ainda **não possui nenhuma avaliação cadastrada** (`reviewsCount == 0`);
  * **Quando** o professor colar uma lista de e-mails de alunos no campo de texto em lote (separados por vírgula, ponto e vírgula ou quebra de linha);
  * **Então** o sistema valida o formato de cada e-mail, vincula os alunos à turma e atualiza a contagem total de discentes matriculados.
* **Cenário 3: Bloqueio de adição de alunos após primeira avaliação (Anti-Eliminação)**
  * **Dado** que a turma já recebeu pelo menos 1 avaliação (`reviewsCount >= 1`);
  * **Quando** o professor tentar adicionar novos alunos;
  * **Então** o sistema bloqueia a operação exibindo o alerta: *"Não é permitido adicionar novos alunos a uma turma que já recebeu avaliações, visando resguardar o sigilo e anonimato discente."*
* **Cenário 4: Toggle de liberação de avaliações da turma**
  * **Dado** que o professor concluiu a adição de todos os alunos da turma e o quórum atingiu no mínimo 5 alunos;
  * **Quando** o professor ativar o toggle *"Liberar Avaliações para os Alunos"*;
  * **Então** a turma passa a aceitar submissões de avaliações pelos alunos cadastrados.
* **Cenário 5: Cegueira de Acesso Docente (*Access Blindness*)**
  * **Dado** que os alunos foram matriculados na turma;
  * **Quando** o professor visualizar a listagem da turma;
  * **Então** o sistema exibe apenas o total numérico de alunos matriculados e a lista de e-mails cadastrados, **sem exibir** status de ativação de conta, último acesso, login na plataforma ou indicador individual de quem avaliou.
* **Cenário 6: Configuração de política de privacidade**
  * **Dado** que o professor acessa as configurações da turma;
  * **Quando** alternar entre `Somente Anônimo (Padrão)` e `Permitir Identificado`;
  * **Então** a regra é persistida com confirmação visual.

---

### Épico 6: Dashboard Analítico & Relatórios Estruturados

#### 🔹 US09: Dashboard Analítico de Satisfação e Relatórios Detalhados
* **Como** professor autenticado
* **Quero** visualizar gráficos consolidados de desempenho pedagógico e exportar relatórios nos formatos CSV e PDF
* **Para que** eu compreenda a evolução das minhas turmas, analise a distribuição de notas e utilize os dados para melhoria contínua.

##### Estrutura Detalhada dos Gráficos no Dashboard:
1. **Painel de Scorecards Superiores (Métricas Gerais):**
   * **Nota Média Geral:** Valor numérico de 1.0 a 5.0 estrelas com indicação visual de cor (Bootswatch Flatly).
   * **Índice de Dificuldade Média:** Valor de 1.0 a 5.0.
   * **Taxa de Recomendação:** Percentual de 0% a 100% de alunos que recomendam o docente.
   * **Total de Avaliações Recebidas:** Contagem consolidada de reviews válidas.
2. **Gráfico 1 — Histograma / Distribuição de Frequência de Notas:**
   * Gráfico de barras horizontais exibindo o percentual (%) e volume absoluto de avaliações para cada nota de 1 a 5 estrelas:
     * 5 Estrelas (Excelente)
     * 4 Estrelas (Muito Bom)
     * 3 Estrelas (Bom / Regular)
     * 2 Estrelas (Ruim)
     * 1 Estrela (Péssimo)
3. **Gráfico 2 — Evolução Temporal Semestral (Série Histórica):**
   * Gráfico de linhas/colunas comparando a evolução semestral das médias de **Nota Geral** e **Dificuldade** ao longo dos períodos letivos (ex.: `2024.2`, `2025.1`, `2025.2`, `2026.1`), com filtro para visualizar por disciplina específica ou visão agregada do docente.

##### Estrutura Detalhada dos Relatórios Exportáveis:
1. **Relatório em Formato CSV (Tabular Anonimizado):**
   * Estrutura de colunas sem identificação pessoal:
     * `data_avaliacao`: Data e hora da submissão (ISO 8601).
     * `disciplina_codigo`: Código da disciplina (ex: `CC0101`).
     * `disciplina_nome`: Nome da matéria.
     * `turma_codigo`: Código da turma (ex: `Turma 01`).
     * `semestre_letivo`: Período da oferta (ex: `2026.1`).
     * `nota_geral`: Nota inteira de 1 a 5.
     * `nota_dificuldade`: Dificuldade de 1 a 5.
     * `recomendaria`: Sim / Não (`true`/`false`).
     * `tipo_avaliacao`: Anônima / Nominal.
     * `comentario`: Texto completo do feedback qualitativo.
2. **Relatório em Formato PDF (Documento Executivo):**
   * **Cabeçalho Institucional:** Nome do docente, departamento, data de emissão do relatório e período avaliado.
   * **Resumo Executivo:** Scorecards com as médias consolidadas do período e percentual de recomendação.
   * **Gráficos Integrados:** Visualização gráfica do histograma de notas e da série temporal semestral.
   * **Seção de Feedbacks Qualitativos:** Listagem dos comentários textuais estruturados agrupados por turma, resguardando integralmente o anonimato dos discentes.

##### Critérios de Aceitação (Gherkin / BDD):
* **Cenário 1: Visualização do Dashboard**
  * **Dado** que o professor acessa a rota `/dashboard`;
  * **Quando** a página carregar;
  * **Então** deve renderizar os Scorecards de médias, o Histograma de notas e o Gráfico de evolução temporal semestral.
* **Cenário 2: Exportação de relatório CSV**
  * **Dado** que o docente clica em *"Exportar Relatório CSV"*;
  * **Quando** o processamento concluir;
  * **Então** o arquivo CSV anonimizado deve ser baixado com todas as colunas especificadas.
* **Cenário 3: Exportação de relatório PDF**
  * **Dado** que o docente clica em *"Exportar Relatório PDF"*;
  * **Quando** o arquivo for gerado;
  * **Então** o PDF formatado com cabeçalho, scorecards, gráficos e pareceres qualitativos deve ser disponibilizado para download.
