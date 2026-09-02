# User Stories — Projeto Classdoor

**Projeto:** Classdoor  
**Documento:** Especificação Funcional em formato User Stories (Fluxo Cronológico de Utilização)  
**Data de Revisão:** 2026-09-01  
**Responsável:** @Atlas (Product Manager)  
**Supervisão Técnica:** @Dijkstra (Tech Lead)  
**UI/UX Design:** @Iris  
**Stakeholder / CTO:** @domaragao  

---

## Fluxo de Jornada do Usuário (Ordem de Prioridade)
```
1. Autenticação & Cadastro (Login / Criação de Conta / Onboarding)
   └── 2. Tela Principal & Catálogo de Busca (Home / Filtros / Navegação)
        └── 3. Perfil Detalhado (Professor / Disciplina / Métricas / Reviews)
             └── 4. Motor de Avaliações (Avaliação Anônima / Identificada / Upvote)
                  └── 5. Gestão Docente & Dashboard (Políticas de Turma / Relatórios Analíticos)
```

---

## Épico 1: Autenticação & Gestão de Acesso

### US01: Criação de Conta / Cadastro de Usuário
* **Como** estudante ou professor  
* **Quero** criar uma conta no Classdoor informando meus dados e e-mail institucional  
* **Para que** eu possa acessar a plataforma de forma segura e autenticada.

#### Critérios de Aceite:
1. Formulário de cadastro com: Nome completo, E-mail institucional (@universidade.edu / @instituicao.br), Senha (mínimo 8 caracteres com regras de complexidade) e Tipo de Perfil (`Estudante` ou `Professor`).
2. Validação visual e em tempo real dos campos com mensagens de erro claras via Bootswatch.
3. Tratamento de e-mails duplicados com mensagem de erro amigável (RFC 7807).
4. Redirecionamento automático para a tela de Login ou confirmação após cadastro com sucesso.

---

### US02: Autenticação / Login & Recuperação de Senha
* **Como** usuário cadastrado  
* **Quero** realizar login com meu e-mail e senha  
* **Para que** eu acesse as funcionalidades protegidas e personalizadas do sistema.

#### Critérios de Aceite:
1. Formulário de login contendo campos de E-mail, Senha e opção "Lembrar de mim".
2. Autenticação baseada em tokens seguros (JWT) retornando permissões do usuário (`ROLE_STUDENT` ou `ROLE_PROFESSOR`).
3. Opção "Esqueci minha senha" com envio de link de recuperação por e-mail.
4. Botão de Logout acessível na Navbar em qualquer tela autenticada, limpando a sessão.

---

## Épico 2: Tela Principal & Catálogo de Busca

### US03: Tela Principal (Home / Landing Page) e Busca Global
* **Como** estudante ou visitante  
* **Quero** acessar a página inicial do Classdoor e pesquisar por professores ou disciplinas  
* **Para que** eu encontre rapidamente o que desejo consultar e veja os destaques da instituição.

#### Critérios de Aceite:
1. Hero section com apresentação da plataforma e campo de busca centralizado com debounce.
2. Filtros dinâmicos por: Tipo (`Professor` ou `Disciplina`), Departamento/Curso e Semestre Letivo.
3. Listagem de resultados em grid responsivo (cards Bootstrap) com: Foto/Avatar, Nome, Departamento, Nota Média (1-5) e Total de Avaliações.
4. Seção de "Professores em Destaque" e "Disciplinas Mais Avaliadas" na Home.
5. Estado de busca vazia ("Nenhum resultado encontrado") com sugestão de ajuste de filtros.

---

## Épico 3: Perfis Acadêmicos & Métricas

### US04: Visualização de Perfil do Professor / Disciplina
* **Como** estudante ou docente  
* **Quero** acessar a página de perfil detalhada de um professor ou disciplina  
* **Para que** eu possa ver o histórico completo de notas, indicadores pedagógicos e opiniões de outros alunos.

#### Critérios de Aceite:
1. **Cabeçalho:** Nome, departamento, ementa/titulação, nota geral (1-5 estrelas), nível de dificuldade (1-5) e percentual de recomendação ("X% dos alunos recomendam").
2. **Distribuição de Avaliações:** Gráfico em barras de progresso Bootstrap com o percentual de notas por estrela (1 a 5).
3. **Tags Frequentes:** Badges com as características mais votadas (ex: "Didático", "Provas Justas", "Exige Presença").
4. **Feed de Avaliações:** Lista de avaliações com ordenação por "Mais Recentes", "Melhor Avaliadas" e "Mais Úteis".

---

## Épico 4: Motor de Avaliações & Privacidade (Core)

### US05: Envio de Avaliação 100% Anônima (Padrão)
* **Como** estudante autenticado  
* **Quero** avaliar um professor ou disciplina de forma totalmente anônima  
* **Para que** eu possa emitir minha opinião sincera sem medo de retaliação.

#### Critérios de Aceite:
1. Formulário modal/página com:
   - Nota Geral (1 a 5 estrelas interativas).
   - Nível de Dificuldade (1 a 5).
   - Pergunta binária: "Você recomendaria este professor/disciplina? (Sim/Não)".
   - Seleção de até 3 tags pré-definidas.
   - Campo de texto para comentário (mínimo 20, máximo 1.000 caracteres).
2. **Garantia de Anonimato:** Badge destacado `100% Anônimo` garantindo que o autor não será identificado.
3. Backend expurga qualquer vínculo identificável (IP, ID de usuário) na persistência pública da avaliação.

---

### US06: Envio de Avaliação Identificada (Opcional)
* **Como** estudante autenticado  
* **Quero** enviar uma avaliação exibindo meu nome público quando permitido  
* **Para que** meu feedback nominal contribua para o reconhecimento do trabalho docente.

#### Critérios de Aceite:
1. Habilitado somente se a turma/disciplina possuir configuração que aceite avaliações nominais.
2. Checkbox obrigatório de consentimento: *"Concordo em exibir meu nome público nesta avaliação"*.
3. O review exibe o nome do estudante e data de postagem.

---

### US07: Interação de Voto Útil (Upvote) em Avaliações
* **Como** estudante  
* **Quero** marcar um comentário como "Útil"  
* **Para que** feedbacks construtivos e relevantes fiquem em evidência.

#### Critérios de Aceite:
1. Botão "Útil 👍 (N)" em cada card de review.
2. Atualização visual instantânea e controle contra cliques repetidos.

---

## Épico 5: Gestão Docente & Analytics

### US08: Gestão de Turmas e Políticas de Avaliação pelo Professor
* **Como** professor autenticado  
* **Quero** gerenciar minhas turmas e definir a política de privacidade das avaliações  
* **Para que** eu escolha se receberei apenas avaliações anônimas ou também nominais.

#### Critérios de Aceite:
1. Listagem das disciplinas e turmas ativas vinculadas ao professor.
2. Seletor de política: `Somente Anônimo (Padrão)` ou `Permitir Identificado`.
3. Notificação visual de confirmação ao alterar a regra.

---

### US09: Dashboard Analítico de Satisfação e Relatórios
* **Como** professor ou coordenador  
* **Quero** acompanhar um painel de métricas analíticas e evolução pedagógica  
* **Para que** eu compreenda os pontos fortes e oportunidades de melhoria ao longo dos semestres.

#### Critérios de Aceite:
1. Gráficos de evolução temporal das médias semestrais.
2. Painel comparativo de distribuição de notas e taxa de recomendação.
3. Nuvem e ranking de tags mais citadas pelos estudantes.
4. Opção de exportação resumida dos dados em CSV/PDF.
