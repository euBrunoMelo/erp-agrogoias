# Configuração do Vite - ERP AgroGoiás

Este documento descreve a configuração do Vite para o projeto ERP AgroGoiás.

## Estrutura de Arquivos

```
ERP_AGROGOIAS/
├── vite.config.js          # Configuração principal do Vite
├── .env                    # Variáveis de ambiente (não versionado)
├── .env.example           # Exemplo de variáveis de ambiente
├── main.js                # Entry point da aplicação
├── index.html             # HTML principal
└── dist/                  # Build de produção (gerado)
```

## Variáveis de Ambiente

O Vite expõe variáveis de ambiente através de `import.meta.env`. Todas as variáveis devem começar com `VITE_` para serem acessíveis no código do cliente.

### Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

**⚠️ IMPORTANTE:** O arquivo `.env` não deve ser versionado no Git. Ele já está no `.gitignore`.

### Uso no Código

```javascript
// ✅ Correto - usando import.meta.env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ❌ Errado - process.env não funciona no Vite
const SUPABASE_URL = process.env.SUPABASE_URL; // undefined
```

## Scripts Disponíveis

```bash
# Desenvolvimento (servidor local na porta 3000)
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

## Configurações do Vite

### Servidor de Desenvolvimento

- **Porta:** 3000
- **Auto-abrir:** Sim
- **CORS:** Habilitado
- **Proxy:** Configurado para APIs externas (se necessário)

### Build de Produção

- **Diretório de saída:** `dist/`
- **Assets:** `dist/assets/`
- **Minificação:** Esbuild
- **Sourcemaps:** Habilitados
- **Chunks:** Organizados em vendor chunks para melhor cache

### Resolução de Paths

O Vite resolve automaticamente:
- `@/` → Raiz do projeto
- `@js/` → `js/`
- `@pages/` → `pages/`
- `@styles/` → `styles.css`

### Otimizações

- **Code Splitting:** Automático por vendor
- **Tree Shaking:** Automático
- **CSS Code Splitting:** Habilitado
- **Asset Optimization:** Automático

## CSS do Leaflet

O CSS do Leaflet é importado diretamente no `index.html` para evitar problemas de resolução de módulos:

```html
<link rel="stylesheet" href="/node_modules/leaflet/dist/leaflet.css" />
```

No desenvolvimento, o Vite serve esses arquivos automaticamente. Em produção, eles são copiados para `dist/assets/`.

## Troubleshooting

### Erro: "Failed to resolve module specifier"

**Problema:** O Vite não consegue resolver um módulo.

**Solução:**
1. Verifique se o módulo está instalado: `npm install`
2. Verifique se o caminho está correto
3. Para CSS, use imports diretos no HTML ou imports no JS

### Erro: "navigate is not defined"

**Problema:** Função não está disponível no escopo global.

**Solução:**
- Use `window.navigate()` ao invés de `navigate()`
- Verifique se `globals.js` está sendo importado em `main.js`

### Variáveis de ambiente não funcionam

**Problema:** `import.meta.env.VITE_*` retorna `undefined`.

**Solução:**
1. Verifique se a variável começa com `VITE_`
2. Reinicie o servidor de desenvolvimento após alterar `.env`
3. Verifique se o arquivo `.env` está na raiz do projeto

### CSS não carrega em produção

**Problema:** CSS do Leaflet não aparece após build.

**Solução:**
1. Verifique se os arquivos CSS estão sendo copiados para `dist/`
2. Use imports diretos no HTML para CSS de bibliotecas externas
3. Verifique o caminho dos assets no `vite.config.js`

## Deploy

### GitHub Pages

1. Configure `base` no `vite.config.js` se o projeto estiver em subdiretório
2. Execute `npm run build`
3. Faça deploy da pasta `dist/`

### Outros Serviços

O build gera uma pasta `dist/` estática que pode ser servida por qualquer servidor web:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Nginx
- Apache

## Referências

- [Documentação do Vite](https://vitejs.dev/)
- [Variáveis de Ambiente no Vite](https://vitejs.dev/guide/env-and-mode.html)
- [Configuração do Vite](https://vitejs.dev/config/)
