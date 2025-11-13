# ✅ Checklist de Configuração de Autenticação

Use este checklist para garantir que a autenticação está configurada corretamente.

## 🔧 Configuração no Supabase Dashboard

### Authentication > Providers
- [ ] **Email Provider** habilitado
- [ ] **Confirm email** configurado (OFF para dev, ON para produção)
- [ ] **Secure email change** habilitado
- [ ] Outros providers (Google, GitHub, etc.) configurados se necessário

### Authentication > URL Configuration
- [ ] **Site URL** configurado:
  - Desenvolvimento: `http://localhost:3000`
  - Produção: `https://seu-dominio.com`
- [ ] **Redirect URLs** adicionadas:
  - `http://localhost:3000/**`
  - `https://seu-dominio.com/**`

### Authentication > Email Templates
- [ ] Templates personalizados (opcional)
- [ ] Teste de envio de email funcionando

### Authentication > Settings
- [ ] **Session Timeout**: 3600 segundos (1 hora)
- [ ] **Refresh Token Rotation**: Habilitado
- [ ] **JWT expiry**: 3600 segundos

## 🗄️ Banco de Dados

### Migrations Executadas
- [ ] `all_migrations.sql` executado completamente
- [ ] `auth_setup.sql` executado (opcional, mas recomendado)
- [ ] Todas as tabelas criadas
- [ ] RLS habilitado em todas as tabelas
- [ ] Políticas RLS criadas e funcionando

### Verificação de RLS
Execute no SQL Editor para verificar:

```sql
-- Verificar se RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('properties', 'plots', 'soil_analysis', 'crop_cycles');

-- Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

## 💻 Código Frontend

### Arquivos Verificados
- [ ] `js/config.js` - Configuração do Supabase
- [ ] `js/auth.js` - Funções de autenticação
- [ ] `pages/login.html` - Página de login
- [ ] `pages/register.html` - Página de registro
- [ ] `index.html` - Importa scripts corretamente

### Funcionalidades Testadas
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Logout funciona
- [ ] Redirecionamento após login funciona
- [ ] Redirecionamento após logout funciona
- [ ] Proteção de rotas funciona (`requireAuth()`)
- [ ] Listener de auth atualiza navbar
- [ ] Sessão persiste após recarregar página

## 🔒 Segurança

### RLS Policies
- [ ] Usuários só veem seus próprios dados
- [ ] Usuários só podem criar dados para si mesmos
- [ ] Usuários só podem atualizar seus próprios dados
- [ ] Usuários só podem deletar seus próprios dados

### Validação
- [ ] `owner_id` sempre definido ao criar registros
- [ ] `auth.uid()` retorna ID correto
- [ ] Queries filtradas automaticamente pelo RLS

## 🧪 Testes

### Teste de Login
1. [ ] Criar conta nova
2. [ ] Fazer login
3. [ ] Verificar redirecionamento para dashboard
4. [ ] Verificar navbar mostra usuário logado

### Teste de Proteção de Rotas
1. [ ] Fazer logout
2. [ ] Tentar acessar `/dashboard` diretamente
3. [ ] Verificar redirecionamento para `/login`

### Teste de RLS
1. [ ] Criar propriedade como usuário A
2. [ ] Fazer logout e login como usuário B
3. [ ] Verificar que usuário B não vê propriedade de A
4. [ ] Verificar que usuário B não pode editar propriedade de A

### Teste de Sessão
1. [ ] Fazer login
2. [ ] Recarregar página
3. [ ] Verificar que ainda está logado
4. [ ] Aguardar expiração de sessão (ou fazer logout)
5. [ ] Verificar redirecionamento para login

## 📋 Comandos Úteis

### Verificar usuário atual (no console do navegador)
```javascript
// Verificar sessão
const session = await getCurrentSession();
console.log('Session:', session);

// Verificar usuário
const user = await getCurrentUser();
console.log('User:', user);

// Verificar autenticação
const isAuth = await isAuthenticated();
console.log('Authenticated:', isAuth);
```

### Verificar dados no Supabase
```sql
-- Ver todos os usuários (apenas no SQL Editor)
SELECT id, email, email_confirmed_at, created_at
FROM auth.users;

-- Ver propriedades do usuário atual
SELECT * FROM properties WHERE owner_id = auth.uid();
```

## 🐛 Problemas Comuns

### "User not authenticated"
- [ ] Verificar se fez login
- [ ] Verificar se sessão não expirou
- [ ] Recarregar página

### "Row Level Security policy violation"
- [ ] Verificar se RLS está habilitado
- [ ] Verificar se políticas estão corretas
- [ ] Verificar se `owner_id` está sendo definido

### Email de confirmação não chega
- [ ] Verificar spam
- [ ] Verificar configurações de email no Supabase
- [ ] Desabilitar confirmação para desenvolvimento

### Sessão não persiste
- [ ] Verificar configurações de cookie
- [ ] Verificar se está usando HTTPS em produção
- [ ] Verificar configurações de sessão no Supabase

## ✅ Status Final

- [ ] Todas as configurações do Dashboard concluídas
- [ ] Todas as migrations executadas
- [ ] Todos os testes passando
- [ ] Documentação lida e compreendida
- [ ] Sistema pronto para uso

---

**Última atualização**: Após completar todas as etapas, marque este checklist como concluído.

