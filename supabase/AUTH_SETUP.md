# 🔐 Configuração de Autenticação - Supabase Auth

## Configuração no Supabase Dashboard

### 1. Habilitar Autenticação

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Authentication** (menu lateral)
4. Verifique se a autenticação está habilitada

### 2. Configurar Email Auth (Recomendado)

1. Em **Authentication** → **Providers**
2. Selecione **Email**
3. Certifique-se de que está **habilitado**
4. Configure opcionalmente:
   - **Confirm email**: Desabilite para desenvolvimento (ou configure SMTP)
   - **Secure email change**: Habilite para produção

### 3. Configurar Site URL

1. Vá em **Authentication** → **URL Configuration**
2. Configure as URLs:
   - **Site URL**: `http://localhost:3000` (desenvolvimento) ou sua URL da Vercel
   - **Redirect URLs**: Adicione:
     - `http://localhost:3000/**`
     - `https://seu-projeto.vercel.app/**`

### 4. Desabilitar Confirmação de Email (Para Testes)

**Importante**: Para desenvolvimento local, você pode desabilitar a confirmação de email:

1. Vá em **Authentication** → **Providers** → **Email**
2. Desabilite **"Confirm email"**
3. Isso permite login imediatamente após registro

**⚠️ ATENÇÃO**: Reabilite para produção!

### 5. Testar Autenticação

1. Acesse sua aplicação
2. Vá para `/register`
3. Crie uma conta
4. Faça login em `/login`
5. Verifique se consegue acessar `/dashboard`

## Troubleshooting

### Erro: "Email not confirmed"
- **Solução**: Desabilite confirmação de email no Supabase (apenas para desenvolvimento)
- Ou configure SMTP para enviar emails de confirmação

### Erro: "Invalid login credentials"
- Verifique se o email e senha estão corretos
- Verifique se a conta foi criada
- Verifique se o email foi confirmado (se confirmação estiver habilitada)

### Erro: "JWT expired"
- O token de autenticação expirou
- Faça logout e login novamente
- O Supabase deve renovar automaticamente, mas pode haver problemas de configuração

### Erro: "Row Level Security policy violation"
- As policies RLS estão bloqueando acesso
- Verifique se o usuário está autenticado
- Verifique se as policies estão corretas
- Veja se o `owner_id` está sendo definido corretamente

## Verificar Sessão

Para verificar se o usuário está autenticado no Supabase Dashboard:

1. Vá em **Authentication** → **Users**
2. Verifique se o usuário aparece na lista
3. Verifique o status (active, confirmed, etc.)

## Configurar Políticas RLS

As políticas RLS já estão configuradas nas migrations. Elas verificam:

- `auth.uid() = owner_id` para propriedades
- Verificação de propriedade para talhões e análises
- Acesso público (read-only) para culturas

## Próximos Passos

1. ✅ Autenticação implementada
2. 🔄 Testar login/registro
3. 🔄 Verificar se RLS está funcionando
4. 🔄 Configurar SMTP para produção
5. 🔄 Adicionar recuperação de senha

