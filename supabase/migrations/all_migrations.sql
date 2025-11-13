-- =====================================================
-- ERP AgroGoiás - Todas as Migrations (Fase 1)
-- Execute este arquivo no SQL Editor do Supabase
-- =====================================================

-- 1. Função auxiliar para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Tabela de Propriedades
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(2) DEFAULT 'GO',
    total_area DECIMAL(10,2),
    coordinates JSONB,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);

DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at 
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own properties" ON properties;
CREATE POLICY "Users can view own properties" ON properties
    FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can insert own properties" ON properties;
CREATE POLICY "Users can insert own properties" ON properties
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own properties" ON properties;
CREATE POLICY "Users can update own properties" ON properties
    FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own properties" ON properties;
CREATE POLICY "Users can delete own properties" ON properties
    FOR DELETE USING (auth.uid() = owner_id);

-- 3. Tabela de Talhões
CREATE TABLE IF NOT EXISTS plots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    area DECIMAL(8,2) NOT NULL,
    soil_type VARCHAR(100),
    coordinates JSONB,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_plots_property_id ON plots(property_id);
CREATE INDEX IF NOT EXISTS idx_plots_created_at ON plots(created_at DESC);

DROP TRIGGER IF EXISTS update_plots_updated_at ON plots;
CREATE TRIGGER update_plots_updated_at 
    BEFORE UPDATE ON plots
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE plots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view plots of own properties" ON plots;
CREATE POLICY "Users can view plots of own properties" ON plots
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = plots.property_id
            AND properties.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert plots in own properties" ON plots;
CREATE POLICY "Users can insert plots in own properties" ON plots
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = plots.property_id
            AND properties.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update plots of own properties" ON plots;
CREATE POLICY "Users can update plots of own properties" ON plots
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = plots.property_id
            AND properties.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete plots of own properties" ON plots;
CREATE POLICY "Users can delete plots of own properties" ON plots
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = plots.property_id
            AND properties.owner_id = auth.uid()
        )
    );

-- 4. Tabela de Análise de Solo
CREATE TABLE IF NOT EXISTS soil_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plot_id UUID REFERENCES plots(id) ON DELETE CASCADE,
    analysis_date DATE NOT NULL,
    ph DECIMAL(3,2),
    organic_matter DECIMAL(5,2),
    nitrogen DECIMAL(5,2),
    phosphorus DECIMAL(5,2),
    potassium DECIMAL(5,2),
    micronutrients JSONB,
    texture VARCHAR(50),
    nutrients JSONB,
    recommendations TEXT,
    laboratory VARCHAR(255),
    report_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_soil_analysis_plot_id ON soil_analysis(plot_id);
CREATE INDEX IF NOT EXISTS idx_soil_analysis_date ON soil_analysis(analysis_date DESC);

ALTER TABLE soil_analysis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view soil analysis of own plots" ON soil_analysis;
CREATE POLICY "Users can view soil analysis of own plots" ON soil_analysis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM plots
            INNER JOIN properties ON properties.id = plots.property_id
            WHERE plots.id = soil_analysis.plot_id
            AND properties.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert soil analysis for own plots" ON soil_analysis;
CREATE POLICY "Users can insert soil analysis for own plots" ON soil_analysis
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM plots
            INNER JOIN properties ON properties.id = plots.property_id
            WHERE plots.id = soil_analysis.plot_id
            AND properties.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update soil analysis of own plots" ON soil_analysis;
CREATE POLICY "Users can update soil analysis of own plots" ON soil_analysis
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM plots
            INNER JOIN properties ON properties.id = plots.property_id
            WHERE plots.id = soil_analysis.plot_id
            AND properties.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete soil analysis of own plots" ON soil_analysis;
CREATE POLICY "Users can delete soil analysis of own plots" ON soil_analysis
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM plots
            INNER JOIN properties ON properties.id = plots.property_id
            WHERE plots.id = soil_analysis.plot_id
            AND properties.owner_id = auth.uid()
        )
    );

