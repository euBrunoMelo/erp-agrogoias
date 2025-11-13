# 🚀 Quick Start - Criar Tabelas no Supabase

## Opção 1: Executar tudo de uma vez (Recomendado)

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **New Query**
5. Abra o arquivo `supabase/migrations/all_migrations.sql`
6. Copie TODO o conteúdo
7. Cole no SQL Editor
8. Clique em **Run** ou pressione `Ctrl+Enter`
9. ✅ Pronto! Todas as tabelas foram criadas

## Opção 2: Executar migrations individuais

Execute na ordem:

1. `000_init.sql` - Função auxiliar
2. `001_properties.sql` - Propriedades
3. `002_plots.sql` - Talhões
4. `003_soil_analysis.sql` - Análises de solo
5. `004_crops.sql` - Culturas e variedades
6. `005_crop_cycles.sql` - Ciclos de cultivo

## Verificar se funcionou

1. Vá em **Table Editor** no Supabase Dashboard
2. Você deve ver as tabelas:
   - ✅ `properties`
   - ✅ `plots`
   - ✅ `soil_analysis`
   - ✅ `crops`
   - ✅ `culture_varieties`
   - ✅ `crop_cycles`

3. Verificar RLS (Row Level Security):
   - Vá em **Authentication** → **Policies**
   - Cada tabela deve ter políticas criadas

## Testar inserção

No SQL Editor, execute:

```sql
-- Criar uma propriedade de teste (substitua o UUID pelo seu user_id)
INSERT INTO properties (name, location, total_area, owner_id)
VALUES ('Fazenda Teste', 'Goiânia-GO', 100.50, 'seu-user-id-aqui');
```

## Próximos passos

1. ✅ Tabelas criadas
2. 🔄 Implementar interface HTML/JS
3. 🔄 Configurar autenticação
4. 🔄 Criar formulários de cadastro

