# Configuração de Autenticação - Supabase Auth

## 📋 Visão Geral

O sistema utiliza **Supabase Auth** para gerenciar autenticação de usuários. A infraestrutura está configurada para:

- ✅ Login/Logout
- ✅ Registro de novos usuários
- ✅ Verificação de email (opcional)
- ✅ Row Level Security (RLS) em todas as tabelas
- ✅ Políticas de acesso baseadas em `owner_id`

## 🔧 Configuração no Supabase Dashboard

### 1. Habilitar Autenticação por Email

1. Acesse o **Supabase Dashboard**
2. Vá em **Authentication** > **Providers**
3. Certifique-se de que **Email** está habilitado
4. Configure as opções:
   - ✅ **Enable email provider**: Ativado
   - ✅ **Confirm email**: Opcional (recomendado para produção)
   - ✅ **Secure email change**: Ativado

### 2. Configurar Templates de Email (Opcional)

1. Vá em **Authentication** > **Email Templates**
2. Personalize os templates:
   - **Confirm signup**: Email de confirmação de cadastro
   - **Magic Link**: Link mágico para login
   - **Change Email Address**: Confirmação de mudança de email
   - **Reset Password**: Recuperação de senha

### 3. Configurar URLs de Redirecionamento

1. Vá em **Authentication** > **URL Configuration**
2. Configure:
   - **Site URL**: `http://localhost:3000` (desenvolvimento) ou sua URL de produção
   - **Redirect URLs**: Adicione todas as URLs permitidas:
     - `http://localhost:3000/**`
     - `https://seu-dominio.com/**`

### 4. Configurações de Segurança

1. Vá em **Authentication** > **Settings**
2. Configure:
   - **Session Timeout**: 3600 segundos (1 hora) - padrão
   - **Refresh Token Rotation**: Ativado (recomendado)
   - **JWT expiry**: 3600 segundos

## 🗄️ Estrutura do Banco de Dados

### Tabela `auth.users` (Gerenciada pelo Supabase)

O Supabase cria automaticamente a tabela `auth.users` com:
- `id` (UUID): ID único do usuário
- `email`: Email do usuário
- `encrypted_password`: Senha criptografada
- `email_confirmed_at`: Data de confirmação do email
- `created_at`: Data de criação
- `updated_at`: Data de atualização
- `raw_user_meta_data`: Metadados do usuário (JSONB)

### Relacionamento com Tabelas

Todas as tabelas principais têm uma coluna `owner_id` que referencia `auth.users(id)`:

```sql
owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
```

Isso garante que:
- Cada registro pertence a um usuário
- Quando um usuário é deletado, seus dados são deletados automaticamente (CASCADE)

## 🔒 Row Level Security (RLS)

Todas as tabelas têm RLS habilitado com políticas que garantem:

### Propriedades (`properties`)
- ✅ Usuários só veem suas próprias propriedades
- ✅ Usuários só podem criar propriedades para si mesmos
- ✅ Usuários só podem atualizar/deletar suas próprias propriedades

### Talhões (`plots`)
- ✅ Usuários só veem talhões de suas propriedades
- ✅ Usuários só podem criar talhões em suas propriedades
- ✅ Usuários só podem atualizar/deletar talhões de suas propriedades

### Análises de Solo (`soil_analysis`)
- ✅ Usuários só veem análises de seus talhões
- ✅ Usuários só podem criar análises para seus talhões
- ✅ Usuários só podem atualizar/deletar análises de seus talhões

### Ciclos de Cultivo (`crop_cycles`)
- ✅ Usuários só veem ciclos de seus talhões
- ✅ Usuários só podem criar ciclos para seus talhões
- ✅ Usuários só podem atualizar/deletar ciclos de seus talhões

### Culturas e Variedades (`crops`, `culture_varieties`)
- ✅ Qualquer usuário autenticado pode visualizar
- ✅ Qualquer usuário autenticado pode inserir

## 📝 Funções de Autenticação

### Frontend (`js/auth.js`)

#### `signIn(email, password)`
- Faz login do usuário
- Retorna `{ data, error }`

#### `signUp(email, password, userData)`
- Cria nova conta
- `userData` pode conter: `{ name, role }`
- Retorna `{ data, error }`

#### `signOut()`
- Faz logout do usuário
- Redireciona para `/login`

#### `getCurrentUser()`
- Retorna o usuário atual ou `null`

#### `getCurrentSession()`
- Retorna a sessão atual ou `null`

#### `isAuthenticated()`
- Retorna `true` se usuário está autenticado

#### `requireAuth()`
- Verifica autenticação
- Redireciona para `/login` se não autenticado
- Retorna `true` se autenticado

#### `setupAuthListener()`
- Configura listener para mudanças de autenticação
- Atualiza navbar automaticamente
- Redireciona após login/logout

## 🔐 Segurança

### Políticas RLS

Todas as políticas usam `auth.uid()` para identificar o usuário atual:

```sql
-- Exemplo: Usuário só vê suas próprias propriedades
CREATE POLICY "Users can view own properties" ON properties
    FOR SELECT USING (auth.uid() = owner_id);
```

### Validação no Frontend

- ✅ Verificação de autenticação antes de carregar dados
- ✅ Redirecionamento automático para login se não autenticado
- ✅ Proteção de rotas com `requireAuth()`

### Validação no Backend (RLS)

- ✅ Todas as queries são filtradas automaticamente pelo RLS
- ✅ Usuários não podem acessar dados de outros usuários
- ✅ Operações são validadas antes de executar

## 🚀 Fluxo de Autenticação

### 1. Registro
```
Usuário preenche formulário
    ↓
signUp() é chamado
    ↓
Supabase cria usuário em auth.users
    ↓
Email de confirmação enviado (se habilitado)
    ↓
Usuário confirma email
    ↓
Pode fazer login
```

### 2. Login
```
Usuário preenche email/senha
    ↓
signIn() é chamado
    ↓
Supabase valida credenciais
    ↓
Sessão criada (JWT token)
    ↓
authStateChange dispara 'SIGNED_IN'
    ↓
Redireciona para /dashboard
```

### 3. Acesso a Dados
```
Usuário acessa página protegida
    ↓
requireAuth() verifica sessão
    ↓
Se autenticado: carrega dados
    ↓
Query ao Supabase inclui JWT token
    ↓
RLS valida acesso baseado em auth.uid()
    ↓
Dados retornados apenas se autorizado
```

## 📋 Checklist de Configuração

- [ ] Email provider habilitado no Supabase
- [ ] URLs de redirecionamento configuradas
- [ ] Templates de email personalizados (opcional)
- [ ] RLS habilitado em todas as tabelas
- [ ] Políticas RLS criadas e testadas
- [ ] Funções de auth importadas no frontend
- [ ] Listener de auth configurado
- [ ] Rotas protegidas com `requireAuth()`

## 🐛 Troubleshooting

### Erro: "User not authenticated"
- Verifique se o usuário fez login
- Verifique se a sessão não expirou
- Recarregue a página

### Erro: "Row Level Security policy violation"
- Verifique se as políticas RLS estão corretas
- Verifique se `owner_id` está sendo definido corretamente
- Verifique se `auth.uid()` retorna o ID correto

### Email de confirmação não chega
- Verifique spam/lixo eletrônico
- Verifique configurações de email no Supabase
- Desabilite confirmação de email para desenvolvimento

### Sessão expira muito rápido
- Ajuste `Session Timeout` nas configurações
- Configure refresh token rotation

## 📚 Recursos

- [Documentação Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Políticas RLS](https://supabase.com/docs/guides/auth/row-level-security#policies)

