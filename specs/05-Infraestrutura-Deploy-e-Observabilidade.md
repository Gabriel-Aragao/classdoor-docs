# 05. Infraestrutura, Deploy Contínuo e Observabilidade

Este documento detalha a arquitetura de infraestrutura, os ambientes de execução, o pipeline de CI/CD e os padrões de logs estabelecidos para o projeto **Classdoor**.

---

## 1. 🌐 Mapeamento de Ambientes e URLs

O ecossistema está hospedado em uma VPS Oracle Cloud, protegido e exposto através de **Cloudflare Tunnels** e **Nginx** (proxy reverso interno).

| Ambiente | URL Pública (Cloudflare) | Porta Interna (VPS) | Banco de Dados | Propósito |
| :--- | :--- | :--- | :--- | :--- |
| **Produção** | `https://api.odominoapp.win` | `8080` | `classdoor_db` | Ambiente estável para usuários finais |
| **Desenvolvimento** | `https://dev-api.odominoapp.win` | `8081` | `classdoor_dev_db` | Ambiente de homologação e testes da equipe |
| **Logs (Grafana)** | `https://logs.odominoapp.win` | `3001` | N/A | Centralização de observabilidade |
| **Banco de Dados** | `db.odominoapp.win` | `5432` | PostgreSQL 16 | Acesso seguro via TCP Tunnel |

### 1.1. Arquitetura, Governança e Permissões dos Bancos de Dados (Prod vs. Dev)

O ambiente de banco de dados é executado em instâncias **PostgreSQL 16+** isoladas por base de dados, garantindo separação estrita entre Produção e Desenvolvimento:

1. **Produção (`classdoor_db`):**
   - Destinado exclusivamente ao uso final e armazenamento transacional validado.
   - Acesso restrito estritamente às aplicações de produção e superusuários DBA.
2. **Desenvolvimento / Homologação (`classdoor_dev_db`):**
   - Destinado aos testes da equipe, homologação de novas features da branch `dev` e depuração de queries.
   - Para garantir autonomia aos desenvolvedores sem comprometer privilégios excessivos, foi estabelecida a role `dev_role` com permissões granulares de acesso.

#### Definição da Role de Desenvolvimento (`dev_role`)
Para conceder acesso seguro e colaborativo ao banco de desenvolvimento sem expor o superusuário, execute o seguinte script DDL:

```sql
CREATE ROLE dev_role;

GRANT CONNECT ON DATABASE classdoor_dev_db TO dev_role;
GRANT USAGE, CREATE ON SCHEMA public TO dev_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dev_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO dev_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO dev_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO dev_role;
```

---

## 2. ⚙️ Orquestração e Deploy (CI/CD)

- **Gerenciamento de Processos:** Os backends rodam como serviços nativos gerenciados pelo **Systemd** (`classdoor-prod.service` e `classdoor-dev.service`), garantindo reinicialização automática e controle de recursos.
- **Pipeline Contínuo (GitHub Actions):** 
  - O repositório possui um **Self-Hosted Runner** executando diretamente na VPS.
  - A cada `push` nas branches `main` (Produção) ou `dev` (Desenvolvimento), o GitHub Actions compila o projeto com o **Maven (JDK 21)**, empacota o `.jar`, atualiza o diretório em `/opt/classdoor/bin/` e reinicia o serviço correspondente no Systemd de forma automatizada.

---

## 3. 📊 Observabilidade e Centralização de Logs (Grafana Loki)

Para garantir autonomia à equipe de desenvolvimento e QA sem a necessidade de acesso SSH à VPS, utilizamos a stack **Grafana + Loki + Promtail**:
- **Acesso ao Painel:** [https://logs.odominoapp.win](https://logs.odominoapp.win) (Credenciais padrão fornecidas pela engenharia).
- **Fontes de Dados (Loki):** O Promtail coleta em tempo real o fluxo de logs gerados pelas unidades do Systemd (`classdoor-prod.service` e `classdoor-dev.service`).
- **Consultas LogQL Úteis:**
  - Produção: `{unit="classdoor-prod.service"}`
  - Desenvolvimento: `{unit="classdoor-dev.service"}`
  - Filtrar apenas erros: `{unit="classdoor-prod.service"} |= "ERROR"`

---

## 4. 📝 Padrão de Logs Obrigatório para o Backend (Spring Boot)

Para que o Loki consiga indexar e exibir os logs de forma estruturada e legível no Grafana, os desenvolvedores devem seguir o padrão de formatação e boas práticas abaixo em todo o código Java (`classdoor-backend`).

### 4.1. Formato Padrão do Console (Logback / `application.properties`)
O padrão de impressão no console deve incluir carimbo de data/hora com milissegundos, nível do log, thread, nome da classe e contexto do usuário (quando aplicável via MDC).

Adicione em `src/main/resources/application.properties` (e equivalentes de profile):
```properties
# Formato estruturado para exibição limpa no console e ingestão por Promtail
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - [%X{userId:-ANONYMOUS}] - %msg%n
```

### 4.2. Boas Práticas de Logging no Código
1. **Utilize o SLF4J (Lombok `@Slf4j`):**
   Sempre injete o logger nas classes de serviço e controllers utilizando a anotação do Lombok para manter o código limpo:
   ```java
   @Slf4j
   @Service
   public class AuthService {
       // ...
   }
   ```
2. **Níveis de Log Corretos:**
   - **`log.info()`**: Para eventos de negócio importantes e bem-sucedidos (ex: *"Usuário cadastrado com sucesso: id=..."*, *"Iniciando processamento de notas..."*).
   - **`log.warn()`**: Para situações anômalas tratadas que não interrompem o fluxo (ex: *"Tentativa de login com senha incorreta para o e-mail: ..."*).
   - **`log.error()`**: Para exceções não tratadas, falhas de integração com banco de dados ou serviços externos. Sempre passe a exceção como último argumento para registrar o StackTrace completo:
     ```java
     log.error("Erro ao processar submissão de avaliação para o professor ID: {}", professorId, e);
     ```
3. **Proteção de Dados Sensíveis (LGPD / Segurança):**
   - **NUNCA** faça log de senhas (mesmo criptografadas com BCrypt), tokens JWT completos, cartões de crédito ou dados pessoais sensíveis (PII).
   - Caso precise logar uma entidade de usuário, registre apenas o ID ou o e-mail mascarado.
