// Configuração do Supabase
// Para usar em produção, configure as variáveis de ambiente na Vercel

// Importar o cliente Supabase (usando CDN para simplicidade inicial)
// No futuro, você pode migrar para um build system como Vite ou Next.js

const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Exemplo de uso (descomente quando tiver as credenciais):
/*
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Exemplo: Buscar dados
async function fetchData() {
  const { data, error } = await supabase
    .from('sua_tabela')
    .select('*');
    
  if (error) {
    console.error('Erro ao buscar dados:', error);
    return;
  }
  
  console.log('Dados:', data);
}

// Exemplo: Inserir dados
async function insertData(dados) {
  const { data, error } = await supabase
    .from('sua_tabela')
    .insert([dados]);
    
  if (error) {
    console.error('Erro ao inserir dados:', error);
    return;
  }
  
  console.log('Dados inseridos:', data);
}
*/

console.log('Supabase configurado e pronto para uso!');

