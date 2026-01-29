// Configuração do Supabase
import { createClient } from '@supabase/supabase-js';

// Obter variáveis de ambiente ou usar valores padrão
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://dajjvbzktyyjmykienwq.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhamp2YnprdHl5am15a2llbndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5ODI3NDIsImV4cCI6MjA3ODU1ODc0Mn0.YqEqtChtpEW97YfHZIIEIzRRphsyMFJsBPG8E_1iSyI';

// Cliente Supabase singleton
let supabaseClient = null;

/**
 * Inicializa o cliente Supabase
 * @returns {import('@supabase/supabase-js').SupabaseClient} Cliente Supabase
 */
export function initSupabase() {
    if (!supabaseClient) {
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase inicializado com sucesso');
    }
    return supabaseClient;
}

/**
 * Obtém o cliente Supabase (inicializa se necessário)
 * @returns {import('@supabase/supabase-js').SupabaseClient} Cliente Supabase
 */
export function getSupabaseClient() {
    if (!supabaseClient) {
        return initSupabase();
    }
    return supabaseClient;
}

// Exportar configuração para uso em outros módulos
export const SUPABASE_CONFIG = {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    getClient: getSupabaseClient
};

// Inicializar automaticamente quando o módulo for carregado
initSupabase();
