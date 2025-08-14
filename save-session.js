const DatabaseAuth = require('./db-auth');

console.log('💾 Salvando sessão atual...\n');

const dbAuth = new DatabaseAuth();
const sessionBase64 = dbAuth.saveSession();

if (sessionBase64) {
    console.log('\n📋 COPIE ESTA VARIÁVEL PARA O RENDER:');
    console.log('=' .repeat(50));
    console.log('Nome: WHATSAPP_SESSION');
    console.log('Valor: ' + sessionBase64.substring(0, 100) + '...');
    console.log('=' .repeat(50));
    console.log('\n✅ Cole no Render em Environment Variables');
} else {
    console.log('❌ Nenhuma sessão encontrada para salvar');
    console.log('💡 Execute primeiro: npm run auth');
}