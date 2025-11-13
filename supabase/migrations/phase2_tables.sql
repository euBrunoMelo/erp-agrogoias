-- =====================================================
-- ERP AgroGoiás - Fase 2: Produtos, Estoque, Aplicações e Equipamentos
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- =====================================================
-- 1. Tabela de Produtos (Insumos)
-- =====================================================

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    type VARCHAR(50) NOT NULL, -- SEED, FERTILIZER, PESTICIDE, FUEL, MACHINERY_PARTS, OTHER
    category VARCHAR(50), -- Categoria específica dentro do tipo
    unit VARCHAR(50) NOT NULL DEFAULT 'kg', -- kg, L, un, saco, etc.
    active_ingredient VARCHAR(255), -- Ingrediente ativo (para defensivos)
    dosage VARCHAR(255), -- Dosagem recomendada
    supplier VARCHAR(255), -- Fornecedor principal
    current_price DECIMAL(10,2), -- Preço atual
    description TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_owner_id ON products(owner_id);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own products" ON products;
CREATE POLICY "Users can view own products" ON products
    FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can insert own products" ON products;
CREATE POLICY "Users can insert own products" ON products
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own products" ON products;
CREATE POLICY "Users can update own products" ON products
    FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own products" ON products;
CREATE POLICY "Users can delete own products" ON products
    FOR DELETE USING (auth.uid() = owner_id);

-- =====================================================
-- 2. Tabela de Estoque
-- =====================================================

CREATE TABLE IF NOT EXISTS stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    min_stock DECIMAL(10,2) DEFAULT 0, -- Estoque mínimo (alerta)
    location VARCHAR(255), -- Localização física do estoque
    expiry_date DATE, -- Data de validade (se aplicável)
    batch_number VARCHAR(100), -- Número do lote
    notes TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_product_id ON stock(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_property_id ON stock(property_id);
CREATE INDEX IF NOT EXISTS idx_stock_owner_id ON stock(owner_id);
CREATE INDEX IF NOT EXISTS idx_stock_expiry_date ON stock(expiry_date);

DROP TRIGGER IF EXISTS update_stock_updated_at ON stock;
CREATE TRIGGER update_stock_updated_at 
    BEFORE UPDATE ON stock
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE stock ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view stock of own properties" ON stock;
CREATE POLICY "Users can view stock of own properties" ON stock
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = stock.property_id
            AND properties.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert stock in own properties" ON stock;
CREATE POLICY "Users can insert stock in own properties" ON stock
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = stock.property_id
            AND properties.owner_id = auth.uid()
        )
        AND auth.uid() = owner_id
    );

DROP POLICY IF EXISTS "Users can update stock of own properties" ON stock;
CREATE POLICY "Users can update stock of own properties" ON stock
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = stock.property_id
            AND properties.owner_id = auth.uid()
        )
        AND auth.uid() = owner_id
    );

DROP POLICY IF EXISTS "Users can delete stock of own properties" ON stock;
CREATE POLICY "Users can delete stock of own properties" ON stock
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = stock.property_id
            AND properties.owner_id = auth.uid()
        )
        AND auth.uid() = owner_id
    );

-- =====================================================
-- 3. Tabela de Aplicações (Pulverização/Fertilização)
-- =====================================================

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plot_id UUID REFERENCES plots(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    application_date DATE NOT NULL,
    quantity DECIMAL(10,2) NOT NULL, -- Quantidade aplicada
    unit VARCHAR(50) DEFAULT 'L', -- Unidade (L, kg, etc.)
    method VARCHAR(100), -- Método de aplicação (aérea, terrestre, etc.)
    weather VARCHAR(100), -- Condições climáticas
    operator VARCHAR(255), -- Operador responsável
    equipment_id UUID, -- Referência ao equipamento usado (será criada depois)
    cost DECIMAL(10,2), -- Custo da aplicação
    notes TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_plot_id ON applications(plot_id);
CREATE INDEX IF NOT EXISTS idx_applications_product_id ON applications(product_id);
CREATE INDEX IF NOT EXISTS idx_applications_owner_id ON applications(owner_id);
CREATE INDEX IF NOT EXISTS idx_applications_date ON applications(application_date DESC);

DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at 
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view applications of own plots" ON applications;
CREATE POLICY "Users can view applications of own plots" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM plots p
            INNER JOIN properties pr ON p.property_id = pr.id
            WHERE p.id = applications.plot_id
            AND pr.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert applications for own plots" ON applications;
CREATE POLICY "Users can insert applications for own plots" ON applications
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM plots p
            INNER JOIN properties pr ON p.property_id = pr.id
            WHERE p.id = applications.plot_id
            AND pr.owner_id = auth.uid()
        )
        AND auth.uid() = owner_id
    );

