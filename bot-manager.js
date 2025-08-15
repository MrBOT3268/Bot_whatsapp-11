const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Configuração dos grupos
const GROUPS = {
    GROUP1: '120363401320960742@g.us', // Bot principal
    GROUP2: '120363404870078520@g.us'  // Bot secundário
};

// Cliente único compartilhado
const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'shared-session' })
});

client.on('qr', (qr) => {
    console.log('QR Code necessário - Sessão não encontrada ou inválida');
    console.log('QR Code:', qr);
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('🚀 Bot Manager conectado com sucesso!');
    
    // Conecta aos dois grupos
    try {
        const chat1 = await client.getChatById(GROUPS.GROUP1);
        await chat1.sendMessage('🤖 Bot Principal conectado!');
        
        const chat2 = await client.getChatById(GROUPS.GROUP2);
        await chat2.sendMessage('🤖 Bot VIP conectado!');
        
        console.log('✅ Ambos os grupos conectados');
    } catch (error) {
        console.log('❌ Erro ao conectar grupos:', error.message);
    }
});

// Lógica do Bot Principal (Grupo 1)
async function handleGroup1Message(message, chat, contact, participants, isAdmin) {
    if (!message.body.startsWith('!')) return;
    
    const args = message.body.slice(1).split(' ');
    const command = args[0].toLowerCase();
    
    switch (command) {
        case 'info':
            const groupInfo = `📋 *Informações do Grupo*
📝 Nome: ${chat.name}
👥 Participantes: ${chat.participants.length}
📅 Criado: ${new Date(chat.createdAt * 1000).toLocaleDateString()}`;
            message.reply(groupInfo);
            break;
            
        case 'regras':
            const rules = `📜 *Regras do Grupo*

1. 🤝 Respeite todos os membros
2. 🚫 Proibido spam ou flood
3. 🎯 Mantenha o foco nos sinais de Aviator
4. 🔗 Links são permitidos apenas para admins
5. 💰 Jogue sempre com responsabilidade

⚠️ Descumprimento das regras = remoção do grupo`;
            message.reply(rules);
            break;
            
        case 'comandos':
            if (!isAdmin) {
                message.reply('❌ Apenas admins têm acesso aos comandos');
                return;
            }
            const commands = `🤖 *Comandos Disponíveis*
!info - Informações do grupo
!regras - Regras do grupo
!kick @usuario - Remove usuário
!aviator - Cronograma dos sinais`;
            message.reply(commands);
            break;
    }
}

// Lógica do Bot VIP (Grupo 2)
async function handleGroup2Message(message, chat, contact, participants, isAdmin) {
    if (!message.body.startsWith('!')) return;
    
    const args = message.body.slice(1).split(' ');
    const command = args[0].toLowerCase();
    
    switch (command) {
        case 'aviator':
            const cronograma = `✈️ **CRONOGRAMA AVIATOR VIP** ✈️

┌──────────────────────────────┐
│ 🔥 **OPERAÇÃO: 08:00 - 22:00**
│
│ 🐘 **ELEPHANTBET**
│ ⏰ 08:00 - 12:00 (Manhã)
│
│ 🎰 **888BET** 🔥
│ ⏰ 12:00 - 17:00 (Tarde)
│
│ 🎮 **MEGAGAMELIVE** 🔥
│ ⏰ 17:00 - 22:00 (Noite)
└──────────────────────────────┘

🔥 **HORÁRIOS PREMIUM** = Máxima precisão
⚠️ **Jogue sempre com responsabilidade!**`;
            message.reply(cronograma);
            break;
            
        case 'comprar':
            const compraMsg = `💎 **AVIATOR PREMIUM VIP** 💎

┌──────────────────────────────┐
│ 🚀 **RECURSOS VIP EXCLUSIVOS:**
│
│ ✅ Sinais 24h por dia
│ ✅ Taxa de acerto 90%+
│ ✅ Suporte VIP instantâneo
│ ✅ Análises avançadas IA
└──────────────────────────────┘

💰 **INVESTIMENTO:** 300 MTS/semana

📱 **COMO ATIVAR:**
• **Valor:** 300 MTS
• **Para:** 845201750 (M-Pesa)
• **Referência:** SEU_WHATSAPP

🎆 **GARANTIA TOTAL: 7 dias!**`;
            message.reply(compraMsg);
            break;
            
        case 'regras':
            const rulesVip = `📜 **REGRAS DO GRUPO AVIATOR VIP** 📜

┌──────────────────────────────┐
│ 🔴 **REGRAS OBRIGATÓRIAS:**
│
│ 1️⃣ Respeito mútuo sempre
│ 2️⃣ Proibido spam/flood
│ 3️⃣ Foco nos sinais Aviator
│ 4️⃣ Links apenas para admins
│ 5️⃣ Jogo responsável obrigatório
│ 6️⃣ Seguir orientações do bot
└──────────────────────────────┘

⚠️ **AVISO:** Quebra de regras = **BAN IMEDIATO**`;
            message.reply(rulesVip);
            break;
    }
}

// Gerenciador de mensagens
client.on('message', async (message) => {
    const chat = await message.getChat();
    
    if (!chat.isGroup) return;
    
    const contact = await message.getContact();
    const participants = chat.participants;
    const isAdmin = participants.find(p => p.id._serialized === contact.id._serialized)?.isAdmin;
    
    // Roteamento por grupo
    if (chat.id._serialized === GROUPS.GROUP1) {
        await handleGroup1Message(message, chat, contact, participants, isAdmin);
    } else if (chat.id._serialized === GROUPS.GROUP2) {
        await handleGroup2Message(message, chat, contact, participants, isAdmin);
    }
});

// Servidor HTTP
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('🤖 Bot Manager funcionando no Render! 🚀');
});

app.post('/sinal', async (req, res) => {
    try {
        const { mensagem, grupo } = req.body;
        if (!mensagem) {
            return res.status(400).send('Mensagem não fornecida.');
        }
        
        const targetGroup = grupo === '2' ? GROUPS.GROUP2 : GROUPS.GROUP1;
        await client.sendMessage(targetGroup, mensagem);
        res.send('Sinal enviado ao grupo!');
    } catch (error) {
        res.status(500).send('Erro ao enviar sinal.');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor HTTP rodando na porta ${PORT}`);
});

client.initialize();