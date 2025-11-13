-- =====================================================
-- Script de Verificação do Banco de Dados
-- ERP AgroGoiás - Fase 1
-- Execute este script para verificar se tudo está configurado corretamente
-- =====================================================

-- 1. Verificar se todas as tabelas existem
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('properties', 'plots', 'soil_analysis', 'crops', 'culture_varieties', 'crop_cycles')
        THEN '✅ Existe'
        ELSE '❌ Não encontrada'
    END as status
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('properties', 'plots', 'soil_analysis', 'crops', 'culture_varieties', 'crop_cycles')
ORDER BY table_name;

-- 2. Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    CASE 
        WHEN rowsecurity = true THEN '✅ RLS Habilitado'
        ELSE '❌ RLS Desabilitado'
    END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('properties', 'plots', 'soil_analysis', 'crops', 'culture_varieties', 'crop_cycles')
ORDER BY tablename;

-- 3. Verificar políticas de segurança
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('properties', 'plots', 'soil_analysis', 'crops', 'culture_varieties', 'crop_cycles')
ORDER BY tablename, policyname;

-- 4. Verificar índices
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('properties', 'plots', 'soil_analysis', 'crops', 'culture_varieties', 'crop_cycles')
ORDER BY tablename, indexname;

-- 5. Verificar triggers
SELECT 
    trigger_name,
    event_object_table as table_name,
    action_statement,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE event_object_schema = 'public'
AND event_object_table IN ('properties', 'plots', 'crop_cycles')
ORDER BY event_object_table, trigger_name;

-- 6. Verificar função auxiliar
SELECT 
    routine_name,
    routine_type,
    CASE 
        WHEN routine_name = 'update_updated_at_column' THEN '✅ Função existe'
        ELSE '❌ Função não encontrada'
    END as status
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'update_updated_at_column';

-- 7. Verificar dados iniciais (culturas)
SELECT 
    name,
    scientific_name,
    category,
    cycle_days,
    CASE 
        WHEN name IN ('Soja', 'Milho', 'Algodão', 'Café', 'Cana-de-açúcar') THEN '✅ Dado inicial'
        ELSE '📝 Dado customizado'
    END as tipo
FROM crops
ORDER BY name;

-- 8. Contar registros por tabela
SELECT 
    'properties' as tabela,
    COUNT(*) as total_registros
FROM properties
UNION ALL
SELECT 
    'plots' as tabela,
    COUNT(*) as total_registros
FROM plots
UNION ALL
SELECT 
    'soil_analysis' as tabela,
    COUNT(*) as total_registros
FROM soil_analysis
UNION ALL
SELECT 
    'crops' as tabela,
    COUNT(*) as total_registros
FROM crops
UNION ALL
SELECT 
    'culture_varieties' as tabela,
    COUNT(*) as total_registros
FROM culture_varieties
UNION ALL
SELECT 
    'crop_cycles' as tabela,
    COUNT(*) as total_registros
FROM crop_cycles
ORDER BY tabela;

-- 9. Verificar foreign keys
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
AND tc.table_name IN ('properties', 'plots', 'soil_analysis', 'crops', 'culture_varieties', 'crop_cycles')
ORDER BY tc.table_name, kcu.column_name;

-- =====================================================
-- Resumo da Verificação
-- =====================================================
-- Execute as queries acima e verifique:
-- ✅ Todas as 6 tabelas devem existir
-- ✅ RLS deve estar habilitado em todas as tabelas
-- ✅ Cada tabela deve ter políticas de segurança
-- ✅ Índices devem estar criados
-- ✅ Triggers devem estar funcionando
-- ✅ Função update_updated_at_column deve existir
-- ✅ Pelo menos 5 culturas devem estar cadastradas
-- ✅ Foreign keys devem estar configuradas corretamente

