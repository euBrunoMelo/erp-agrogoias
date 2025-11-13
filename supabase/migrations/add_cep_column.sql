-- Adicionar coluna CEP na tabela properties
-- Execute este script no SQL Editor do Supabase

-- Verificar se a coluna já existe antes de adicionar
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'cep'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE properties ADD COLUMN cep VARCHAR(9);
        RAISE NOTICE 'Coluna CEP adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna CEP já existe na tabela properties.';
    END IF;
END $$;

