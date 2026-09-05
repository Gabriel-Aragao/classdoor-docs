# Guia Prático de Git e Fluxo de Branches — Time Classdoor

**Público-alvo:** Desenvolvedores Júnior (@andreyrian3 e @jenniferrebecaalvesdebarros)  
**Projeto:** Classdoor (Frontend & Backend)  
**Repositório Base Frontend:** `Gabriel-Aragao/classdoor-frontend`  
**Repositório Base Backend:** `Gabriel-Aragao/classdoor-backend`  

---

## 🎯 1. Visão Geral do Fluxo (Git Flow Simplificado)

Para manter o código seguro, organizado e sem conflitos, adotamos o seguinte modelo de branches:

- **`main`**: Código em produção (estável, testado e aprovado). Ninguém commita direto na `main`.
- **`dev`**: Branch principal de desenvolvimento e integração contínua. **Todas as novas tarefas saem da `dev` e retornam para a `dev` via Pull Request (PR)**.
- **`feat/<id>-<descricao-curta>`**: Sua branch de trabalho individual criada a partir da `dev`.

```text
       (Criação da Feature)
 [dev] ───────────────> [feat/005-tela-login]
   │                               │
   │                        (Desenvolve & Commita)
   │                               │
   │                          (Abre PR)
   │                               ▼
 [dev] <────────── (Aprovação @qa) ┘
```

---

## 🚀 2. Passo a Passo Prático: Do Início da Task ao Pull Request

### Passo 1: Atualizar a sua branch `dev` local
Antes de começar qualquer tarefa nova, garanta que sua máquina tenha a versão mais recente da `dev`:

```bash
# 1. Vá para a branch dev
git checkout dev

# 2. Baixe as últimas atualizações do repositório remoto
git pull origin dev
```

---

### Passo 2: Criar sua branch de trabalho
O nome da sua branch **DEVE** seguir o padrão oficial do projeto:  
`feat/<id>-<descricao-curta>`

Exemplos:
- `feat/005-tela-login`
- `feat/006-cadastro-usuario`
- `feat/007-busca-professores`

Para criar e entrar na nova branch a partir da `dev`:

```bash
git checkout -b feat/005-tela-login
```

---

### Passo 3: Desenvolver e Commitar no Padrão do Projeto
Faça as alterações necessárias no código (seguindo React 19 + JS puro + Bootswatch no Frontend ou Spring Boot 3 + Java no Backend).

Como você já é identificado pela sua conta do GitHub nos commits, utilize o padrão semântico de mensagens (**Conventional Commits**):  
`tipo(escopo-opcional): descrição clara da alteração no imperativo`

#### Exemplos de commits para desenvolvedores:
```bash
# Adição de nova funcionalidade:
git add .
git commit -m "feat(auth): adicionar formulario de cadastro com validacao bootswatch"

# Implementação de tela e integração:
git add .
git commit -m "feat(login): implementar tela de login e integracao com api de auth"

# Correção de bug / ajuste visual:
git add .
git commit -m "fix(layout): ajustar responsividade dos inputs no mobile"

# Adição de testes:
git add .
git commit -m "test(auth): adicionar testes unitarios para validacao de email"
```

> 💡 **Tipos mais comuns de commits:**
> - `feat:` Nova funcionalidade, página ou componente.
> - `fix:` Correção de bug ou comportamento incorreto.
> - `style:` Ajustes puramente visuais/CSS sem alteração de lógica.
> - `refactor:` Melhoria na estrutura do código sem alterar a funcionalidade.
> - `test:` Criação ou ajuste de testes automatizados.
> - `docs:` Alterações em documentação ou comentários.

---

### Passo 4: Publicar sua branch no GitHub
Após terminar e testar seu código localmente (`npm run build` e `npm run lint` no frontend ou `mvn clean test` no backend):

```bash
git push -u origin feat/005-tela-login
```

---

### Passo 5: Abrir o Pull Request (PR) apontando para a `dev`
1. Acesse o repositório no GitHub.
2. Clique no botão verde **"Compare & pull request"**.
3. ⚠️ **ATENÇÃO CRÍTICA (Base Repository):**
   - **`base branch`**: selecione **`dev`** *(NUNCA selecione `main`)*.
   - **`compare branch`**: selecione a sua branch (ex: `feat/005-tela-login`).
4. **Título do PR:** `[<ID>] Título descritivo da tarefa` (ex: `[005] Implementação da Tela de Login`).
5. **Descrição do PR:** Preencha o resumo do que foi feito e marque os critérios de aceite atendidos:
   ```markdown
   ## 📌 Resumo da Entrega
   Implementada a tela de login utilizando React 19 e componentes Bootswatch.

   ## ✅ Critérios de Aceite Atendidos
   - [x] Formulário com campos de E-mail, Senha e Lembrar-me
   - [x] Validação visual de campos obrigatórios
   - [x] Integração com endpoint POST /api/v1/auth/login
   - [x] npm run build e npm run lint aprovados
   ```
6. Clique em **"Create pull request"**.

---

### Passo 6: Notificar no Trello e Aguardar o Review do @qa
1. Vá até o card correspondente no quadro **Dac** do Trello.
2. Mova o card para a coluna **"Review"**.
3. Adicione um comentário no card com o link do PR:
   ```text
   Tarefa concluída e PR #XX aberto apontando para a branch dev.
   Link do PR: https://github.com/Gabriel-Aragao/classdoor-frontend/pull/XX
   Critérios de aceite validados e build 100% verde. Pronto para review do @qa.
   ```
4. O **@qa** realizará a validação dos critérios de qualidade. 
   - Se aprovado: o @qa autoriza o merge na `dev` e move o card para **Done**.
   - Se houver ajustes: o @qa apontará as correções no card e você fará novos commits na sua mesma branch.

---

## 🛠️ 3. Comandos Úteis e Operações de Terminal (Windows & Linux)

Para facilitar o dia a dia, confira os comandos para operações comuns de sistema e Git:

### A. Navegação e Manipulação de Arquivos

#### Criar diretórios
```cmd
:: Windows (PowerShell / CMD)
mkdir src\components\auth
```
```bash
# Linux / macOS (Bash)
mkdir -p src/components/auth
```

#### Mover ou Renomear Arquivos
```cmd
:: Windows (PowerShell / CMD)
move src\temp\Componente.jsx src\components\Componente.jsx
```
```bash
# Linux / macOS (Bash)
mv src/temp/Componente.jsx src/components/Componente.jsx
```

#### Copiar Arquivos
```cmd
:: Windows (PowerShell / CMD)
copy .env.example .env
```
```bash
# Linux / macOS (Bash)
cp .env.example .env
```

#### Limpar dependências (`node_modules`)
```cmd
:: Windows (PowerShell / CMD)
rmdir /s /q node_modules
```
```bash
# Linux / macOS (Bash)
rm -rf node_modules
```

---

### B. Comandos Git Frequentes

| Objetivo | Comando Git |
| :--- | :--- |
| **Verificar status da branch** | `git status` |
| **Listar branches locais** | `git branch` |
| **Descartar alterações locais não salvas** | `git restore .` |
| **Trazer atualizações da dev para sua feature** | `git checkout dev && git pull && git checkout sua-branch && git merge dev` |
| **Histórico resumido de commits** | `git log --oneline -n 5` |
| **Desfazer o último commit mantendo os arquivos** | `git reset --soft HEAD~1` |

---

Se precisar de auxílio em qualquer etapa, basta marcar o especialista no comentário do card no Trello (ex: `@dijkstra`, `@peter`, `@aria`, `@iris`, `@ada`, `@codd`, `@qa`).
