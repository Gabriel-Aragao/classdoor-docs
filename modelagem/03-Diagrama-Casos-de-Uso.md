# 🎯 Diagramas e Especificação de Casos de Uso (Use Cases) — Classdoor

**Projeto:** Classdoor  
**Documento:** Diagramas de Casos de Uso UML e Especificação Textual de Atores e Fluxos  
**Data:** 2026-09-04  
**Responsável:** @Atlas (Product Manager)  

---

## 1. Atores do Sistema

1. **Visitante (Usuário Não Autenticado):** Usuário externo que acessa a Home, busca cursos/professores e visualiza perfis públicos.
2. **Estudante Autenticado:** Aluno registrado com e-mail institucional que emite avaliações (anônimas ou nominais) e interage com upvotes.
3. **Professor / Docente:** Usuário autenticado com perfil docente que gerencia turmas, define políticas de avaliação e analisa relatórios no dashboard.
4. **Coordenador / Administrador:** Gestor acadêmico com acesso ampliado para supervisão de departamentos e relatórios agregados.
5. **Serviço de Autenticação / E-mail (Sistema Externo):** Provedor de envio de e-mails transacionais (ativação e recuperação de senha).

---

## 2. Diagrama Geral de Casos de Uso (UML / Mermaid)

```mermaid
flowchart TB
    %% Atores
    subgraph Atores
        Visitante["👤 Visitante"]
        Estudante["🎓 Estudante Autenticado"]
        Professor["👨‍🏫 Professor"]
        Coordenador["🏛️ Coordenador"]
        EmailService["✉️ Serviço de E-mail"]
    end

    %% Herança de Atores
    Estudante --|> Visitante
    Professor --|> Visitante

    %% Fronteira do Sistema Classdoor
    subgraph Classdoor [" Plataforma Classdoor "]
        %% Módulo Autenticação
        UC01(["UC01: Cadastrar Conta"])
        UC02(["UC02: Realizar Login"])
        UC03(["UC03: Recuperar Senha"])
        UC04(["UC04: Realizar Logout"])

        %% Módulo Busca & Catálogo
        UC05(["UC05: Buscar Docentes e Disciplinas"])
        UC06(["UC06: Filtrar Catálogo"])
        UC07(["UC07: Visualizar Perfil e Métricas"])

        %% Módulo de Avaliações
        UC08(["UC08: Submeter Avaliação Anônima"])
        UC09(["UC09: Submeter Avaliação Nominal"])
        UC10(["UC10: Votar em Avaliação Útil"])
        UC11(["UC11: Validar Regra de Anonimato"])

        %% Módulo de Gestão Docente & Analytics
        UC12(["UC12: Configurar Política de Avaliação da Turma"])
        UC13(["UC13: Visualizar Dashboard de Métricas"])
        UC14(["UC14: Exportar Relatórios (PDF/CSV)"])
    end

    %% Relacionamentos Visitante
    Visitante --> UC01
    Visitante --> UC02
    Visitante --> UC03
    Visitante --> UC05
    Visitante --> UC06
    Visitante --> UC07

    %% Relacionamentos Estudante
    Estudante --> UC04
    Estudante --> UC08
    Estudante --> UC09
    Estudante --> UC10

    %% Relacionamentos Professor
    Professor --> UC04
    Professor --> UC12
    Professor --> UC13
    Professor --> UC14

    %% Relacionamentos Coordenador
    Coordenador --> UC13
    Coordenador --> UC14

    %% Inclusions e Extensions
    UC08 -.->|<<include>>| UC11
    UC09 -.->|<<extend>>| UC08
    UC05 -.->|<<extend>>| UC06
    UC03 -.->|<<include>>| EmailService
    UC14 -.->|<<extend>>| UC13
```

---

## 3. Especificação Detalhada dos Casos de Uso Principais

### 🔹 UC01: Cadastrar Conta
- **Ator Principal:** Visitante
- **Pré-condições:** O usuário deve possuir um e-mail institucional válido (@universidade.edu / @instituicao.br).
- **Fluxo Principal:**
  1. O visitante acessa a tela de Cadastro.
  2. Informa Nome Completo, E-mail Institucional, Senha e Perfil (`Estudante` ou `Professor`).
  3. O sistema valida o formato dos campos e a unicidade do e-mail.
  4. O sistema cria a conta com senha criptografada (BCrypt) e redireciona para o Login.
- **Fluxo de Exceção (E-mail já existente):**
  - O sistema exibe mensagem de erro *"Este e-mail institucional já está cadastrado"* e sugere a recuperação de senha.

---

### 🔹 UC08: Submeter Avaliação Anônima (Core do Sistema)
- **Ator Principal:** Estudante Autenticado
- **Pré-condições:** Estudante autenticado no sistema.
- **Fluxo Principal:**
  1. O estudante navega até o perfil do professor ou disciplina desejada.
  2. Clica no botão *"Avaliar"*.
  3. Seleciona a Nota Geral (1 a 5 estrelas), Nível de Dificuldade (1 a 5) e indica se recomendaria (Sim/Não).
  4. Seleciona até 3 tags pedagógicas oficiais e escreve um comentário detalhado (mínimo 20 caracteres).
  5. Mantém selecionada a opção padrão *"100% Anônimo"*.
  6. Submete o formulário.
  7. O sistema expurga identificadores do estudante, persiste o review público e atualiza as médias agregadas do docente em tempo real.
- **Pós-condições:** A avaliação passa a ser exibida no feed do professor sem qualquer vínculo de autoria.

---

### 🔹 UC12: Configurar Política de Avaliação da Turma
- **Ator Principal:** Professor
- **Pré-condições:** Professor autenticado e com turmas vinculadas.
- **Fluxo Principal:**
  1. O professor acessa o painel de turmas.
  2. Seleciona a turma desejada.
  3. Alterna a política de privacidade entre `Somente Anônimo` (padrão) e `Permitir Identificado`.
  4. Confirma a alteração.
- **Pós-condições:** O formulário de avaliação daquela turma passa a permitir (ou bloquear) o envio de avaliações nominais.
