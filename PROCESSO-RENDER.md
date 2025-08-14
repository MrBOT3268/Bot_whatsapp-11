# 🚀 Processo Completo - Render

## **Passo a Passo:**

### **1. Deploy Inicial**
- No Render: **Start Command:** `npm run qr-web`
- Deploy e aguarde ficar online

### **2. Autenticação**
- Acesse a URL do seu app
- Clique em "Autenticar WhatsApp"
- Escaneie o QR Code
- Aguarde "✅ Bot já está autenticado!"

### **3. Ativar Bot Principal**
- Vá em Settings → **Start Command:** `npm start`
- Clique em "Manual Deploy"
- Bot principal ficará ativo

### **4. Ativar Bot Secundário (Opcional)**
- Crie outro serviço no Render
- **Start Command:** `npm run start:bot1`
- Usará a mesma autenticação

## **Comandos por Fase:**

| Fase | Start Command | Função |
|------|---------------|---------|
| 1 | `npm run qr-web` | Autenticação via web |
| 2 | `npm start` | Bot principal ativo |
| 3 | `npm run start:bot1` | Bot secundário |

## **Troubleshooting:**

- **QR não aparece:** Aguarde 30s e recarregue /qr
- **Sessão perdida:** Volte para `npm run qr-web`
- **Bot não conecta:** Verifique se autenticou primeiro

## **URLs Importantes:**
- `/` - Status geral
- `/qr` - Página de autenticação
- `/sinal` - Endpoint para enviar sinais