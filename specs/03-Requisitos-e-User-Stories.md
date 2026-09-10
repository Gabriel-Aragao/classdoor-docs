# 📋 03. Catálogo de Requisitos e Especificação de User Stories — Classdoor

**Projeto:** Classdoor  
**Documento:** Requisitos Funcionais (RF), Não-Funcionais (RNF) e User Stories com Critérios de Aceitação BDD  
**Versão:** 1.0.0  
**Data:** 2026-09-08  
**Autor:** @Dijkstra (Tech Lead & Arquiteto de Software Sênior)  
**Stakeholder / CTO & PO:** @domaragao  
**Colaboradores:** @Ada (Analista de Requisitos) & @Atlas (Product Manager)  

---

## 1. Catálogo de Requisitos do Sistema

### 1.1 Requisitos Funcionais (RF — Priorização MoSCoW)

| ID | Módulo / Épico | Requisito Funcional | Prioridade | User Story | Caso de Uso |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **RF01** | Autenticação | Cadastro de usuários com nome, e-mail institucional (`@edu` / `@universidade.br`), senha e perfil (`Estudante` ou `Professor`). | **MUST** | US01 | UC01 |
| **RF02** | Autenticação | Autenticação de usuários existentes via e-mail e senha, gerando token JWT de sessão. | **MUST** | US02 | UC02 |
| **RF03** | Autenticação | Solicitação de recuperação de senha mediante envio de link/código temporário com validade de 30 minutos. | **MUST** | US02 | UC03 |
| **RF04** | Autenticação | Encerramento seguro da sessão ativa (Logout e limpeza de estado). | **MUST** | US02 | UC04 |
| **RF05** | Busca & Catálogo | Busca global textual com auto-complete e debounce para professores e disciplinas na Home. | **MUST** | US03 | UC05 |
| **RF06** | Busca & Catálogo | Filtragem avançada por departamento, período letivo e faixa de nota média (1 a 5 estrelas). | **SHOULD** | US03 | UC06 |
| **RF07** | Busca & Catálogo | Destaques pedagógicos na Home ("Professores Mais Bem Avaliados" e "Disciplinas Populares"). | **SHOULD** | US03 | UC05 |
| **RF08** | Perfis Acadêmicos | Exibição de perfil detalhado do docente com nota geral, dificuldade, recomendação (%) e histograma. | **MUST** | US04 | UC07 |
| **RF09** | Perfis Acadêmicos | Exibição de perfil da disciplina com ementa, créditos, média histórica e lista de docentes associados. | **MUST** | US04 | UC07 |
| **RF10** | Motor de Avaliação | Envio de avaliações contendo nota geral (1-5), dificuldade (1-5), recomendação (Sim/Não), tags e comentário ($\ge 20$ chars). | **MUST** | US05 | UC08 |
| **RF11** | Motor de Avaliação | Expurgo preventivo e desassociação total de qualquer metadado de identificação do autor em reviews anônimas. | **MUST** | US05 | UC11 |
| **RF12** | Motor de Avaliação | Envio de avaliação nominal quando autorizada na política da turma e com consentimento expresso do estudante. | **COULD** | US06 | UC09 |
| **RF13** | Moderação & Interação| Voto de utilidade ("Útil" 👍 / Upvote) em avaliações existentes, limitado a 1 voto por usuário/review. | **SHOULD** | US07 | UC10 |
| **RF14** | Gestão Docente | Configuração da política de privacidade das turmas pelo professor (`Somente Anônimo` vs `Permitir Identificado`). | **SHOULD** | US08 | UC12 |
| **RF15** | Analytics Docente | Dashboard analítico para docentes com gráficos de evolução semestral de médias e nuvem de tags pedagógicas. | **SHOULD** | US09 | UC13 |
| **RF16** | Analytics Docente | Exportação de relatórios analíticos de desempenho docente nos formatos CSV e PDF. | **COULD** | US09 | UC14 |

---

### 1.2 Requisitos Não-Funcionais (RNF)

