const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('🔐 Iniciando autenticação local...\n');

const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'shared-session' })
});

client.on('qr', (qr) => {
    console.log('📱 Escaneie o QR Code abaixo com seu WhatsApp:\n');
    qrcode.generate(qr, { small: true });
    console.log('\n✅ Após escanear, a sessão será salva localmente');
});

client.on('authenticated', () => {
    console.log('✅ Autenticado com sucesso!');
    console.log('📁 Sessão salva em .wwebjs_auth/');
});

client.on('ready', () => {
    console.log('🚀 WhatsApp conectado!');
    console.log('📤 Agora você pode fazer upload da pasta .wwebjs_auth para o Render');
    console.log('⚠️  Pressione Ctrl+C para sair');
});

client.on('auth_failure', () => {
    console.log('❌ Falha na autenticação');
});

client.initialize();