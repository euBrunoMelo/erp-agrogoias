// Configuração do Supabase
// Verificar se já foi inicializado para evitar redeclaração
if (typeof window.SUPABASE_CONFIG === 'undefined') {
    const SUPABASE_URL = 'https://dajjvbzktyyjmykienwq.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhamp2YnprdHl5am15a2llbndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5ODI3NDIsImV4cCI6MjA3ODU1ODc0Mn0.YqEqtChtpEW97YfHZIIEIzRRphsyMFJsBPG8E_1iSyI';

    // Inicializar Supabase
    let supabase;

    function initSupabase() {
        if (typeof window.supabase !== 'undefined') {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            window.supabaseClient = supabase;
            return true;
        }
        return false;
    }

    // Aguardar Supabase carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (!initSupabase()) {
                setTimeout(() => initSupabase(), 500);
            }
        });
    } else {
        if (!initSupabase()) {
            setTimeout(() => initSupabase(), 500);
        }
    }

    // Exportar para uso em outros módulos
    window.SUPABASE_CONFIG = { SUPABASE_URL, SUPABASE_ANON_KEY, getClient: () => supabase };
}