| ID | Categoria | Descrição do Requisito Não-Funcional | Métrica / Critério Técnico |
| :--- | :--- | :--- | :--- |
| **RNF01** | **Segurança & Privacidade** | Criptografia de senhas com BCrypt (fator de custo 12) / Argon2id; tokens JWT com HMAC-SHA256; transporte estrito sobre HTTPS/TLS 1.3; isolamento de auditoria de reviews via HMAC-SHA256 (`audit_hash`). | Zero senhas ou identificadores expostos; integridade garantida. |
| **RNF02** | **Desempenho & Latência** | Tempo de resposta para consultas de catálogo, busca e visualização de perfis sob carga nominal. | $P_{95} < 300\text{ms}$. |
| **RNF03** | **Responsividade & UI** | Interface fluida adaptada para Desktop (1440px) e Mobile (390px) seguindo o tema Bootswatch Flatly. | Conformidade total com o Figma SSOT. |
| **RNF04** | **Disponibilidade & Integridade** | Modelo relacional PostgreSQL 16+ na 3ª Forma Normal (3FN) com transações ACID e índices otimizados. | $99.9\%$ de uptime em produção. |
| **RNF05** | **Acessibilidade (A11y)** | Acessibilidade visual e navegabilidade total por teclado. | Padrão WCAG 2.1 nível AA (contraste $\ge 4.5:1$). |
| **RNF06** | **Compatibilidade** | Suporte sem polyfills pesados nos principais navegadores modernos. | Chrome 120+, Firefox 120+, Safari 17+, Edge 120+. |

---

## 2. Jornada do Usuário & Mapeamento de Épicos

```text
1. Autenticação & Cadastro (Login / Criação de Conta / Onboarding)
   └── 2. Tela Principal & Catálogo de Busca (Home / Filtros / Navegação)
        └── 3. Perfil Detalhado (Professor / Disciplina / Métricas / Reviews)
             └── 4. Motor de Avaliações (Avaliação Anônima / Identificada / Upvote)
                  └── 5. Gestão Docente & Dashboard (Políticas de Turma / Relatórios Analíticos)
```

---

## 3. Especificação Completa das User Stories

### Épico 1: Autenticação & Gestão de Acesso

#### 🔹 US01: Criação de Conta / Cadastro de Usuário
* **Como** estudante ou professor
* **Quero** criar uma conta no Classdoor informando meus dados e e-mail institucional
* **Para que** eu possa acessar a plataforma de forma segura e autenticada.

##### Critérios de Aceitação (Gherkin / BDD):
* **Cenário 1: Cadastro com sucesso**
  * **Dado** que o visitante informa Nome Completo, E-mail institucional válido (`@universidade.edu`), Senha com no mínimo 8 caracteres (com letras e números) e Perfil (`Estudante` ou `Professor`);
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
  * **Então** o sistema emite token JWT com a role (`ROLE_STUDENT` ou `ROLE_PROFESSOR`) e redireciona para a Home com a sessão ativa.
* **Cenário 2: Recuperação de senha**
  * **Dado** que o usuário clica em *"Esqueci minha senha"* e informa seu e-mail institucional;
  * **Quando** submeter a solicitação;
  * **Então** o sistema gera um token temporário com expiração de 30 minutos e despacha o e-mail de recuperação.
* **Cenário 3: Logout seguro**
  * **Dado** que o usuário está autenticado;
  * **Quando** clicar em *"Sair"* na Navbar;
  * **Então** a sessão local deve ser limpa e o usuário deve ser redirecionado para a tela de Login.

---

### Épico 2: Tela Principal & Catálogo de Busca

#### 🔹 US03: Tela Principal (Home / Landing Page) e Busca Global
* **Como** estudante ou visitante
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
  * **Então** devem ser exibidos os cards de "Professores em Destaque" e "Disciplinas Populares".

---

### Épico 3: Perfis Acadêmicos & Métricas

#### 🔹 US04: Visualização de Perfil do Professor / Disciplina
* **Como** estudante ou docente
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

### Épico 4: Motor de Avaliações & Privacidade (Core)

