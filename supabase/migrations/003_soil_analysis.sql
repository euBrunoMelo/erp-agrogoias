-- Migration: Criação de Tabela de Análise de Solo
-- Fase 1: Fundação

-- Tabela de Análise de Solo
CREATE TABLE IF NOT EXISTS soil_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plot_id UUID REFERENCES plots(id) ON DELETE CASCADE,
    analysis_date DATE NOT NULL,
    ph DECIMAL(3,2),
    organic_matter DECIMAL(5,2),
    -- Macronutrientes
    nitrogen DECIMAL(5,2),
    phosphorus DECIMAL(5,2),
    potassium DECIMAL(5,2),
    -- Micronutrientes (armazenados como JSONB para flexibilidade)
    micronutrients JSONB,
    -- Textura do solo
    texture VARCHAR(50),
    -- Outros dados
    nutrients JSONB,
    recommendations TEXT,
    laboratory VARCHAR(255),
    report_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_soil_analysis_plot_id ON soil_analysis(plot_id);
CREATE INDEX IF NOT EXISTS idx_soil_analysis_date ON soil_analysis(analysis_date DESC);

-- Habilitar RLS
ALTER TABLE soil_analysis ENABLE ROW LEVEL SECURITY;

-- Policies: Usuários só podem ver análises de talhões de suas propriedades
CREATE POLICY "Users can view soil analysis of own plots" ON soil_analysis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM plots
            INNER JOIN properties ON properties.id = plots.property_id
            WHERE plots.id = soil_analysis.plot_id
            AND properties.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert soil analysis for own plots" ON soil_analysis
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM plots
            INNER JOIN properties ON properties.id = plots.property_id
            WHERE plots.id = soil_analysis.plot_id
            AND properties.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update soil analysis of own plots" ON soil_analysis
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM plots
            INNER JOIN properties ON properties.id = plots.property_id
            WHERE plots.id = soil_analysis.plot_id
            AND properties.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete soil analysis of own plots" ON soil_analysis
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM plots
            INNER JOIN properties ON properties.id = plots.property_id
            WHERE plots.id = soil_analysis.plot_id
            AND properties.owner_id = auth.uid()
        )
    );

