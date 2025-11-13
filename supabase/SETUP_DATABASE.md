# 🗄️ Configuração do Banco de Dados - ERP AgroGoiás

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Projeto criado no Supabase
3. URL e chave anônima do projeto

## 🚀 Passo a Passo

### 1. Acessar o Supabase Dashboard

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Faça login na sua conta
3. Selecione seu projeto (ou crie um novo)

### 2. Executar as Migrations

#### Opção A: Executar tudo de uma vez (Recomendado)

1. No menu lateral, clique em **SQL Editor**
2. Clique em **New Query**
3. Abra o arquivo `supabase/migrations/all_migrations.sql` deste projeto
4. **Copie TODO o conteúdo** do arquivo
5. Cole no SQL Editor do Supabase
6. Clique em **Run** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)
7. ✅ Aguarde a execução (pode levar alguns segundos)

#### Opção B: Executar migrations individuais

Execute na ordem numérica:

1. `000_init.sql` - Função auxiliar para updated_at
2. `001_properties.sql` - Tabela de propriedades
3. `002_plots.sql` - Tabela de talhões
4. `003_soil_analysis.sql` - Tabela de análises de solo
5. `004_crops.sql` - Tabelas de culturas e variedades
6. `005_crop_cycles.sql` - Tabela de ciclos de cultivo

### 3. Verificar se funcionou

#### Verificar Tabelas

1. No menu lateral, clique em **Table Editor**
2. Você deve ver as seguintes tabelas:
   - ✅ `properties` - Propriedades rurais
   - ✅ `plots` - Talhões
   - ✅ `soil_analysis` - Análises de solo
   - ✅ `crops` - Catálogo de culturas
   - ✅ `culture_varieties` - Variedades de culturas
   - ✅ `crop_cycles` - Ciclos de cultivo

#### Verificar RLS (Row Level Security)

1. No menu lateral, clique em **Authentication** → **Policies**
2. Ou vá em **Table Editor** → Selecione uma tabela → Aba **Policies**
3. Cada tabela deve ter políticas de segurança configuradas:
   - `properties`: 4 políticas (SELECT, INSERT, UPDATE, DELETE)
   - `plots`: 4 políticas
   - `soil_analysis`: 4 políticas
   - `crops`: 2 políticas (SELECT público, INSERT autenticado)
   - `culture_varieties`: 2 políticas
   - `crop_cycles`: 4 políticas

#### Verificar Dados Iniciais

1. No **Table Editor**, selecione a tabela `crops`
2. Você deve ver 5 culturas pré-cadastradas:
   - Soja
   - Milho
   - Algodão
   - Café
   - Cana-de-açúcar

### 4. Configurar Variáveis de Ambiente

1. No Supabase Dashboard, vá em **Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key
3. No arquivo `js/config.js` do projeto, atualize:
   ```javascript
   const SUPABASE_URL = 'sua-url-aqui';
   const SUPABASE_ANON_KEY = 'sua-chave-aqui';
   ```

### 5. Configurar Autenticação

1. No menu lateral, clique em **Authentication** → **Providers**
2. Habilite **Email** provider
3. Para desenvolvimento, você pode desabilitar "Confirm email" em **Settings** → **Auth**
4. Configure **Site URL** e **Redirect URLs** se necessário

## 🧪 Testar o Banco de Dados

### Teste 1: Criar uma Propriedade

No SQL Editor, execute (substitua o UUID pelo seu user_id):

```sql
-- Primeiro, obtenha seu user_id
SELECT id, email FROM auth.users;

-- Depois, crie uma propriedade de teste
INSERT INTO properties (name, location, city, state, total_area, owner_id)
VALUES (
    'Fazenda Teste',
    'Rodovia BR-153, km 10',
    'Goiânia',
    'GO',
    100.50,
    'seu-user-id-aqui'  -- Substitua pelo ID real
)
RETURNING *;
```

### Teste 2: Verificar RLS

```sql
-- Deve retornar apenas suas propriedades
SELECT * FROM properties;
```

### Teste 3: Verificar Relacionamentos

```sql
-- Ver propriedades com seus talhões
SELECT 
    p.name as propriedade,
    pl.name as talhao,
    pl.area
FROM properties p
LEFT JOIN plots pl ON pl.property_id = p.id
WHERE p.owner_id = auth.uid();
```

## 📊 Estrutura das Tabelas

### properties
- `id` (UUID) - Chave primária
- `name` (VARCHAR) - Nome da propriedade
- `location` (VARCHAR) - Localização
- `city` (VARCHAR) - Cidade
- `state` (VARCHAR) - Estado (padrão: GO)
- `total_area` (DECIMAL) - Área total em hectares
- `coordinates` (JSONB) - Coordenadas geográficas
- `owner_id` (UUID) - ID do proprietário (FK para auth.users)
- `description` (TEXT) - Descrição
- `created_at`, `updated_at` (TIMESTAMP)

