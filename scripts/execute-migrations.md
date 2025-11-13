# 🚀 Como Executar Migrations no Supabase

## Método 1: Via Supabase Dashboard (Recomendado)

### Passo a passo:

1. **Acesse o Supabase Dashboard**
   - Vá para: https://supabase.com/dashboard
   - Faça login na sua conta

2. **Selecione seu projeto**
   - Clique no projeto: `dajjvbzktyyjmykienwq`

3. **Abra o SQL Editor**
   - No menu lateral, clique em **SQL Editor**
   - Clique em **New Query**

4. **Cole o SQL das migrations**
   - Abra o arquivo: `supabase/migrations/all_migrations.sql`
   - Selecione TODO o conteúdo (Ctrl+A)
   - Copie (Ctrl+C)
   - Cole no SQL Editor (Ctrl+V)

5. **Execute as migrations**
   - Clique no botão **Run** (ou pressione `Ctrl+Enter`)
   - Aguarde a execução completar

6. **Verifique se funcionou**
   - Vá em **Table Editor** no menu lateral
   - Você deve ver as tabelas:
     - ✅ `properties`
     - ✅ `plots`
     - ✅ `soil_analysis`
     - ✅ `crops`
     - ✅ `culture_varieties`
     - ✅ `crop_cycles`

## Método 2: Via Supabase CLI

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto (use o project ref do seu projeto)
supabase link --project-ref dajjvbzktyyjmykienwq

# Aplicar migrations
supabase db push
```

## Método 3: Via Script Node.js (Experimental)

```bash
# Configurar variáveis de ambiente
export SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

# Executar script
node scripts/run-migrations.js
```

⚠️ **Nota**: O Método 1 (Dashboard) é o mais simples e recomendado.

## Verificação

Após executar as migrations, verifique:

1. **Tabelas criadas**:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

2. **RLS habilitado**:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```

3. **Policies criadas**:
   ```sql
   SELECT schemaname, tablename, policyname 
   FROM pg_policies 
   WHERE schemaname = 'public'
   ORDER BY tablename, policyname;
   ```

## Dados Iniciais

As migrations incluem dados iniciais de culturas:
- Soja
- Milho
- Algodão
- Café
- Cana-de-açúcar

Você pode verificar:
```sql
SELECT * FROM crops;
```

## Troubleshooting

### Erro: "relation already exists"
- As tabelas já foram criadas anteriormente
- Você pode deletar as tabelas e executar novamente, ou
- Usar `CREATE TABLE IF NOT EXISTS` (já incluído)

### Erro: "permission denied"
- Verifique se está usando a conta correta
- Verifique se o projeto está ativo

### Erro: "function does not exist"
- Execute primeiro `000_init.sql` para criar a função auxiliar
- Ou execute `all_migrations.sql` que inclui tudo

## Próximos Passos

Após executar as migrations:

1. ✅ Tabelas criadas
2. 🔄 Implementar interface HTML/JS
3. 🔄 Configurar autenticação
4. 🔄 Criar formulários de cadastro

