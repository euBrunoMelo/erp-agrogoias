-- =====================================================
-- Configurações Adicionais de Autenticação
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- Este script contém configurações opcionais para melhorar a segurança
-- e funcionalidade da autenticação. A maioria das configurações de auth
-- são feitas através do Dashboard do Supabase.

-- =====================================================
-- 1. Função para obter informações do usuário atual
-- =====================================================

-- Função auxiliar para obter dados do usuário autenticado
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2. Função para verificar se usuário é dono de uma propriedade
-- =====================================================

CREATE OR REPLACE FUNCTION is_property_owner(property_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM properties
        WHERE id = property_uuid
        AND owner_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. Função para verificar se usuário é dono de um talhão
-- =====================================================

CREATE OR REPLACE FUNCTION is_plot_owner(plot_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM plots p
        INNER JOIN properties pr ON p.property_id = pr.id
        WHERE p.id = plot_uuid
        AND pr.owner_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. View para informações do usuário (sem dados sensíveis)
-- =====================================================

CREATE OR REPLACE VIEW user_profile AS
SELECT 
    id,
    email,
    raw_user_meta_data->>'name' as name,
    raw_user_meta_data->>'role' as role,
    email_confirmed_at,
    created_at,
    updated_at
FROM auth.users;

-- Política para usuários verem apenas seu próprio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON auth.users;
-- Nota: Não podemos criar políticas diretamente em auth.users
-- Use a view user_profile para acessar dados do usuário

-- =====================================================
-- 5. Trigger para criar perfil automático (opcional)
-- =====================================================

-- Se você quiser criar uma tabela de perfis separada:
/*
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'PRODUCER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, name, role)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'name',
        COALESCE(NEW.raw_user_meta_data->>'role', 'PRODUCER')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile();
*/

-- =====================================================
-- 6. Índices para melhorar performance de queries com auth.uid()
-- =====================================================

-- Estes índices já devem estar criados nas migrations principais
-- Verificando se existem:

-- Índice em properties.owner_id (já existe)
-- CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);

-- =====================================================
-- 7. Função para estatísticas do usuário
-- =====================================================

CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE (
    total_properties BIGINT,
    total_plots BIGINT,
    total_soil_analyses BIGINT,
    total_crop_cycles BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM properties WHERE owner_id = user_uuid)::BIGINT,
        (SELECT COUNT(*) FROM plots p
         INNER JOIN properties pr ON p.property_id = pr.id
         WHERE pr.owner_id = user_uuid)::BIGINT,
        (SELECT COUNT(*) FROM soil_analysis sa
         INNER JOIN plots p ON sa.plot_id = p.id
         INNER JOIN properties pr ON p.property_id = pr.id
         WHERE pr.owner_id = user_uuid)::BIGINT,
        (SELECT COUNT(*) FROM crop_cycles cc
         INNER JOIN plots p ON cc.plot_id = p.id
         INNER JOIN properties pr ON p.property_id = pr.id
         WHERE pr.owner_id = user_uuid)::BIGINT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================

-- 1. As funções SECURITY DEFINER executam com privilégios do criador
--    Use com cuidado e apenas quando necessário

-- 2. A maioria das configurações de auth são feitas no Dashboard:
--    - Providers (Email, OAuth, etc.)
--    - Email Templates
--    - URL Configuration
--    - Security Settings

-- 3. Para desenvolvimento, você pode desabilitar confirmação de email:
--    Dashboard > Authentication > Providers > Email > Confirm email: OFF

-- 4. Para produção, sempre habilite:
--    - Email confirmation
--    - Secure email change
--    - Refresh token rotation

