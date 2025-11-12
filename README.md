# ERP AgroGoiás

Sistema ERP para gestão agrícola.

## 🚀 Deploy

Este projeto está configurado para deploy automático na Vercel.

### Pré-requisitos

1. Conta no [GitHub](https://github.com)
2. Conta na [Vercel](https://vercel.com)
3. Conta no [Supabase](https://supabase.com)

## 📦 Instalação Local

```bash
# Instalar dependências
npm install

# Executar localmente
npm run dev
```

O site estará disponível em `http://localhost:3000`

## 🔧 Configuração

### 1. GitHub

```bash
# Inicializar repositório
git init

# Adicionar arquivos
git add .

# Fazer commit
git commit -m "Initial commit - Olá Mundo"

# Adicionar repositório remoto
git remote add origin https://github.com/seu-usuario/erp-agrogoias.git

# Fazer push
git push -u origin main
```

### 2. Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie a URL do projeto e a chave anônima (anon key)
4. Crie um arquivo `.env` na raiz do projeto:

```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima
```

### 3. Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe seu repositório do GitHub
4. Configure as variáveis de ambiente:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
5. Clique em "Deploy"

## 🌐 Deploy Automático

Após a configuração inicial, cada push para a branch `main` irá disparar um novo deploy automaticamente na Vercel.

## 📚 Tecnologias

- HTML5
- CSS3
- JavaScript
- Supabase (Backend/Database)
- Vercel (Hosting)

## 📝 Licença

MIT