-- 5. Tabela de Culturas
CREATE TABLE IF NOT EXISTS crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    scientific_name VARCHAR(255),
    category VARCHAR(100),
    cycle_days INTEGER,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela de Variedades
CREATE TABLE IF NOT EXISTS culture_varieties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_id UUID REFERENCES crops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    characteristics TEXT,
    cycle_days INTEGER,
    resistances JSONB,
    requirements JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_culture_varieties_crop_id ON culture_varieties(crop_id);

ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE culture_varieties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view crops" ON crops;
CREATE POLICY "Anyone can view crops" ON crops
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert crops" ON crops;
CREATE POLICY "Authenticated users can insert crops" ON crops
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Anyone can view culture varieties" ON culture_varieties;
CREATE POLICY "Anyone can view culture varieties" ON culture_varieties
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert culture varieties" ON culture_varieties;
CREATE POLICY "Authenticated users can insert culture varieties" ON culture_varieties
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 7. Tabela de Ciclos de Cultivo
CREATE TABLE IF NOT EXISTS crop_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plot_id UUID REFERENCES plots(id) ON DELETE CASCADE,
    crop_id UUID REFERENCES crops(id),
    variety_id UUID REFERENCES culture_varieties(id),
    variety_name VARCHAR(255),
    planting_date DATE NOT NULL,
    expected_harvest DATE,
    actual_harvest DATE,
    area DECIMAL(8,2) NOT NULL,
    density DECIMAL(10,2),
    estimated_yield DECIMAL(10,2),
    actual_yield DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'planted',
    costs DECIMAL(10,2) DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crop_cycles_plot_id ON crop_cycles(plot_id);
CREATE INDEX IF NOT EXISTS idx_crop_cycles_crop_id ON crop_cycles(crop_id);
CREATE INDEX IF NOT EXISTS idx_crop_cycles_status ON crop_cycles(status);
CREATE INDEX IF NOT EXISTS idx_crop_cycles_planting_date ON crop_cycles(planting_date DESC);

DROP TRIGGER IF EXISTS update_crop_cycles_updated_at ON crop_cycles;
CREATE TRIGGER update_crop_cycles_updated_at 
    BEFORE UPDATE ON crop_cycles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE crop_cycles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view crop cycles of own plots" ON crop_cycles;
CREATE POLICY "Users can view crop cycles of own plots" ON crop_cycles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM plots
            INNER JOIN properties ON properties.id = plots.property_id
            WHERE plots.id = crop_cycles.plot_id
            AND properties.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert crop cycles for own plots" ON crop_cycles;
CREATE POLICY "Users can insert crop cycles for own plots" ON crop_cycles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM plots
            INNER JOIN properties ON properties.id = plots.property_id
            WHERE plots.id = crop_cycles.plot_id
            AND properties.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update crop cycles of own plots" ON crop_cycles;
CREATE POLICY "Users can update crop cycles of own plots" ON crop_cycles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM plots
            INNER JOIN properties ON properties.id = plots.property_id
            WHERE plots.id = crop_cycles.plot_id
            AND properties.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete crop cycles of own plots" ON crop_cycles;
CREATE POLICY "Users can delete crop cycles of own plots" ON crop_cycles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM plots
            INNER JOIN properties ON properties.id = plots.property_id
            WHERE plots.id = crop_cycles.plot_id
            AND properties.owner_id = auth.uid()
        )
    );

-- 8. Inserir dados iniciais (culturas)
INSERT INTO crops (name, scientific_name, category, cycle_days) VALUES
    ('Soja', 'Glycine max', 'Grão', 120),
    ('Milho', 'Zea mays', 'Grão', 120),
    ('Algodão', 'Gossypium hirsutum', 'Fibra', 180),
    ('Café', 'Coffea arabica', 'Permanente', 365),
    ('Cana-de-açúcar', 'Saccharum officinarum', 'Permanente', 365)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- Fim das Migrations
-- =====================================================

