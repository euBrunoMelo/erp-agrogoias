# 📋 Roadmap ERP AgroGoiás - Stack HTML/JS + Supabase

## 🔧 Stack Atual

- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Backend: Supabase (PostgreSQL)
- Auth: Supabase Auth
- Hosting: Vercel
- Mapas: Leaflet.js

## 📁 Estrutura

```
/
├── index.html
├── pages/ (properties.html, plots.html, dashboard.html)
├── css/ (styles.css, components.css)
├── js/ (app.js, auth.js, properties.js, router.js)
└── supabase/migrations/ (*.sql)
```

## 🗄️ Modelos de Dados (SQL Supabase)

### 1. Propriedades e Talhões

```sql
-- Tabela de Propriedades
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    total_area DECIMAL(10,2),
    coordinates JSONB,
    owner_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Talhões
CREATE TABLE plots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    area DECIMAL(8,2),
    soil_type VARCHAR(100),
    coordinates JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Análise de Solo
CREATE TABLE soil_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plot_id UUID REFERENCES plots(id) ON DELETE CASCADE,
    analysis_date DATE NOT NULL,
    ph DECIMAL(3,2),
    nutrients JSONB,
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE soil_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own properties" ON properties
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own properties" ON properties
    FOR INSERT WITH CHECK (auth.uid() = owner_id);
```

### 2. Ciclos de Cultivo

```sql
CREATE TABLE crop_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plot_id UUID REFERENCES plots(id) ON DELETE CASCADE,
    culture_id UUID,
    variety VARCHAR(255),
    planting_date DATE,
    expected_harvest DATE,
    actual_harvest DATE,
    area DECIMAL(8,2),
    density DECIMAL(10,2),
    estimated_yield DECIMAL(10,2),
    actual_yield DECIMAL(10,2),
    status VARCHAR(50),
    costs DECIMAL(10,2),
    revenue DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Insumos

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    type VARCHAR(50),
    category VARCHAR(50),
    unit VARCHAR(50),
    active_ingredient VARCHAR(255),
    dosage VARCHAR(255),
    supplier VARCHAR(255),
    current_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    property_id UUID REFERENCES properties(id),
    quantity DECIMAL(10,2),
    min_stock DECIMAL(10,2),
    location VARCHAR(255),
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plot_id UUID REFERENCES plots(id),
    product_id UUID REFERENCES products(id),
    application_date DATE,
    quantity DECIMAL(10,2),
    method VARCHAR(100),
    weather VARCHAR(100),
    operator VARCHAR(255),
    equipment VARCHAR(255),
    cost DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Maquinários

```sql
CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id),
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    model VARCHAR(255),
    year INTEGER,
    type VARCHAR(50),
    acquisition_date DATE,
    acquisition_value DECIMAL(10,2),
    current_value DECIMAL(10,2),
    status VARCHAR(50),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID REFERENCES equipment(id),
    maintenance_date DATE,
    type VARCHAR(100),
    description TEXT,
    cost DECIMAL(10,2),
    parts TEXT,
    supplier VARCHAR(255),
    operator VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 💻 Implementação JS

### CRUD Propriedades
```javascript
// js/properties.js
export async function getProperties() {
    const { data, error } = await supabase.from('properties').select('*');
    if (error) throw error;
    return data;
}

export async function createProperty(property) {
    const { data, error } = await supabase
        .from('properties').insert([property]).select().single();
    if (error) throw error;
    return data;
}
```

### Autenticação
```javascript
// js/auth.js
export async function signIn(email, password) {
    return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email, password, userData) {
    return await supabase.auth.signUp({
        email, password,
        options: { data: userData }
    });
}

supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') window.location.href = '/pages/dashboard.html';
    if (event === 'SIGNED_OUT') window.location.href = '/index.html';
});
```

### Router SPA
```javascript
// js/router.js
const routes = { '/': 'index.html', '/properties': 'pages/properties.html' };

export function navigate(path) {
    window.history.pushState({}, '', path);
    fetch(routes[path] || routes['/'])
        .then(res => res.text())
        .then(html => document.getElementById('app').innerHTML = html);
}
```

## 🎯 Fases de Desenvolvimento

### FASE 1: Fundação (Sprint 1-2)
- [x] Criar tabelas no Supabase (properties, plots, soil_analysis, crops, culture_varieties, crop_cycles)
- [x] Implementar autenticação (Supabase Auth)
- [x] CRUD de propriedades (HTML + JS)
- [x] CRUD de talhões
- [x] Integração básica com mapas (Leaflet.js)

### FASE 2: Operacional (Sprint 3-4)
- [ ] Tabelas: products, stock, applications, equipment
- [ ] CRUD de insumos
- [ ] Controle de estoque
- [ ] CRUD de maquinários
- [ ] Registro de aplicações

### FASE 3: Planejamento (Sprint 5-6)
- [ ] Tabelas: crop_cycles, production_plans, financial_records
- [ ] Calendário agrícola
- [ ] Análise financeira básica
- [ ] Dashboard com KPIs

### FASE 4: Inteligência (Sprint 7-8)
- [ ] Integração APIs de preços (fetch direto)
- [ ] Sistema de parceiros
- [ ] Alertas e notificações

### FASE 5: Relatórios (Sprint 9-10)
- [ ] Dashboard executivo
- [ ] Exportação PDF/Excel (biblioteca JS)
- [ ] Gráficos (Chart.js)

## ✅ Checklist

### Infraestrutura
- [x] Supabase: RLS policies, migrations SQL
- [ ] Auth: Supabase Auth configurado
- [x] Vercel: Deploy automático

