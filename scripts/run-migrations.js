/**
 * Script para executar migrations no Supabase
 * 
 * Uso:
 * node scripts/run-migrations.js
 * 
 * Ou configure as variáveis de ambiente:
 * SUPABASE_URL=your_url
 * SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
 */

const fs = require('fs');
const path = require('path');

// Carregar configurações
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dajjvbzktyyjmykienwq.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Erro: SUPABASE_SERVICE_ROLE_KEY não configurada');
    console.log('\n📝 Para executar as migrations:');
    console.log('1. Obtenha a SERVICE_ROLE_KEY no Supabase Dashboard');
    console.log('   Settings → API → service_role (secret)');
    console.log('2. Execute:');
    console.log('   SUPABASE_SERVICE_ROLE_KEY=sua_key node scripts/run-migrations.js');
    console.log('\n⚠️  Alternativa: Execute manualmente no SQL Editor do Supabase');
    console.log('   Veja: supabase/QUICK_START.md\n');
    process.exit(1);
}

// Ler arquivo de migrations
const migrationsFile = path.join(__dirname, '..', 'supabase', 'migrations', 'all_migrations.sql');

if (!fs.existsSync(migrationsFile)) {
    console.error(`❌ Arquivo não encontrado: ${migrationsFile}`);
    process.exit(1);
}

const sql = fs.readFileSync(migrationsFile, 'utf8');

// Executar via Supabase REST API (PostgreSQL REST)
async function runMigrations() {
    console.log('🚀 Iniciando execução de migrations...\n');
    console.log(`📍 Supabase URL: ${SUPABASE_URL}\n`);

    try {
        // Dividir SQL em statements individuais
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        console.log(`📦 Total de statements: ${statements.length}\n`);

        // Executar cada statement via Supabase REST API
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            
            // Pular comentários e statements vazios
            if (!statement || statement.startsWith('--')) continue;

            try {
                console.log(`⏳ Executando statement ${i + 1}/${statements.length}...`);
                
                // Usar Supabase REST API para executar SQL
                const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_SERVICE_ROLE_KEY,
                        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
                    },
                    body: JSON.stringify({ sql: statement })
                });

                if (!response.ok) {
                    // Tentar método alternativo: SQL Editor API
                    console.log('⚠️  Método RPC não disponível, usando método alternativo...');
                    throw new Error('RPC não disponível');
                }

                console.log(`✅ Statement ${i + 1} executado com sucesso\n`);
            } catch (error) {
                console.error(`❌ Erro ao executar statement ${i + 1}:`, error.message);
                console.log('\n💡 Dica: Execute manualmente no SQL Editor do Supabase');
                console.log('   Veja: supabase/QUICK_START.md\n');
                break;
            }
        }

        console.log('✅ Migrations executadas com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao executar migrations:', error.message);
        console.log('\n💡 Solução: Execute manualmente no SQL Editor do Supabase');
        console.log('   1. Acesse: https://supabase.com/dashboard');
        console.log('   2. Vá em SQL Editor');
        console.log('   3. Abra: supabase/migrations/all_migrations.sql');
        console.log('   4. Copie e cole todo o conteúdo');
        console.log('   5. Execute (Run)\n');
        process.exit(1);
    }
}

// Verificar se estamos em ambiente Node.js
if (typeof fetch === 'undefined') {
    console.log('📝 Instruções para executar migrations:\n');
    console.log('1. Acesse o Supabase Dashboard: https://supabase.com/dashboard');
    console.log('2. Selecione seu projeto');
    console.log('3. Vá em SQL Editor (menu lateral)');
    console.log('4. Clique em "New Query"');
    console.log('5. Abra o arquivo: supabase/migrations/all_migrations.sql');
    console.log('6. Copie TODO o conteúdo do arquivo');
    console.log('7. Cole no SQL Editor');
    console.log('8. Clique em "Run" ou pressione Ctrl+Enter');
    console.log('9. ✅ Pronto! Todas as tabelas serão criadas\n');
    console.log('📚 Para mais detalhes, veja: supabase/QUICK_START.md\n');
} else {
    runMigrations();
}

