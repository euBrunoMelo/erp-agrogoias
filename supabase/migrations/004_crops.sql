-- Migration: Criação de Tabelas de Culturas e Variedades
-- Fase 1: Fundação

-- Tabela de Culturas (catálogo geral)
CREATE TABLE IF NOT EXISTS crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    scientific_name VARCHAR(255),
    category VARCHAR(100),
    cycle_days INTEGER,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Variedades
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

-- Índices
CREATE INDEX IF NOT EXISTS idx_culture_varieties_crop_id ON culture_varieties(crop_id);

-- Habilitar RLS (dados públicos de referência, mas protegidos para escrita)
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE culture_varieties ENABLE ROW LEVEL SECURITY;

-- Policies: Leitura pública, escrita apenas para admins (ou usuários autenticados)
CREATE POLICY "Anyone can view crops" ON crops
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert crops" ON crops
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view culture varieties" ON culture_varieties
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert culture varieties" ON culture_varieties
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Inserir algumas culturas padrão
INSERT INTO crops (name, scientific_name, category, cycle_days) VALUES
    ('Soja', 'Glycine max', 'Grão', 120),
    ('Milho', 'Zea mays', 'Grão', 120),
    ('Algodão', 'Gossypium hirsutum', 'Fibra', 180),
    ('Café', 'Coffea arabica', 'Permanente', 365),
    ('Cana-de-açúcar', 'Saccharum officinarum', 'Permanente', 365)
ON CONFLICT (name) DO NOTHING;

