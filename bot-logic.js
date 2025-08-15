// Sistema de Estatísticas e Gamificação
let stats = {
    sinaisEnviados: { hoje: 0, semana: 0, total: 0 },
    plataformas: { ElephantBet: 0, Placard: 0, '888Bet': 0, Olabet: 0, PremierBet: 0 },
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

// Lógica completa do bot.js original
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
            const rules = `📜 *Regras do Grupo*

1. 🤝 Respeite todos os membros
2. 🚫 Proibido spam ou flood
3. 🎯 Mantenha o foco nos sinais de Aviator
4. 🔗 Links são permitidos apenas para admins
5. 💰 Jogue sempre com responsabilidade
6. 📱 Siga os sinais automáticos do bot

🎖️ *Comandos Disponíveis:*
• !aviator - Ver cronograma
• !nivel - Ver seu nível

⚠️ Descumprimento das regras = remoção do grupo`;
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
            
        case 'aviator':
            const cronograma = `✈️ *CRONOGRAMA SINAIS AVIATOR* ✈️

📅 *Horários de Operação:*

🐘 *ElephantBet*
• 06:00 - 07:00
• 13:00 - 14:00
• 21:00 - 22:00

🃏 *Placard*
• 07:00 - 08:00
• 15:00 - 16:00
• 22:00 - 23:00

🎰 *888Bet*
• 09:00 - 10:00 🔥
• 16:00 - 17:00 🔥

🎯 *Olabet*
• 10:00 - 11:00
• 18:00 - 19:00

🏆 *PremierBet*
• 12:00 - 13:00
• 19:00 - 20:00 🔥

🔥 *Horários Quentes* - Maior atividade
⏰ *Frequência:* A cada 1-2 minutos
🎯 *Sinais com:* Horário, Saída e Proteção
🔗 *Links diretos* para cada plataforma

⚠️ *Lembre-se:* Jogue com responsabilidade!`;
            message.reply(cronograma);
            break;
            
        case 'comprar':
            const compraMsg = `💎 *BOT AVIATOR PREMIUM* 💎

🚀 *Versão Paga - Recursos Exclusivos:*
• ✅ Sinais 24h por dia
• ✅ Taxa de acerto 85%+
• ✅ Suporte prioritário
• ✅ Análises avançadas
• ✅ Alertas personalizados

💰 *Preço:* 200 MTS/semana

📱 *Para comprar, envie:*
• Valor: 200 MTS
• Para: 871908190 (E-Mola)
• Referência: SEU_NUMERO_WHATSAPP

📲 *Após pagamento:*
Envie comprovativo para ativação automática!

🎯 *Garantia de 7 dias ou dinheiro de volta!*`;
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
    
    const welcomeMsg = `🎉 Bem-vindo(a) ao grupo, @${contact.id.user}!

📋 Digite !regras para ver as regras do grupo
✈️ Aqui você receberá sinais automáticos de Aviator

💎 *UPGRADE PARA PREMIUM:*
• Sinais 24h por dia
• Taxa de acerto 85%+
• Apenas 200 MTS/semana
• Digite !comprar para mais info

🔥 Boa sorte e bons ganhos!`;
    
    await chat.sendMessage(welcomeMsg, { mentions: [contact.id._serialized] });
}

// Função para verificar horário quente
function isHorarioQuente(hora) {
    return [9, 16, 19].includes(hora); // Horários com maior atividade
}

