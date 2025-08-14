# Deploy no Render

## Passos para Deploy:

1. **Faça push do código para GitHub:**
   ```bash
   git add .
   git commit -m "Deploy para Render"
   git push origin main
   ```

2. **No Render.com:**
   - Conecte sua conta GitHub
   - Selecione este repositório
   - Configure:
     - **Build Command:** `npm install`
     - **Start Command:** `npm run qr-web` (para autenticação)
     - **Environment:** Node.js

3. **Variáveis de Ambiente (opcional):**
   - `NODE_ENV=production`
   - `PORT` (automático no Render)

4. **Primeira execução:**
   - Acesse a URL do seu app no Render
   - Clique em "Autenticar WhatsApp"
   - Escaneie o QR Code que aparecer
   - Após autenticar, mude Start Command para `npm start`
   - Bot ficará ativo 24/7

## Arquivos importantes:
- `render.yaml` - Configuração do Render
- `package.json` - Dependências e scripts
- `bot.js` - Bot principal

## Notas:
- O Render reinicia o serviço periodicamente
- Sessão do WhatsApp pode precisar ser reautenticada
- Monitore os logs para verificar funcionamento