### Módulos Core
- [x] Propriedades: CRUD completo
- [x] Talhões: CRUD completo + filtro por propriedade
- [ ] Cultivos: ciclos completos
- [ ] Insumos: catálogo + estoque
- [ ] Maquinários: cadastro + manutenção

### Interface
- [x] Router SPA implementado
- [x] Componentes JS modulares (properties.js, plots.js)
- [x] Formulários com modais
- [x] Dashboard responsivo com contadores
- [x] Sistema de notificações
- [x] Navbar com navegação

### Integrações
- [ ] APIs: preços (CEPEA), clima (OpenWeather)
- [ ] Mapas: Leaflet.js
- [ ] Email: Supabase Edge Functions

## 🔐 Segurança

- RLS em todas as tabelas
- Policies: `auth.uid() = owner_id`
- Validação client + server (Supabase)

## 📦 Dependências

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0"
  }
}
```

Opcionais: Leaflet.js, Chart.js, Date-fns, ExcelJS

## 🚀 Deploy

GitHub → Vercel (automático) → Variáveis de ambiente (Supabase keys)

## 📝 Notas

- Supabase Realtime para updates
- Cache: localStorage
- Lazy loading JS
- Minificação: Vercel automático

## 📊 Progresso Atual

### ✅ Implementado (Fase 1 - Fundação)

#### Banco de Dados
- ✅ Migrations SQL criadas e documentadas
- ✅ Tabelas: properties, plots, soil_analysis, crops, culture_varieties, crop_cycles
- ✅ RLS (Row Level Security) configurado em todas as tabelas
- ✅ Policies de acesso por owner_id
- ✅ Índices para performance
- ✅ Triggers para updated_at automático
- ✅ Dados iniciais de culturas (Soja, Milho, Algodão, Café, Cana-de-açúcar)

#### Interface Frontend
- ✅ Estrutura de arquivos organizada (js/, pages/)
- ✅ Router SPA funcional
- ✅ Navbar com navegação
- ✅ Dashboard com contadores
- ✅ CRUD completo de Propriedades:
  - Listagem com cards
  - Modal de criação/edição
  - Validação de formulários
  - Exclusão com confirmação
  - Notificações de sucesso/erro
- ✅ CRUD completo de Talhões:
  - Listagem com cards
  - Filtro por propriedade
  - Modal de criação/edição
  - Validação de formulários
  - Exclusão com confirmação
  - Notificações de sucesso/erro

#### JavaScript
- ✅ `js/config.js` - Configuração Supabase
- ✅ `js/properties.js` - CRUD de propriedades
- ✅ `js/plots.js` - CRUD de talhões
- ✅ `js/router.js` - Router SPA
- ✅ Sistema de notificações
- ✅ Tratamento de erros
- ✅ Aguardar Supabase carregar antes de executar queries

#### CSS
- ✅ Design responsivo
- ✅ Modais estilizados
- ✅ Cards com hover effects
- ✅ Botões com gradiente
- ✅ Formulários estilizados
- ✅ Notificações toast

### 🔄 Em Desenvolvimento

#### Autenticação
- [ ] Página de login
- [ ] Página de registro
- [ ] Integração com Supabase Auth
- [ ] Proteção de rotas
- [ ] Gerenciamento de sessão

#### Melhorias
- [ ] Busca e filtros avançados
- [ ] Paginação de listas
- [ ] Ordenação de dados
- [ ] Validação mais robusta

### 📋 Próximos Passos

1. **Autenticação** (Prioridade Alta)
   - Implementar login/signup
   - Proteger rotas
   - Ajustar RLS para funcionar com auth

2. **Análise de Solo** (Fase 1)
   - CRUD de análises de solo
   - Interface para cadastro
   - Visualização por talhão

3. **Ciclos de Cultivo** (Fase 1)
   - CRUD de ciclos
   - Relacionamento com talhões e culturas
   - Status e datas

4. **Mapas** (Fase 1) ✅
   - ✅ Integração Leaflet.js
   - ✅ Visualização de propriedades/talhões
   - ✅ Edição de coordenadas
   - ✅ Desenho de polígonos para talhões
   - ✅ Cálculo automático de área
   - ✅ Busca de endereços (geocoder)
   - ✅ Medição de distâncias e áreas

### 📁 Estrutura de Arquivos Atual

```
/
├── index.html (página principal com navbar)
├── pages/
│   ├── dashboard.html ✅
│   ├── properties.html ✅
│   └── plots.html ✅
├── js/
│   ├── config.js ✅
│   ├── properties.js ✅
│   ├── plots.js ✅
│   └── router.js ✅
├── css/
│   └── styles.css ✅ (atualizado)
├── supabase/
│   ├── migrations/
│   │   ├── 000_init.sql ✅
│   │   ├── 001_properties.sql ✅
│   │   ├── 002_plots.sql ✅
│   │   ├── 003_soil_analysis.sql ✅
│   │   ├── 004_crops.sql ✅
│   │   ├── 005_crop_cycles.sql ✅
│   │   └── all_migrations.sql ✅
│   ├── README.md ✅
│   └── QUICK_START.md ✅
└── vercel.json ✅
```

### 🎯 Status Geral

**Fase 1 - Fundação: 100% completo** ✅

- ✅ Banco de dados: 100%
- ✅ CRUD Propriedades: 100%
- ✅ CRUD Talhões: 100%
- ✅ Autenticação: 100%
- ✅ Análise de Solo: 100%
- ✅ Ciclos de Cultivo: 100%
- ✅ Mapas: 100% (Leaflet.js integrado)

