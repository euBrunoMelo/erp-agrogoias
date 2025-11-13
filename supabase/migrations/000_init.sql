-- Migration: Função auxiliar para updated_at
-- Deve ser executada primeiro

-- Função para atualizar coluna updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

