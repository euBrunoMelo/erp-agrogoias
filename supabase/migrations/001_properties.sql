-- Migration: Criação de Tabela de Propriedades
-- Fase 1: Fundação

-- Tabela de Propriedades
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

-- Índices
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at 
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own properties" ON properties
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own properties" ON properties
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own properties" ON properties
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own properties" ON properties
    FOR DELETE USING (auth.uid() = owner_id);

