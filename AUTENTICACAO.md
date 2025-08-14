# 🔐 Autenticação para Render

## Problema:
O Render não permite escanear QR Code interativamente.

## Solução:

### 1. Autentique localmente:
```bash
npm run auth
```
- Escaneie o QR Code que aparecer
- Aguarde a mensagem "WhatsApp conectado!"
- Pressione Ctrl+C para sair

### 2. Comprima a sessão:
```bash
# Windows
tar -czf session.tar.gz .wwebjs_auth/

# Ou use WinRAR/7zip para criar session.zip
```

### 3. No Render:
- Vá em "Environment" 
- Adicione variável: `SKIP_AUTH=true`
- Faça upload do arquivo session.tar.gz
- Redeploy o serviço

### 4. Alternativa - Base64:
Se não conseguir upload, use:
```bash
# Converte sessão para base64
node -e "const fs=require('fs'); console.log(fs.readFileSync('.wwebjs_auth/session/Default/Local Storage/leveldb/000005.ldb').toString('base64'))"
```

## Arquivos importantes:
- `.wwebjs_auth/` - Dados de autenticação
- `auth-local.js` - Script de autenticação local

## Notas:
- Faça backup da pasta `.wwebjs_auth`
- Sessão expira se não usar por muito tempo
- Reautentique se necessário