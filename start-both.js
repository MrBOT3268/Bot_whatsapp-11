const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando ambos os bots com autenticação compartilhada...\n');

// Inicia bot.js
const bot1 = spawn('node', ['bot.js'], {
    cwd: __dirname,
    stdio: 'pipe'
});

// Inicia bot1.js após 5 segundos para evitar conflito de QR
setTimeout(() => {
    const bot2 = spawn('node', ['bot1.js'], {
        cwd: __dirname,
        stdio: 'pipe'
    });

    bot2.stdout.on('data', (data) => {
        console.log(`[BOT1] ${data.toString().trim()}`);
    });

    bot2.stderr.on('data', (data) => {
        console.error(`[BOT1 ERROR] ${data.toString().trim()}`);
    });

    bot2.on('close', (code) => {
        console.log(`[BOT1] Processo finalizado com código ${code}`);
    });
}, 5000);

bot1.stdout.on('data', (data) => {
    console.log(`[BOT] ${data.toString().trim()}`);
});

bot1.stderr.on('data', (data) => {
    console.error(`[BOT ERROR] ${data.toString().trim()}`);
});

bot1.on('close', (code) => {
    console.log(`[BOT] Processo finalizado com código ${code}`);
});

// Mantém o processo principal ativo
process.on('SIGINT', () => {
    console.log('\n🛑 Finalizando ambos os bots...');
    bot1.kill();
    process.exit(0);
});