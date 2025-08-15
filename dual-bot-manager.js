const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

// Cliente único compartilhado
const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'shared-session' })
});

// Configuração dos grupos
const GROUP1_ID = '120363401320960742@g.us'; // Bot principal
const GROUP2_ID = '120363404870078520@g.us'; // Bot VIP

// Servidor HTTP unificado
const app = express();
app.use(express.json());

client.on('qr', (qr) => {
    console.log('QR Code necessário - Sessão não encontrada ou inválida');
    console.log('QR Code:', qr);
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('🚀 Dual Bot Manager conectado!');
    
    try {
        const chat1 = await client.getChatById(GROUP1_ID);
        await chat1.sendMessage('🤖 Bot Principal conectado!');
        
        const chat2 = await client.getChatById(GROUP2_ID);
        await chat2.sendMessage('🤖 Bot VIP conectado!');
        
        console.log('✅ Ambos os grupos conectados');
    } catch (error) {
        console.log('❌ Erro:', error.message);
    }
});

// Importa lógicas dos bots originais
const bot1Logic = require('./bot-logic');
const bot2Logic = require('./bot1-logic');

// Roteador de mensagens
client.on('message', async (message) => {
    const chat = await message.getChat();
    if (!chat.isGroup) return;
    
    const contact = await message.getContact();
    const participants = chat.participants;
    const isAdmin = participants.find(p => p.id._serialized === contact.id._serialized)?.isAdmin;
    
    // Roteia para a lógica correta baseado no grupo
    if (chat.id._serialized === GROUP1_ID) {
        await bot1Logic.handleMessage(message, chat, contact, participants, isAdmin, client);
    } else if (chat.id._serialized === GROUP2_ID) {
        await bot2Logic.handleMessage(message, chat, contact, participants, isAdmin, client);
    }
});

// Eventos de grupo
client.on('group_join', async (notification) => {
    if (notification.chatId === GROUP1_ID) {
        await bot1Logic.handleGroupJoin(notification, client);
    } else if (notification.chatId === GROUP2_ID) {
        await bot2Logic.handleGroupJoin(notification, client);
    }
});

// Servidor HTTP
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('🤖 Dual Bot Manager funcionando! 🚀');
});

app.post('/sinal', async (req, res) => {
    try {
        const { mensagem, grupo } = req.body;
        if (!mensagem) {
            return res.status(400).send('Mensagem não fornecida.');
        }
        
        const targetGroup = grupo === '2' ? GROUP2_ID : GROUP1_ID;
        await client.sendMessage(targetGroup, mensagem);
        res.send('Sinal enviado!');
    } catch (error) {
        res.status(500).send('Erro ao enviar sinal.');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Inicia sistemas automáticos
client.on('ready', () => {
    // Inicia sistemas do bot1
    if (bot1Logic.startAutomation) {
        bot1Logic.startAutomation(client, GROUP1_ID);
    }
    
    // Inicia sistemas do bot2
    if (bot2Logic.startAutomation) {
        bot2Logic.startAutomation(client, GROUP2_ID);
    }
});

client.initialize();