// Configuração do Supabase
// URL do projeto: https://dajjvbzktyyjmykienwq.supabase.co
const SUPABASE_URL = 'https://dajjvbzktyyjmykienwq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhamp2YnprdHl5am15a2llbndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5ODI3NDIsImV4cCI6MjA3ODU1ODc0Mn0.YqEqtChtpEW97YfHZIIEIzRRphsyMFJsBPG8E_1iSyI';

// Aguardar o Supabase carregar e inicializar cliente
let supabase;

function initSupabase() {
    // O CDN do Supabase expõe como window.supabase
    if (typeof window.supabase !== 'undefined') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabaseClient = supabase;
        return true;
    }
    return false;
}

// Função para testar conexão com Supabase
async function testSupabaseConnection() {
    const dbStatusElement = document.getElementById('dbStatus');
    
    try {
        // Primeiro, verifica se a API do Supabase está acessível
        const healthCheck = await fetch(`${SUPABASE_URL}/rest/v1/`, {
            method: 'HEAD',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        if (!healthCheck.ok) {
            throw new Error(`API não está respondendo: HTTP ${healthCheck.status}`);
        }
        
        // Se o cliente Supabase estiver disponível, tenta uma query mais completa
        if (supabase) {
            // Tenta fazer uma query simples usando o cliente
            // Isso valida tanto a conexão quanto a autenticação
            const { data, error } = await supabase
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
    console.log('🔍 Verificando conexão com Supabase...');
    console.log('📍 URL:', SUPABASE_URL);
    
    try {
        await testSupabaseConnection();
    } catch (error) {
        console.error('❌ Erro ao verificar status:', error);
        const dbStatusElement = document.getElementById('dbStatus');
        dbStatusElement.innerHTML = `
            <span class="db-status-text error">
                ⚠️ Erro ao verificar conexão: ${error.message || 'Erro desconhecido'}
            </span>
        `;
        dbStatusElement.className = 'db-status error';
    }
}

// Executar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 ERP AgroGoiás - Sistema iniciado');
    console.log('📦 Supabase URL:', SUPABASE_URL);
    
    // Tentar inicializar Supabase imediatamente
    if (!initSupabase()) {
        console.log('⏳ Aguardando carregamento do Supabase CDN...');
        // Se não carregou, aguardar um pouco e tentar novamente
        setTimeout(() => {
            if (initSupabase()) {
                console.log('✅ Cliente Supabase inicializado');
                checkSystemStatus();
            } else {
                console.warn('⚠️ Cliente Supabase não carregou, usando fetch direto');
                // Fallback: verificar conexão sem cliente
                checkSystemStatus();
            }
        }, 500);
    } else {
        console.log('✅ Cliente Supabase inicializado imediatamente');
        checkSystemStatus();
    }
});

