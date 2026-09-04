# 📋 Requisitos do Sistema — Classdoor

**Projeto:** Classdoor  
**Documento:** Catálogo de Requisitos Funcionais (RF) e Não-Funcionais (RNF)  
**Data:** 2026-09-04  
**Responsável:** @Atlas (Product Manager)  

---

## 1. Requisitos Funcionais (RF)

| ID | Módulo / Épico | Requisito Funcional | Prioridade (MoSCoW) | Rastreabilidade (User Story) |
| :--- | :--- | :--- | :---: | :---: |
| **RF01** | Autenticação | O sistema deve permitir o cadastro de novos usuários com nome, e-mail institucional, senha segura e perfil (`Estudante` ou `Professor`). | **MUST** | US01 |
| **RF02** | Autenticação | O sistema deve autenticar usuários existentes via e-mail e senha, gerando token JWT de sessão. | **MUST** | US02 |
| **RF03** | Autenticação | O sistema deve permitir a solicitação de recuperação de senha mediante envio de link/código por e-mail institucional. | **MUST** | US02 |
| **RF04** | Autenticação | O sistema deve permitir o encerramento seguro da sessão ativa (Logout). | **MUST** | US02 |
| **RF05** | Catálogo & Busca | O sistema deve disponibilizar busca global textual com auto-complete para professores e disciplinas na Home. | **MUST** | US03 |
| **RF06** | Catálogo & Busca | O sistema deve permitir a filtragem avançada por departamento, período/semestre letivo e faixa de nota média (1 a 5 estrelas). | **SHOULD** | US03 |
| **RF07** | Catálogo & Busca | O sistema deve listar destaques pedagógicos ("Professores Mais Bem Avaliados" e "Disciplinas Populares") na tela inicial. | **SHOULD** | US03 |
| **RF08** | Perfis Acadêmicos | O sistema deve exibir a página de perfil detalhada do docente com nota geral, índice de dificuldade, percentual de recomendação e histograma de estrelas. | **MUST** | US04 |
| **RF09** | Perfis Acadêmicos | O sistema deve exibir a página de perfil da disciplina com dados ementários, média histórica e lista de docentes associados. | **MUST** | US04 |
| **RF10** | Motor de Avaliação | O sistema deve permitir que estudantes autenticados enviem avaliações anônimas contendo nota geral (1-5), dificuldade (1-5), recomendação (Sim/Não), tags pedagógicas e comentário textual. | **MUST** | US05 |
| **RF11** | Motor de Avaliação | O sistema deve garantir o expurgo e desassociação total de qualquer dado de identificação do autor na persistência da avaliação anônima. | **MUST** | US05 |
| **RF12** | Motor de Avaliação | O sistema deve permitir o envio de avaliação nominal/identificada quando expressamente autorizado na política da turma e com consentimento do estudante. | **COULD** | US06 |
| **RF13** | Moderação & Interação | O sistema deve permitir que estudantes votem como "Útil" (Upvote) em avaliações existentes, limitando a 1 voto por usuário/review. | **SHOULD** | US07 |
| **RF14** | Gestão Docente | O sistema deve permitir que professores configurem a política de avaliação de suas turmas (`Somente Anônimo` ou `Permitir Identificado`). | **SHOULD** | US08 |
| **RF15** | Analytics & Gestão | O sistema deve fornecer um dashboard analítico para professores com gráficos de evolução semestral de médias e nuvem de tags pedagógicas. | **SHOULD** | US09 |
| **RF16** | Analytics & Gestão | O sistema deve permitir a exportação de relatórios analíticos de desempenho docente nos formatos CSV e PDF. | **COULD** | US09 |

---

## 2. Requisitos Não-Funcionais (RNF)

| ID | Categoria | Descrição do Requisito Não-Funcional | Métrica / Critério |
| :--- | :--- | :--- | :--- |
| **RNF01** | **Segurança & Privacidade** | Criptografia de senhas com algoritmo BCrypt (fator de custo 12) e comunicação estritamente sobre HTTPS/TLS. | Zero senhas em plain text; tokens JWT assinados com HMAC-SHA256/RSA. |
| **RNF02** | **Desempenho** | Tempo de resposta para consultas de catálogo e buscas textuais na Home. | $P_{95} < 300\text{ms}$ sob carga nominal. |
| **RNF03** | **Responsividade & UI** | Interface fluida adaptada para viewports Desktop (1440px) e Mobile (390px) seguindo o tema Bootswatch Flatly. | Conformidade total com o Figma SSOT. |
| **RNF04** | **Disponibilidade & Confiabilidade** | Integridade dos dados e tolerância a falhas na persistência relacional PostgreSQL. | ACID compliance com índices otimizados em chaves de busca e foreign keys. |
| **RNF05** | **Acessibilidade (A11y)** | Conformidade com padrões de contraste e navegabilidade acessível por teclado. | Padrão WCAG 2.1 nível AA. |
| **RNF06** | **Compatibilidade** | Suporte multiplataforma nos principais navegadores modernos (Chrome, Firefox, Safari, Edge). | Ausência de erros de compatibilidade ESNext/React 19. |
