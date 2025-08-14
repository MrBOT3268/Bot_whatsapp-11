# Bot WhatsApp - Gerenciador de Grupo

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. **Configure os grupos:**
   - Edite o arquivo `config.js`
   - Substitua os IDs dos grupos pelos seus grupos reais

3. **Execute os bots:**

   **Opção 1 - Ambos os bots (recomendado):**
   ```bash
   npm run start:both
   ```

   **Opção 2 - Bot principal apenas:**
   ```bash
   npm start
   ```

   **Opção 3 - Bot secundário apenas:**
   ```bash
   npm run start:bot1
   ```

4. **Escaneie o QR Code:**
   - Aparecerá apenas UMA vez (autenticação compartilhada)
   - Ambos os bots usarão a mesma sessão do WhatsApp
   - Após autenticar, ambos funcionarão automaticamente

## Comandos Disponíveis

- `!info` - Mostra informações do grupo
- `!regras` - Exibe as regras do grupo
- `!kick @usuario` - Remove usuário do grupo (apenas admins)
- `!comandos` - Lista todos os comandos

## Funcionalidades

- ✅ **Autenticação compartilhada** - Um QR Code para ambos os bots
- ✅ **Dois bots simultâneos** - Gerenciam grupos diferentes
- ✅ Verificação de permissões de admin
- ✅ Comandos básicos de moderação
- ✅ Informações do grupo
- ✅ Sistema de regras
- ✅ Sinais automáticos de Aviator
- ✅ Sistema de gamificação

## Requisitos

- Node.js instalado
- WhatsApp Web ativo no celular