// Sistema de Sinais Automáticos de Aviator
function gerarSinalAviator() {
    const agora = new Date();
    const hora = parseInt(new Date().toLocaleString('pt-PT', { timeZone: 'Africa/Maputo', hour12: false }).split(' ')[1].split(':')[0]);
    
    // Links das casas de apostas
    const links = {
        'ElephantBet': 'https://record.elephantbet.com/_vpB7Eg4kO1kWqcfzuvZcQGNd7ZgqdRLk/1/',
        '888Bet': 'https://tracking.888africa.com/visit/?bta=3795&brand=888mozambique', 
        'PremierBet': 'https://media.premierbetpartners.com/redirect.aspx?pid=54483&bid=5025',
        'Placard': 'https://media1.placard.co.mz/redirect.aspx?pid=6998&bid=1723',
        'Olabet': 'https://tracking.olabet.co.mz/C.ashx?btag=a_4b_7c_&affid=4&siteid=4&adid=7&c='
    };
    
    // Determina a plataforma baseada no horário
    let plataforma;
    if (hora >= 6 && hora < 7) plataforma = 'ElephantBet';
    else if (hora >= 7 && hora < 8) plataforma = 'Placard';
    else if (hora >= 9 && hora < 10) plataforma = '888Bet';
    else if (hora >= 10 && hora < 11) plataforma = 'Olabet';
    else if (hora >= 12 && hora < 13) plataforma = 'PremierBet';
    else if (hora >= 13 && hora < 14) plataforma = 'ElephantBet';
    else if (hora >= 15 && hora < 16) plataforma = 'Placard';
    else if (hora >= 16 && hora < 17) plataforma = '888Bet';
    else if (hora >= 18 && hora < 19) plataforma = 'Olabet';
    else if (hora >= 19 && hora < 20) plataforma = 'PremierBet';
    else if (hora >= 21 && hora < 22) plataforma = 'ElephantBet';
    else if (hora >= 22 && hora < 23) plataforma = 'Placard';
    else return null;
    
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
        
        const mensagem = `✈️ *SINAL AVIATOR${quente}* ✈️

🎯 *Plataforma:* ${sinal.plataforma}
⏰ *Horário de Entrada:* ${sinal.horario}
🚀 *Saída:* ${sinal.saida}
🛡️ *Proteção:* ${sinal.protecao}

🔗 *Link:* ${sinal.link}
${isQuente ? '\n🔥 *HORÁRIO QUENTE* - Maior atividade!' : ''}

⚠️ *AVISO:* Jogue com responsabilidade!
💰 Aposte apenas o que pode perder`;

        await client.sendMessage(groupId, mensagem);
        
        // Atualiza estatísticas
        stats.sinaisEnviados.hoje++;
        stats.sinaisEnviados.semana++;
        stats.sinaisEnviados.total++;
        stats.plataformas[sinal.plataforma]++;
        
        // Simula taxa de acerto (varia entre 75-85%)
        if (Math.random() > 0.2) {
            stats.taxaAcerto = Math.min(85, stats.taxaAcerto + 0.1);
        } else {
            stats.taxaAcerto = Math.max(75, stats.taxaAcerto - 0.2);
        }
        stats.taxaAcerto = Math.round(stats.taxaAcerto * 10) / 10;
        
        console.log(`Sinal enviado: ${sinal.plataforma} - ${sinal.horario}`);
    } catch (error) {
        console.log('Erro ao enviar sinal:', error);
    }
}

// Sistema de automação
function startAutomation(client, groupId) {
    let sinaisAtivos = true;
    
    // Envia sinais automáticos
    setTimeout(() => {
        if (sinaisAtivos) enviarSinalAviator(client, groupId);
        
        setInterval(() => {
            if (!sinaisAtivos) return;
            
            const agora = new Date();
            const hora = parseInt(new Date().toLocaleString('pt-PT', { timeZone: 'Africa/Maputo', hour12: false }).split(' ')[1].split(':')[0]);
            
            if ((hora >= 6 && hora < 8) || 
                (hora >= 9 && hora < 11) || 
                (hora >= 12 && hora < 14) || 
                (hora >= 15 && hora < 17) || 
                (hora >= 18 && hora < 20) || 
                (hora >= 21 && hora < 23)) {
                enviarSinalAviator(client, groupId);
            }
        }, (Math.floor(Math.random() * 60) + 60) * 1000);
    }, 30000);
}

module.exports = {
    handleMessage,
    handleGroupJoin,
    startAutomation
};