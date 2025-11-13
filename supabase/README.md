# Migrations Supabase - ERP AgroGoiás

## 📚 Documentação Completa

Para um guia detalhado de configuração, consulte:
- **[SETUP_DATABASE.md](./SETUP_DATABASE.md)** - Guia completo passo a passo
- **[verify_database.sql](./verify_database.sql)** - Script de verificação

## Como executar as migrations

### Opção 1: Executar tudo de uma vez (Recomendado) ⚡

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Abra o arquivo `all_migrations.sql`
5. Copie TODO o conteúdo
6. Cole no SQL Editor
7. Clique em **Run** (Ctrl+Enter)
8. ✅ Pronto! Todas as tabelas foram criadas

### Opção 2: Executar migrations individuais

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Execute cada arquivo SQL na ordem:
   - `000_init.sql` (função auxiliar)
   - `001_properties.sql`
   - `002_plots.sql`
   - `003_soil_analysis.sql`
   - `004_crops.sql`
   - `005_crop_cycles.sql`

### Opção 3: Via Supabase CLI

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref seu-project-ref

# Aplicar migrations
supabase db push
```

### Opção 3: Copiar e colar no SQL Editor

1. Abra cada arquivo SQL
2. Copie todo o conteúdo
3. Cole no SQL Editor do Supabase
4. Execute

## Ordem de execução

⚠️ **IMPORTANTE**: Execute as migrations na ordem numérica:

1. `000_init.sql` - Função auxiliar
2. `001_properties.sql` - Tabela de propriedades
3. `002_plots.sql` - Tabela de talhões
4. `003_soil_analysis.sql` - Tabela de análise de solo
5. `004_crops.sql` - Tabelas de culturas e variedades
6. `005_crop_cycles.sql` - Tabela de ciclos de cultivo

## Estrutura criada

### Tabelas principais:
- `properties` - Propriedades rurais
- `plots` - Talhões
- `soil_analysis` - Análises de solo
- `crops` - Catálogo de culturas
- `culture_varieties` - Variedades de culturas
- `crop_cycles` - Ciclos de cultivo

### Segurança:
- ✅ Row Level Security (RLS) habilitado em todas as tabelas
- ✅ Policies configuradas para acesso por owner
- ✅ Foreign keys com ON DELETE CASCADE

### Índices:
- ✅ Índices em foreign keys
- ✅ Índices em campos de busca frequente
- ✅ Índices em campos de ordenação

## Verificação

### Verificação Rápida

Execute o script `verify_database.sql` no SQL Editor para verificar:
- ✅ Todas as tabelas foram criadas
- ✅ RLS está habilitado
- ✅ Policies estão ativas
- ✅ Índices foram criados
- ✅ Triggers estão funcionando
- ✅ Dados iniciais (crops) foram inseridos
- ✅ Foreign keys estão configuradas

### Verificação Manual

Após executar as migrations, verifique:

1. **Table Editor**: Todas as 6 tabelas devem aparecer
2. **Authentication → Policies**: Cada tabela deve ter políticas
3. **Table Editor → crops**: Deve ter 5 culturas pré-cadastradas

## Próximos passos

Após criar as tabelas:
1. Testar CRUD via Supabase Dashboard
2. Implementar interface HTML/JS
3. Configurar autenticação
4. Criar formulários de cadastro

