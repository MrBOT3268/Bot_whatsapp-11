const fs = require('fs');
const path = require('path');

class DatabaseAuth {
    constructor() {
        this.sessionData = null;
        this.loadFromEnv();
    }

    // Carrega sessão da variável de ambiente
    loadFromEnv() {
        try {
            const sessionBase64 = process.env.WHATSAPP_SESSION;
            if (sessionBase64) {
                console.log('📦 Carregando sessão da base de dados...');
                const decodedData = Buffer.from(sessionBase64, 'base64').toString('utf8');
                this.sessionData = JSON.parse(decodedData);
                this.restoreSession();
                return true;
            } else {
                console.log('ℹ️ Variável WHATSAPP_SESSION não encontrada');
            }
        } catch (error) {
            console.log('❌ Erro ao carregar sessão:', error.message);
            console.log('💡 Verifique se a variável WHATSAPP_SESSION está correta');
        }
        return false;
    }

    // Restaura arquivos de sessão
    restoreSession() {
        if (!this.sessionData) return;

        const authPath = '.wwebjs_auth/session-shared-session';
        
        // Cria diretórios
        fs.mkdirSync(authPath, { recursive: true });
        
        // Restaura arquivos da sessão
        Object.keys(this.sessionData).forEach(fileName => {
            const filePath = path.join(authPath, fileName);
            const fileData = Buffer.from(this.sessionData[fileName], 'base64');
            
            // Cria subdiretórios se necessário
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, fileData);
        });

        console.log('✅ Sessão restaurada da base de dados');
    }

    // Salva sessão atual (apenas arquivos essenciais)
    saveSession() {
        try {
            // Verifica todas as pastas de sessão possíveis
            const possiblePaths = [
                '.wwebjs_auth/session-shared-session',
                '.wwebjs_auth/session',
                '.wwebjs_auth/session-bot1-session'
            ];
            
            let authPath = null;
            for (const path of possiblePaths) {
                if (fs.existsSync(path)) {
                    authPath = path;
                    break;
                }
            }
            
            if (!authPath) {
                console.log('❌ Nenhuma pasta de sessão encontrada');
                console.log('💡 Pastas verificadas:', possiblePaths);
                return;
            }
            
            console.log('📁 Usando sessão:', authPath);

            const sessionData = {};
            
            // Apenas arquivos mínimos para autenticação
            const essentialFiles = [
                'Default/Local Storage/leveldb',
                'Default/Cookies'
            ];
            
            // Função para ler apenas arquivos essenciais
            const readEssentialFiles = (dir, baseDir = '') => {
                if (!fs.existsSync(dir)) return;
                
                const files = fs.readdirSync(dir);
                files.forEach(file => {
                    const fullPath = path.join(dir, file);
                    const relativePath = path.join(baseDir, file);
                    
                    if (fs.statSync(fullPath).isDirectory()) {
                        readEssentialFiles(fullPath, relativePath);
                    } else {
                        // Apenas arquivos muito pequenos
                        const stats = fs.statSync(fullPath);
                        if (stats.size < 100 * 1024) { // Máximo 100KB por arquivo
                            const fileData = fs.readFileSync(fullPath);
                            sessionData[relativePath] = fileData.toString('base64');
                        }
                    }
                });
            };

            // Lê apenas diretórios essenciais
            essentialFiles.forEach(essentialPath => {
                const fullEssentialPath = path.join(authPath, essentialPath);
                if (fs.existsSync(fullEssentialPath)) {
                    if (fs.statSync(fullEssentialPath).isDirectory()) {
                        readEssentialFiles(fullEssentialPath, essentialPath);
                    } else {
                        const fileData = fs.readFileSync(fullEssentialPath);
                        sessionData[essentialPath] = fileData.toString('base64');
                    }
                }
            });
            
            // Converte para base64 comprimido
            const jsonString = JSON.stringify(sessionData, null, 0); // Remove espaços
            const sessionBase64 = Buffer.from(jsonString, 'utf8').toString('base64');
            
            console.log('💾 Sessão otimizada salva!');
            console.log('📋 Arquivos salvos:', Object.keys(sessionData).length);
            console.log('📋 Tamanho:', Math.round(sessionBase64.length / 1024), 'KB');
            console.log('\n📱 VALOR COMPLETO PARA O RENDER:');
            console.log('Nome: WHATSAPP_SESSION');
            console.log('Valor: ' + sessionBase64);
            
            return sessionBase64;
        } catch (error) {
            console.log('❌ Erro ao salvar sessão:', error.message);
        }
    }
}

module.exports = DatabaseAuth;