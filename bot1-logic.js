// Sistema de Estatísticas e Gamificação para Bot VIP
let stats = {
    sinaisEnviados: { hoje: 0, semana: 0, total: 0 },
    plataformas: { ElephantBet: 0, '888Bet': 0, MegaGameLive: 0 },
    taxaAcerto: 78.5,
    usuarios: new Map(),
    operacaoAtual: null
};

// Função para atualizar nível do usuário
function atualizarNivelUsuario(userId) {
    if (!stats.usuarios.has(userId)) {
        stats.usuarios.set(userId, { mensagens: 0, nivel: 'Novato', pontos: 0 });
    }
    const user = stats.usuarios.get(userId);
    user.mensagens++;
    user.pontos += 1;
    
    if (user.pontos >= 100) user.nivel = 'Expert';
    else if (user.pontos >= 30) user.nivel = 'Intermediário';
    else user.nivel = 'Novato';
    
    stats.usuarios.set(userId, user);
}

// Lógica completa do bot1.js original (VIP)
async function handleMessage(message, chat, contact, participants, isAdmin, client) {
    // Remove mensagens com links (apenas admins podem enviar links)
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[^\s]+\.[a-z]{2,})/gi;
    if (urlRegex.test(message.body) && !isAdmin) {
        try {
            await message.delete(true);
            message.reply('❌ Links não são permitidos no grupo. Apenas admins podem compartilhar links.');
        } catch (error) {
            console.log('Erro ao deletar mensagem:', error);
        }
        return;
    }
    
    // Atualiza atividade do usuário
    atualizarNivelUsuario(contact.id._serialized);
    
    if (!message.body.startsWith('!')) return;
    
    const args = message.body.slice(1).split(' ');
    const command = args[0].toLowerCase();
    
    switch (command) {
        case 'kick':
            if (!isAdmin) {
                message.reply('❌ Apenas admins podem usar este comando');
                return;
            }
            if (message.mentionedIds.length === 0) {
                message.reply('❌ Mencione alguém para remover');
                return;
            }
            try {
                await chat.removeParticipants(message.mentionedIds);
                message.reply('✅ Usuário removido do grupo');
            } catch (error) {
                message.reply('❌ Erro ao remover usuário');
            }
            break;
            
        case 'info':
            const groupInfo = `📋 *Informações do Grupo*
📝 Nome: ${chat.name}
👥 Participantes: ${chat.participants.length}
📅 Criado: ${new Date(chat.createdAt * 1000).toLocaleDateString()}`;
            message.reply(groupInfo);
            break;
            
        case 'regras':
            const rules = `📜 **REGRAS DO GRUPO AVIATOR VIP** 📜

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

🎮 **COMANDOS ÚTEIS:**
• **!aviator** - Cronograma completo
• **!nivel** - Seu ranking
• **!comprar** - Versão Premium

⚠️ **AVISO:** Quebra de regras = **BAN IMEDIATO**`;
            message.reply(rules);
            break;
            
        case 'comandos':
            if (!isAdmin) {
                message.reply('❌ Apenas admins têm acesso aos comandos');
                return;
            }
            const commands = `🤖 *Comandos Administrativos*
!info - Informações do grupo
!kick @usuario - Remove usuário
!ban @usuario - Bane usuário
!promote @usuario - Promove a admin
!demote @usuario - Remove admin
!mute - Silencia grupo
!unmute - Desilencia grupo
!link - Link do grupo
!admins - Lista admins
!bemvindo @usuario - Envia boas-vindas
!sinal <mensagem> - Envia sinal
!todos - Menciona todos os membros
!aviator - Cronograma dos sinais
!parar - Pausa sinais automáticos
!iniciar - Reativa sinais automáticos
!restart - Reinicia o servidor
!stats - Estatísticas do bot`;
            message.reply(commands);
            break;
            
        case 'ban':
            if (!isAdmin) {
                message.reply('❌ Apenas admins podem usar este comando');
                return;
            }
            if (message.mentionedIds.length === 0) {
                message.reply('❌ Mencione alguém para banir');
                return;
            }
            try {
                await chat.removeParticipants(message.mentionedIds);
                message.reply('🔨 Usuário banido do grupo');
            } catch (error) {
                message.reply('❌ Erro ao banir usuário');
            }
            break;
            
        case 'promote':
            if (!isAdmin) {
                message.reply('❌ Apenas admins podem usar este comando');
                return;
            }
            if (message.mentionedIds.length === 0) {
                message.reply('❌ Mencione alguém para promover');
                return;
            }
            try {
                await chat.promoteParticipants(message.mentionedIds);
                message.reply('⬆️ Usuário promovido a admin');
            } catch (error) {
                message.reply('❌ Erro ao promover usuário');
            }
            break;
            
        case 'demote':
            if (!isAdmin) {
                message.reply('❌ Apenas admins podem usar este comando');
                return;
            }
            if (message.mentionedIds.length === 0) {
                message.reply('❌ Mencione alguém para rebaixar');
                return;
            }
            try {
                await chat.demoteParticipants(message.mentionedIds);
                message.reply('⬇️ Admin removido do usuário');
            } catch (error) {
                message.reply('❌ Erro ao rebaixar usuário');
            }
            break;
            
        case 'mute':
            if (!isAdmin) {
                message.reply('❌ Apenas admins podem usar este comando');
                return;
            }
            try {
                await chat.setMessagesAdminsOnly(true);
                message.reply('🔇 Grupo silenciado - apenas admins podem falar');
            } catch (error) {
                message.reply('❌ Erro ao silenciar grupo');
            }
            break;
            
        case 'unmute':
            if (!isAdmin) {
                message.reply('❌ Apenas admins podem usar este comando');
                return;
            }
            try {
                await chat.setMessagesAdminsOnly(false);
                message.reply('🔊 Grupo desilenciado - todos podem falar');
            } catch (error) {
                message.reply('❌ Erro ao desilenciar grupo');
            }
            break;
            
        case 'link':
            try {
                const inviteCode = await chat.getInviteCode();
                message.reply(`🔗 Link do grupo: https://chat.whatsapp.com/${inviteCode}`);
            } catch (error) {
                message.reply('❌ Erro ao obter link do grupo');
            }
            break;
            
        case 'admins':
            const admins = participants.filter(p => p.isAdmin);
            const adminList = admins.map(admin => `• @${admin.id.user}`).join('\n');
            message.reply(`👑 *Admins do Grupo:*\n${adminList}`, null, { mentions: admins.map(a => a.id._serialized) });
            break;
            
        case 'bemvindo':
            if (message.mentionedIds.length === 0) {
                message.reply('❌ Mencione alguém para dar boas-vindas');
                return;
            }
            const mentionedContact = await client.getContactById(message.mentionedIds[0]);
            const welcomeMessage = `🎉 Bem-vindo(a) ao grupo, @${mentionedContact.id.user}!\n\n📋 Digite !regras para ver as regras do grupo\n✈️ Aqui você receberá sinais automáticos de Aviator\n\n💎 *UPGRADE PARA PREMIUM:*\n• Sinais 24h por dia\n• Taxa de acerto 85%+\n• Apenas 300 MTS/semana\n• Digite !comprar para mais info\n\n🔥 Boa sorte e bons ganhos!`;
            message.reply(welcomeMessage, null, { mentions: [mentionedContact.id._serialized] });
            break;
            
        case 'sinal':
            if (!isAdmin) {
                message.reply('❌ Apenas admins podem enviar sinais');
                return;
            }
            const sinalMsg = args.slice(1).join(' ');
            if (!sinalMsg) {
                message.reply('❌ Digite uma mensagem para o sinal');
                return;
            }
            const sinalFormatado = `🚨 *SINAL*\n\n${sinalMsg}\n\n⏰ ${new Date().toLocaleTimeString('pt-PT', { timeZone: 'Africa/Maputo' })}`;
            await chat.sendMessage(sinalFormatado);
            break;
            
        case 'todos':
            if (!isAdmin) {
                message.reply('❌ Apenas admins podem usar este comando');
                return;
            }
            const allMembers = participants.filter(p => !p.isAdmin);
            const memberMentions = allMembers.map(member => `@${member.id.user}`).join(' ');
            const todosMessage = `📢 *ATENÇÃO TODOS OS MEMBROS*\n\n${memberMentions}\n\n🔔 Mensagem importante para o grupo!`;
            await chat.sendMessage(todosMessage, { mentions: allMembers.map(m => m.id._serialized) });
            break;
            
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

⚡ **FREQUÊNCIA DOS SINAIS:**
• A cada 1-3 minutos
• Horário de entrada preciso
• Saída e proteção garantidos

🔗 **PLATAFORMAS OFICIAIS:**
🐘 **ElephantBet** - Manhã
🎰 **888Bet** - Tarde
🎮 **MegaGameLive** - Noite

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
│ ✅ Alertas personalizados
│ ✅ Grupos privados VIP
└──────────────────────────────┘

💰 **INVESTIMENTO:** 300 MTS/semana

📱 **COMO ATIVAR:**
• **Valor:** 300 MTS
• **Para:** 845201750 (M-Pesa)
• **Referência:** SEU_WHATSAPP

📲 **APÓS PAGAMENTO:**
Envie print = **Ativação instantânea!**

🎆 **GARANTIA TOTAL: 7 dias!**`;
            message.reply(compraMsg);
            break;
            
        case 'stats':
            if (!isAdmin) {
                message.reply('❌ Apenas admins podem ver estatísticas');
                return;
            }
            const topPlataformas = Object.entries(stats.plataformas)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([nome, count], i) => `${i+1}. ${nome}: ${count} sinais`)
                .join('\n');
            
            const topUsuarios = Array.from(stats.usuarios.entries())
                .sort(([,a], [,b]) => b.pontos - a.pontos)
                .slice(0, 5)
                .map(([id, user], i) => `${i+1}. ${user.nivel} - ${user.pontos} pts`)
                .join('\n');
            
            const statsMsg = `📊 *ESTATÍSTICAS DO BOT*

📬 *Sinais Enviados:*
• Hoje: ${stats.sinaisEnviados.hoje}
• Semana: ${stats.sinaisEnviados.semana}
• Total: ${stats.sinaisEnviados.total}

🎯 *Taxa de Acerto:* ${stats.taxaAcerto}%

🏆 *Ranking Plataformas:*
${topPlataformas}

👥 *Usuários Mais Ativos:*
${topUsuarios}

🔥 *Operação Atual:* ${stats.operacaoAtual || 'Nenhuma'}`;
            message.reply(statsMsg);
            break;
            
        case 'nivel':
            const userId = contact.id._serialized;
            if (!stats.usuarios.has(userId)) {
                stats.usuarios.set(userId, { mensagens: 0, nivel: 'Novato', pontos: 0 });
            }
            const userInfo = stats.usuarios.get(userId);
            const nivelMsg = `🎖️ *SEU NÍVEL*

👤 *Usuário:* @${contact.id.user}
🏅 *Nível:* ${userInfo.nivel}
⭐ *Pontos:* ${userInfo.pontos}
💬 *Mensagens:* ${userInfo.mensagens}

🎯 *Próximo Nível:*
${userInfo.nivel === 'Novato' ? '• Intermediário: 30 pontos' : userInfo.nivel === 'Intermediário' ? '• Expert: 100 pontos' : '• Você é Expert! 🎆'}`;
            message.reply(nivelMsg, null, { mentions: [contact.id._serialized] });
            break;
    }
}

async function handleGroupJoin(notification, client) {
    const chat = await client.getChatById(notification.chatId);
    const contact = await client.getContactById(notification.recipientIds[0]);
    
    const welcomeMsg = `🎆 **BEM-VINDO AO AVIATOR VIP** 🎆

👋 Olá @${contact.id.user}!

┌──────────────────────────────┐
│ ✈️ **SINAIS AVIATOR GRATUITOS**
│ 🎯 **OPERAÇÃO:** 08:00 - 22:00
│ 📈 **PRECISÃO:** Alta qualidade
└──────────────────────────────┘

📋 Digite **!regras** para as regras
✈️ Digite **!aviator** para cronograma

💎 **PREMIUM DISPONÍVEL:**
• Sinais 24h por dia
• Taxa de acerto 90%+
• Apenas 300 MTS/semana
• Digite **!comprar** para mais info

🎉 **SUCESSO NOS JOGOS!**`;
    
    await chat.sendMessage(welcomeMsg, { mentions: [contact.id._serialized] });
}

// Função para verificar horário quente (VIP)
function isHorarioQuente(hora) {
    return [12, 13, 14, 15, 16, 17, 18, 19, 20, 21].includes(hora); // 888Bet e MegaGameLive = maior atividade
}

// Sistema de Sinais Automáticos de Aviator VIP
function gerarSinalAviator() {
    const agora = new Date();
    const hora = parseInt(new Date().toLocaleString('pt-PT', { timeZone: 'Africa/Maputo', hour12: false }).split(' ')[1].split(':')[0]);
    
    // Links das casas de apostas VIP
    const links = {
        'ElephantBet': 'https://record.elephantbet.com/_vpB7Eg4kO1kWqcfzuvZcQGNd7ZgqdRLk/1/',
        '888Bet': 'https://tracking.888africa.com/visit/?bta=3795&brand=888mozambique',
        'MegaGameLive': 'https://sshortly.net/cbe91fe'
    };
    
    // Opera apenas das 8h às 22h
    if (hora < 8 || hora >= 22) return null;
    
    // Alterna entre as plataformas
    let plataforma;
    if (hora >= 8 && hora < 12) plataforma = 'ElephantBet';
    else if (hora >= 12 && hora < 17) plataforma = '888Bet';
    else plataforma = 'MegaGameLive';
    
    // Gera horário aleatório de entrada (próximos 1-3 minutos)
    const minutosAleatorios = Math.floor(Math.random() * 2) + 1;
    const segundosAleatorios = Math.floor(Math.random() * 60);
    
    const horarioEntrada = new Date(agora.getTime() + minutosAleatorios * 60000 + segundosAleatorios * 1000);
    const horaFormatada = horarioEntrada.toLocaleTimeString('pt-PT', { timeZone: 'Africa/Maputo' });
    
    // Gera multiplicadores com percentagens específicas
    function gerarMultiplicador() {
        const random = Math.random() * 100;
        
        if (random < 50) {
            // 50% - 2.00x até 5.00x
            const valor = (Math.random() * 3 + 2).toFixed(2);
            return `${valor}x`;
        } else if (random < 80) {
            // 30% - 5.01x até 9.00x
            const valor = (Math.random() * 3.99 + 5.01).toFixed(2);
            return `${valor}x`;
        } else if (random < 95) {
            // 15% - 9.01x até 20.00x
            const valor = (Math.random() * 10.99 + 9.01).toFixed(2);
            return `${valor}x`;
        } else {
            // 5% - 20.01x até 50.00x
            const valor = (Math.random() * 29.99 + 20.01).toFixed(2);
            return `${valor}x`;
        }
    }
    
    const saida = gerarMultiplicador();
    const protecaoMults = ['1.20x', '1.30x', '1.40x', '1.50x', '1.60x', '1.70x', '1.80x', '1.90x','2.00x'];
    const protecao = protecaoMults[Math.floor(Math.random() * protecaoMults.length)];
    
    return {
        plataforma,
        horario: horaFormatada,
        saida,
        protecao,
        link: links[plataforma]
    };
}

async function enviarSinalAviator(client, groupId) {
    try {
        const sinal = gerarSinalAviator();
        if (!sinal) return;
        
        const hora = parseInt(new Date().toLocaleString('pt-PT', { timeZone: 'Africa/Maputo', hour12: false }).split(' ')[1].split(':')[0]);
        const isQuente = isHorarioQuente(hora);
        const quente = isQuente ? ' 🔥' : '';
        
        const mensagem = `🚨 *SINAL AVIATOR${quente}* 🚨

┌──────────────────────────────┐
│ 🎯 **${sinal.plataforma}**
│ ⏰ **ENTRADA:** ${sinal.horario}
│ 🚀 **SAÍDA:** ${sinal.saida}
│ 🛡️ **PROTEÇÃO:** ${sinal.protecao}
└──────────────────────────────┘

🔗 **JOGAR AGORA:** ${sinal.link}
${isQuente ? '\n🔥 **HORÁRIO PREMIUM** - Máxima precisão!' : ''}

✨ **BOA SORTE E GRANDES GANHOS!** ✨
⚠️ *Aposte com responsabilidade*`;

        await client.sendMessage(groupId, mensagem);
        
        // Atualiza estatísticas
        stats.sinaisEnviados.hoje++;
        stats.sinaisEnviados.semana++;
        stats.sinaisEnviados.total++;
        if (!stats.plataformas[sinal.plataforma]) {
            stats.plataformas[sinal.plataforma] = 0;
        }
        stats.plataformas[sinal.plataforma]++;
        
        // Simula taxa de acerto (varia entre 75-85%)
        if (Math.random() > 0.2) {
            stats.taxaAcerto = Math.min(85, stats.taxaAcerto + 0.1);
        } else {
            stats.taxaAcerto = Math.max(75, stats.taxaAcerto - 0.2);
        }
        stats.taxaAcerto = Math.round(stats.taxaAcerto * 10) / 10;
        
        console.log(`Sinal VIP enviado: ${sinal.plataforma} - ${sinal.horario}`);
    } catch (error) {
        console.log('Erro ao enviar sinal VIP:', error);
    }
}

// Sistema de automação VIP
function startAutomation(client, groupId) {
    let sinaisAtivos = true;
    
    // Publicidade premium a cada 30 minutos
    setInterval(() => {
        enviarPublicidadePremium(client, groupId);
    }, 30 * 60 * 1000);
    
    setTimeout(() => {
        if (sinaisAtivos) enviarSinalAviator(client, groupId);
        
        setInterval(() => {
            if (!sinaisAtivos) return;
            
            const agora = new Date();
            const hora = parseInt(new Date().toLocaleString('pt-PT', { timeZone: 'Africa/Maputo', hour12: false }).split(' ')[1].split(':')[0]);
            
            // Opera apenas das 8h às 22h
            if (hora >= 8 && hora < 22) {
                enviarSinalAviator(client, groupId);
            }
        }, (Math.floor(Math.random() * 60) + 60) * 1000);
    }, 30000);
}

// Função para enviar publicidade premium
async function enviarPublicidadePremium(client, groupId) {
    try {
        const publicidades = [
            `💎 *UPGRADE PARA PREMIUM* 💎

🚀 Sinais 24h por dia
📈 Taxa de acerto 85%+
⚡ Apenas 300 MTS/semana

📱 M-Pesa: 845201750
💬 Digite !comprar para mais info`,
            
            `🔥 *AVIATOR PREMIUM* 🔥

✅ Sinais automáticos 24/7
✅ Suporte prioritário
✅ Análises avançadas

💰 300 MTS = 7 dias de lucro!
📲 !comprar para ativar`,
            
            `⚡ *MAXIMIZE SEUS GANHOS* ⚡

🎯 Premium = Mais sinais
📊 Premium = Maior precisão
💎 Premium = Mais lucro

🔥 Apenas 300 MTS/semana
💬 Digite !comprar agora!`
        ];
        
        const publicidade = publicidades[Math.floor(Math.random() * publicidades.length)];
        await client.sendMessage(groupId, publicidade);
        console.log('Publicidade premium VIP enviada');
    } catch (error) {
        console.log('Erro ao enviar publicidade VIP:', error);
    }
}

module.exports = {
    handleMessage,
    handleGroupJoin,
    startAutomation
};