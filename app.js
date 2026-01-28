// Configuração do Supabase
// URL do projeto: https://dajjvbzktyyjmykienwq.supabase.co
// NOTA: A inicialização do Supabase é feita em js/config.js
// Este arquivo apenas usa window.supabaseClient já inicializado

// Função para testar conexão com Supabase
async function testSupabaseConnection() {
    const dbStatusElement = document.getElementById('dbStatus');
    
    // Obter configuração do Supabase (disponível via window.SUPABASE_CONFIG de config.js)
    const config = window.SUPABASE_CONFIG;
    if (!config) {
        throw new Error('Configuração do Supabase não encontrada');
    }
    
    try {
        // Primeiro, verifica se a API do Supabase está acessível
        const healthCheck = await fetch(`${config.SUPABASE_URL}/rest/v1/`, {
            method: 'HEAD',
            headers: {
                'apikey': config.SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${config.SUPABASE_ANON_KEY}`
            }
        });
        
        if (!healthCheck.ok) {
            throw new Error(`API não está respondendo: HTTP ${healthCheck.status}`);
        }
        
        // Se o cliente Supabase estiver disponível, tenta uma query mais completa
        const supabaseClient = window.supabaseClient;
        if (supabaseClient) {
            // Tenta fazer uma query simples usando o cliente
            // Isso valida tanto a conexão quanto a autenticação
            const { data, error } = await supabaseClient
                .from('_realtime')
                .select('*')
                .limit(0);
            
            // Ignora erro de tabela não encontrada (é esperado se a tabela não existir)
            // O importante é que a API respondeu
            if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
                console.warn('Erro na query de teste:', error);
                // Mesmo assim, se o health check passou, a conexão está OK
            }
        }
        
        // Se chegou até aqui, a conexão está funcionando
        dbStatusElement.innerHTML = `
            <span class="db-status-text success">
                ✅ Supabase conectado com sucesso!
            </span>
        `;
        dbStatusElement.className = 'db-status success';
        console.log('✅ Conexão com Supabase estabelecida com sucesso');
        
    } catch (error) {
        console.error('Erro ao conectar com Supabase:', error);
        dbStatusElement.innerHTML = `
            <span class="db-status-text error">
                ⚠️ Erro na conexão: ${error.message || 'Verifique as configurações'}
            </span>
        `;
        dbStatusElement.className = 'db-status error';
    }
}

// Função para verificar status do sistema
async function checkSystemStatus() {
    const config = window.SUPABASE_CONFIG;
    if (config) {
        console.log('🔍 Verificando conexão com Supabase...');
        console.log('📍 URL:', config.SUPABASE_URL);
    }
    
    try {
        await testSupabaseConnection();
    } catch (error) {
        console.error('❌ Erro ao verificar status:', error);
        const dbStatusElement = document.getElementById('dbStatus');
        if (dbStatusElement) {
            dbStatusElement.innerHTML = `
                <span class="db-status-text error">
                    ⚠️ Erro ao verificar conexão: ${error.message || 'Erro desconhecido'}
                </span>
            `;
            dbStatusElement.className = 'db-status error';
        }
    }
}

// Executar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 ERP AgroGoiás - Sistema iniciado');
    
    // Aguardar Supabase ser inicializado por js/config.js
    const checkSupabaseReady = () => {
        if (window.supabaseClient) {
            console.log('✅ Cliente Supabase disponível');
            checkSystemStatus();
        } else {
            console.log('⏳ Aguardando inicialização do Supabase...');
            setTimeout(checkSupabaseReady, 100);
        }
    };
    
    // Aguardar um pouco para garantir que config.js já executou
    setTimeout(checkSupabaseReady, 200);
});