### plots
- `id` (UUID) - Chave primária
- `property_id` (UUID) - FK para properties
- `name` (VARCHAR) - Nome do talhão
- `area` (DECIMAL) - Área em hectares
- `soil_type` (VARCHAR) - Tipo de solo
- `coordinates` (JSONB) - Coordenadas
- `description` (TEXT) - Descrição
- `created_at`, `updated_at` (TIMESTAMP)

### soil_analysis
- `id` (UUID) - Chave primária
- `plot_id` (UUID) - FK para plots
- `analysis_date` (DATE) - Data da análise
- `ph` (DECIMAL) - pH do solo
- `organic_matter` (DECIMAL) - Matéria orgânica (%)
- `nitrogen`, `phosphorus`, `potassium` (DECIMAL) - Macronutrientes
- `micronutrients` (JSONB) - Micronutrientes
- `texture` (VARCHAR) - Textura do solo
- `laboratory` (VARCHAR) - Laboratório
- `report_number` (VARCHAR) - Número do relatório
- `recommendations` (TEXT) - Recomendações
- `created_at` (TIMESTAMP)

### crops
- `id` (UUID) - Chave primária
- `name` (VARCHAR) - Nome da cultura (único)
- `scientific_name` (VARCHAR) - Nome científico
- `category` (VARCHAR) - Categoria
- `cycle_days` (INTEGER) - Dias do ciclo
- `description` (TEXT) - Descrição
- `created_at` (TIMESTAMP)

### culture_varieties
- `id` (UUID) - Chave primária
- `crop_id` (UUID) - FK para crops
- `name` (VARCHAR) - Nome da variedade
- `characteristics` (TEXT) - Características
- `cycle_days` (INTEGER) - Dias do ciclo
- `resistances` (JSONB) - Resistências
- `requirements` (JSONB) - Requisitos
- `created_at` (TIMESTAMP)

### crop_cycles
- `id` (UUID) - Chave primária
- `plot_id` (UUID) - FK para plots
- `crop_id` (UUID) - FK para crops
- `variety_id` (UUID) - FK para culture_varieties (opcional)
- `variety_name` (VARCHAR) - Nome da variedade (texto livre)
- `planting_date` (DATE) - Data de plantio
- `expected_harvest` (DATE) - Previsão de colheita
- `actual_harvest` (DATE) - Colheita real
- `area` (DECIMAL) - Área em hectares
- `density` (DECIMAL) - Densidade (plantas/ha)
- `estimated_yield` (DECIMAL) - Produtividade estimada (kg/ha)
- `actual_yield` (DECIMAL) - Produtividade real (kg/ha)
- `status` (VARCHAR) - Status (planted, growing, harvested, cancelled)
- `costs` (DECIMAL) - Custos (R$)
- `revenue` (DECIMAL) - Receita (R$)
- `notes` (TEXT) - Observações
- `created_at`, `updated_at` (TIMESTAMP)

## 🔒 Segurança (RLS)

Todas as tabelas têm Row Level Security (RLS) habilitado:

- **properties**: Usuários só veem/editam suas próprias propriedades
- **plots**: Usuários só veem/editam talhões de suas propriedades
- **soil_analysis**: Usuários só veem/editam análises de talhões próprios
- **crops**: Leitura pública, escrita apenas para autenticados
- **culture_varieties**: Leitura pública, escrita apenas para autenticados
- **crop_cycles**: Usuários só veem/editam ciclos de talhões próprios

## ⚠️ Troubleshooting

### Erro: "relation already exists"
- As tabelas já existem. Use `DROP TABLE` se quiser recriar, ou ignore o erro.

### Erro: "function already exists"
- A função `update_updated_at_column()` já existe. Isso é normal.

### Erro: "policy already exists"
- As políticas já existem. Use `DROP POLICY` se quiser recriar.

### RLS não está funcionando
- Verifique se o usuário está autenticado
- Verifique se as políticas estão ativas
- Verifique se o `owner_id` está correto

### Não consigo inserir dados
- Verifique se está autenticado
- Verifique se o `owner_id` corresponde ao usuário logado
- Verifique as políticas de INSERT

## ✅ Checklist Final

- [ ] Todas as tabelas foram criadas
- [ ] RLS está habilitado em todas as tabelas
- [ ] Políticas de segurança estão ativas
- [ ] Dados iniciais (crops) foram inseridos
- [ ] Variáveis de ambiente configuradas
- [ ] Autenticação configurada
- [ ] Teste de inserção funcionou

## 📚 Próximos Passos

Após configurar o banco:

1. ✅ Testar autenticação no frontend
2. ✅ Criar primeira propriedade via interface
3. ✅ Criar primeiro talhão
4. ✅ Registrar primeira análise de solo
5. ✅ Criar primeiro ciclo de cultivo

---

**Última atualização**: Fase 1 completa - Fundação