DROP POLICY IF EXISTS "Users can update applications of own plots" ON applications;
CREATE POLICY "Users can update applications of own plots" ON applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM plots p
            INNER JOIN properties pr ON p.property_id = pr.id
            WHERE p.id = applications.plot_id
            AND pr.owner_id = auth.uid()
        )
        AND auth.uid() = owner_id
    );

DROP POLICY IF EXISTS "Users can delete applications of own plots" ON applications;
CREATE POLICY "Users can delete applications of own plots" ON applications
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM plots p
            INNER JOIN properties pr ON p.property_id = pr.id
            WHERE p.id = applications.plot_id
            AND pr.owner_id = auth.uid()
        )
        AND auth.uid() = owner_id
    );

-- =====================================================
-- 4. Tabela de Equipamentos
-- =====================================================

CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    model VARCHAR(255),
    year INTEGER,
    type VARCHAR(50) NOT NULL, -- TRACTOR, HARVESTER, SPRAYER, PLANTER, IMPLEMENT, OTHER
    acquisition_date DATE,
    acquisition_value DECIMAL(10,2), -- Valor de aquisição
    current_value DECIMAL(10,2), -- Valor atual (depreciação)
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, MAINTENANCE, INACTIVE, SOLD
    location VARCHAR(255), -- Localização atual
    serial_number VARCHAR(255), -- Número de série
    license_plate VARCHAR(50), -- Placa (se aplicável)
    description TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_equipment_property_id ON equipment(property_id);
CREATE INDEX IF NOT EXISTS idx_equipment_owner_id ON equipment(owner_id);
CREATE INDEX IF NOT EXISTS idx_equipment_type ON equipment(type);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);

DROP TRIGGER IF EXISTS update_equipment_updated_at ON equipment;
CREATE TRIGGER update_equipment_updated_at 
    BEFORE UPDATE ON equipment
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view equipment of own properties" ON equipment;
CREATE POLICY "Users can view equipment of own properties" ON equipment
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = equipment.property_id
            AND properties.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert equipment in own properties" ON equipment;
CREATE POLICY "Users can insert equipment in own properties" ON equipment
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = equipment.property_id
            AND properties.owner_id = auth.uid()
        )
        AND auth.uid() = owner_id
    );

DROP POLICY IF EXISTS "Users can update equipment of own properties" ON equipment;
CREATE POLICY "Users can update equipment of own properties" ON equipment
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = equipment.property_id
            AND properties.owner_id = auth.uid()
        )
        AND auth.uid() = owner_id
    );

DROP POLICY IF EXISTS "Users can delete equipment of own properties" ON equipment;
CREATE POLICY "Users can delete equipment of own properties" ON equipment
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = equipment.property_id
            AND properties.owner_id = auth.uid()
        )
        AND auth.uid() = owner_id
    );

-- =====================================================
-- 5. Atualizar tabela applications para referenciar equipment
-- =====================================================

-- Adicionar foreign key para equipment (se ainda não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'applications_equipment_id_fkey'
        AND table_name = 'applications'
    ) THEN
        ALTER TABLE applications 
        ADD CONSTRAINT applications_equipment_id_fkey 
        FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE SET NULL;
    END IF;
END $$;

-- =====================================================
-- 6. Inserir dados iniciais (opcional)
-- =====================================================

-- Tipos de produtos comuns (será usado como referência no frontend)
-- Não criamos tabela separada, mas podemos usar ENUMs ou validação no frontend

-- =====================================================
-- Fim das Migrations da Fase 2
-- =====================================================

