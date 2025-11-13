-- Migration: Criação de Tabela de Ciclos de Cultivo
-- Fase 1: Fundação - Sistema de Cultivos

-- Tabela de Ciclos de Cultivo
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
    status VARCHAR(50) DEFAULT 'planted', -- planted, growing, harvested, cancelled
    costs DECIMAL(10,2) DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_crop_cycles_plot_id ON crop_cycles(plot_id);
CREATE INDEX IF NOT EXISTS idx_crop_cycles_crop_id ON crop_cycles(crop_id);
CREATE INDEX IF NOT EXISTS idx_crop_cycles_status ON crop_cycles(status);
CREATE INDEX IF NOT EXISTS idx_crop_cycles_planting_date ON crop_cycles(planting_date DESC);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_crop_cycles_updated_at 
    BEFORE UPDATE ON crop_cycles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE crop_cycles ENABLE ROW LEVEL SECURITY;

-- Policies: Usuários só podem ver ciclos de talhões de suas propriedades
CREATE POLICY "Users can view crop cycles of own plots" ON crop_cycles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM plots
            INNER JOIN properties ON properties.id = plots.property_id
            WHERE plots.id = crop_cycles.plot_id
            AND properties.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert crop cycles for own plots" ON crop_cycles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM plots
            INNER JOIN properties ON properties.id = plots.property_id
            WHERE plots.id = crop_cycles.plot_id
            AND properties.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update crop cycles of own plots" ON crop_cycles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM plots
            INNER JOIN properties ON properties.id = plots.property_id
            WHERE plots.id = crop_cycles.plot_id
            AND properties.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete crop cycles of own plots" ON crop_cycles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM plots
            INNER JOIN properties ON properties.id = plots.property_id
            WHERE plots.id = crop_cycles.plot_id
            AND properties.owner_id = auth.uid()
        )
    );

