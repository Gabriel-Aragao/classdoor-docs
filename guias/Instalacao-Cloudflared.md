# Guia: Instalação do Cloudflare CLI (`cloudflared`)

Para que desenvolvedores, QAs ou agentes não-humanos possam acessar o banco de dados remoto (`db.odominoapp.win`) a partir de suas máquinas locais, é obrigatório ter o utilitário **`cloudflared`** instalado na máquina local para estabelecer o túnel TCP seguro.

Abaixo estão as instruções de instalação para **Linux** e **Windows**.

---

## 🐧 Instalação no Linux (Ubuntu / Debian / WSL)

Abra o terminal e execute os comandos abaixo para baixar e instalar a versão mais recente do `cloudflared`:

```bash
# 1. Baixar o pacote .deb para arquitetura x86_64 (ou amd64)
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# 2. Instalar o pacote
sudo dpkg -i cloudflared.deb

# 3. Verificar se a instalação foi bem-sucedida
cloudflared --version
```

---

## 🪟 Instalação no Windows

### Método Recomendado (via Winget)
Abra o **PowerShell** ou **Prompt de Comando** como Administrador e execute:
```powershell
winget install Cloudflare.cloudflared
```

### Método Alternativo (Binário Direto)
1. Acesse a página oficial de releases do Cloudflare: [GitHub Cloudflared Releases](https://github.com/cloudflare/cloudflared/releases/latest).
2. Baixe o executável para Windows (`cloudflared-windows-amd64.exe`).
3. Renomeie o arquivo para `cloudflared.exe` e mova-o para uma pasta dedicada (ex: `C:\Cloudflare\`).
4. Adicione essa pasta ao **PATH** do seu sistema Windows para poder executá-lo de qualquer terminal.
5. Verifique a instalação abrindo um novo Prompt/PowerShell:
   ```cmd
   cloudflared --version
   ```

---

## 🚀 Como Utilizar após a Instalação

Com o `cloudflared` instalado em sua máquina local:
1. Abra o seu terminal local.
2. Execute o comando de conexão TCP com a VPS:
   ```bash
   cloudflared access tcp --hostname db.odominoapp.win --url 127.0.0.1:5432
   ```
3. Faça login no navegador utilizando o seu e-mail autorizado pela Cloudflare.
4. Mantenha o terminal aberto e conecte-se ao seu banco de dados localmente em `127.0.0.1:5432`.
