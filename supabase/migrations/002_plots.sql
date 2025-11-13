-- Migration: Criação de Tabela de Talhões
-- Fase 1: Fundação

-- Tabela de Talhões
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

-- Índices
CREATE INDEX IF NOT EXISTS idx_plots_property_id ON plots(property_id);
CREATE INDEX IF NOT EXISTS idx_plots_created_at ON plots(created_at DESC);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_plots_updated_at 
    BEFORE UPDATE ON plots
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE plots ENABLE ROW LEVEL SECURITY;

-- Policies: Usuários só podem ver talhões de suas propriedades
CREATE POLICY "Users can view plots of own properties" ON plots
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = plots.property_id
            AND properties.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert plots in own properties" ON plots
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = plots.property_id
            AND properties.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update plots of own properties" ON plots
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = plots.property_id
            AND properties.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete plots of own properties" ON plots
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM properties
            WHERE properties.id = plots.property_id
            AND properties.owner_id = auth.uid()
        )
    );

