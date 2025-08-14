const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

let qrCodeData = null;
let isAuthenticated = false;

const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'shared-session' })
});

client.on('qr', (qr) => {
    qrCodeData = qr;
    console.log('QR Code gerado! Acesse /qr para ver');
});

client.on('authenticated', () => {
    isAuthenticated = true;
    qrCodeData = null;
    console.log('Autenticado com sucesso!');
});

client.on('ready', () => {
    console.log('Bot conectado!');
});

// Endpoint para mostrar QR Code
app.get('/qr', (req, res) => {
    if (isAuthenticated) {
        res.send('<h1>✅ Bot já está autenticado!</h1>');
        return;
    }
    
    if (!qrCodeData) {
        res.send('<h1>⏳ Aguardando QR Code...</h1><script>setTimeout(() => location.reload(), 3000)</script>');
        return;
    }
    
    const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCodeData)}`;
    
    res.send(`
        <div style="text-align: center; font-family: Arial;">
            <h1>📱 Escaneie com WhatsApp</h1>
            <img src="${qrImage}" alt="QR Code" style="border: 2px solid #25D366;">
            <p>Escaneie este código com seu WhatsApp</p>
            <script>setTimeout(() => location.reload(), 10000)</script>
        </div>
    `);
});

app.get('/', (req, res) => {
    res.send(`
        <div style="text-align: center; font-family: Arial;">
            <h1>🤖 Bot WhatsApp - Render</h1>
            <p>Status: ${isAuthenticated ? '✅ Conectado' : '⏳ Aguardando autenticação'}</p>
            <a href="/qr" style="background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                ${isAuthenticated ? 'Ver Status' : 'Autenticar WhatsApp'}
            </a>
        </div>
    `);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse /qr para autenticar`);
});

client.initialize();