#### 🔹 US05: Envio de Avaliação 100% Anônima (Padrão)
* **Como** estudante autenticado
* **Quero** avaliar um professor ou disciplina de forma estritamente anônima
* **Para que** eu possa emitir minha opinião sincera sem receio de retaliação.

##### Critérios de Aceitação (Gherkin / BDD):
* **Cenário 1: Submissão anônima válida**
  * **Dado** que o estudante autenticado abre o modal de avaliação e preenche Nota Geral (1-5), Dificuldade (1-5), Recomendação (Sim/Não), até 3 tags e comentário ($\ge 20$ e $\le 1000$ caracteres);
  * **E** mantém a opção *"🛡️ 100% Anônimo"* ativada;
  * **Quando** submeter a avaliação;
  * **Então** o sistema expurga `user_id` e IP na persistência pública, calcula o `audit_hash` para evitar duplicidade, exibe o autor como *"Estudante Anônimo"* e atualiza as médias em tempo real.

---

#### 🔹 US06: Envio de Avaliação Nominal (Opcional)
* **Como** estudante autenticado
* **Quero** enviar uma avaliação nominal quando expressamente permitido
* **Para que** meu feedback assinado contribua para o reconhecimento do docente.

##### Critérios de Aceitação (Gherkin / BDD):
* **Cenário 1: Submissão nominal autorizada**
  * **Dado** que a turma possui política `ALLOW_IDENTIFIED`;
  * **Quando** o estudante desmarcar a opção anônima e marcar o checkbox obrigatório *"Concordo em exibir meu nome público"*;
  * **Então** a avaliação é gravada e exibida com o nome público e curso do estudante.
* **Cenário 2: Tentativa nominal em turma restrita**
  * **Dado** que a turma possui política `ANONYMOUS_ONLY`;
  * **Quando** houver tentativa de envio nominal;
  * **Então** o sistema bloqueia a submissão retornando `403 Forbidden`.

---

#### 🔹 US07: Interação de Voto Útil (Upvote) em Avaliações
* **Como** estudante autenticado
* **Quero** marcar um comentário como "Útil"
* **Para que** feedbacks construtivos fiquem em evidência.

##### Critérios de Aceitação (Gherkin / BDD):
* **Cenário 1: Upvote com idempotência**
  * **Dado** que o estudante clica no botão *"Útil 👍"*;
  * **Quando** o voto for registrado;
  * **Então** o contador público incrementa imediatamente e cliques repetidos do mesmo usuário são ignorados/desativados.

---

### Épico 5: Gestão Docente & Analytics

#### 🔹 US08: Gestão de Turmas e Políticas de Avaliação pelo Professor
* **Como** professor autenticado
* **Quero** gerenciar minhas turmas e definir a política de privacidade das avaliações
* **Para que** eu escolha se receberei apenas avaliações anônimas ou também nominais.

##### Critérios de Aceitação (Gherkin / BDD):
* **Cenário 1: Alteração de política da turma**
  * **Dado** que o professor acessa o painel de turmas;
  * **Quando** alternar a política de uma turma entre `Somente Anônimo` e `Permitir Identificado`;
  * **Então** a alteração é salva com confirmação visual e os formulários de avaliação daquela turma passam a refletir a nova regra.

---

#### 🔹 US09: Dashboard Analítico de Satisfação e Relatórios
* **Como** professor ou coordenador
* **Quero** acompanhar o painel de métricas analíticas e evolução pedagógica
* **Para que** eu compreenda os pontos fortes e oportunidades de melhoria ao longo dos semestres.

##### Critérios de Aceitação (Gherkin / BDD):
* **Cenário 1: Visualização gráfica e temporal**
  * **Dado** que o professor acessa o Dashboard;
  * **Quando** a tela renderizar;
  * **Então** deve exibir gráficos de evolução semestral das médias e nuvem de tags mais frequentes.
* **Cenário 2: Exportação de dados**
  * **Dado** o painel analítico;
  * **Quando** o docente clicar em *"Exportar PDF"* ou *"Exportar CSV"*;
  * **Então** o arquivo consolidado de métricas deve ser baixado com sucesso.
