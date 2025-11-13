// Configuração do Supabase
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
        if (!supabase) {
            // Se não tiver supabase, tenta verificar via fetch
            const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
                method: 'HEAD',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            });
            
            if (response.ok) {
                dbStatusElement.innerHTML = `
                    <span class="db-status-text success">
                        ✅ Supabase conectado com sucesso!
                    </span>
                `;
                dbStatusElement.className = 'db-status success';
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
            return;
        }
        
        // Teste simples de conexão usando o cliente Supabase
        const { data, error } = await supabase
            .from('_prisma_migrations')
            .select('*')
            .limit(1);
        
        // Se der erro de tabela não encontrada, ainda assim a conexão está OK
        if (error && error.code !== 'PGRST116') {
            // Tenta verificar se pelo menos a API está respondendo
            const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
                method: 'HEAD',
                headers: {
                    'apikey': SUPABASE_ANON_KEY
                }
            });
            
            if (response.ok) {
                dbStatusElement.innerHTML = `
                    <span class="db-status-text success">
                        ✅ Supabase conectado com sucesso!
                    </span>
                `;
                dbStatusElement.className = 'db-status success';
            } else {
                throw error;
            }
        } else {
            dbStatusElement.innerHTML = `
                <span class="db-status-text success">
                    ✅ Supabase conectado com sucesso!
                </span>
            `;
            dbStatusElement.className = 'db-status success';
        }
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
    try {
        // Verificar se Supabase está acessível
        const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
            method: 'HEAD',
            headers: {
                'apikey': SUPABASE_ANON_KEY
            }
        });
        
        if (response.ok) {
            await testSupabaseConnection();
        } else {
            throw new Error('Supabase não está acessível');
        }
    } catch (error) {
        console.error('Erro ao verificar status:', error);
        const dbStatusElement = document.getElementById('dbStatus');
        dbStatusElement.innerHTML = `
            <span class="db-status-text error">
                ⚠️ Erro ao verificar conexão: ${error.message}
            </span>
        `;
        dbStatusElement.className = 'db-status error';
    }
}

// Executar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    console.log('ERP AgroGoiás - Sistema iniciado');
    console.log('Supabase URL:', SUPABASE_URL);
    
    // Tentar inicializar Supabase imediatamente
    if (!initSupabase()) {
        // Se não carregou, aguardar um pouco e tentar novamente
        setTimeout(() => {
            if (initSupabase()) {
                checkSystemStatus();
            } else {
                // Fallback: verificar conexão sem cliente
                checkSystemStatus();
            }
        }, 500);
    } else {
        checkSystemStatus();
    }
});

