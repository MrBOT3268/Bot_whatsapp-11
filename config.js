module.exports = {
    // Configuração compartilhada entre os bots
    SESSION_ID: 'shared-session',
    
    // IDs dos grupos (configure aqui)
    GROUPS: {
        BOT_MAIN: '120363401320960742@g.us',
        BOT_SECONDARY: '120363404870078520@g.us'
    },
    
    // Configurações do servidor
    PORT: process.env.PORT || 3000,
    

    
    // Configurações de pagamento
    PAYMENT: {
        EMOLA: '871908190',
        MPESA: '845201750'
    }
};