// Router SPA simples

const routes = {
    '/': 'pages/dashboard.html',
    '/dashboard': 'pages/dashboard.html',
    '/properties': 'pages/properties.html',
    '/plots': 'pages/plots.html',
    '/soil-analysis': 'pages/soil_analysis.html',
    '/crop-cycles': 'pages/crop_cycles.html',
    '/products': 'pages/products.html',
    '/stock': 'pages/stock.html',
    '/applications': 'pages/applications.html',
    '/equipment': 'pages/equipment.html',
    '/login': 'pages/login.html',
    '/register': 'pages/register.html'
};

let currentPage = '';

async function navigate(path) {
    if (currentPage === path) return;
    
    // Verificar autenticação para rotas protegidas
    const protectedRoutes = ['/dashboard', '/properties', '/plots', '/soil-analysis', '/crop-cycles', '/products', '/stock', '/applications', '/equipment'];
    const isProtectedRoute = protectedRoutes.includes(path);
    
    if (isProtectedRoute) {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            currentPage = '/login';
            window.history.pushState({ path: '/login' }, '', '/login');
            path = '/login';
        }
    }
    
    // Se estiver autenticado e tentar acessar login/register, redirecionar para dashboard
    if (path === '/login' || path === '/register') {
        const authenticated = await isAuthenticated();
        if (authenticated) {
            path = '/dashboard';
        }
    }
    
    currentPage = path;
    window.history.pushState({ path }, '', path);
    
    const route = routes[path] || routes['/'];
    
    try {
        const response = await fetch(route);
        if (!response.ok) throw new Error('Página não encontrada');
        
        const html = await response.text();
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = html;
            
            // Carregar scripts da página
            const scripts = app.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });
            
            // Fechar menu hambúrguer se estiver aberto
            if (typeof closeMenu === 'function') {
                closeMenu();
            }
            
            // Disparar evento de página carregada
            window.dispatchEvent(new CustomEvent('pageLoaded', { detail: { path } }));
        }
    } catch (error) {
        console.error('Erro ao carregar página:', error);
        document.getElementById('app').innerHTML = `
            <div class="error-page">
                <h2>Página não encontrada</h2>
                <p>Erro ao carregar: ${path}</p>
                <button onclick="navigate('/dashboard')">Voltar ao início</button>
            </div>
        `;
    }
}

// Inicializar router
window.addEventListener('popstate', (e) => {
    const path = e.state?.path || window.location.pathname;
    navigate(path);
});

// Navegação inicial
document.addEventListener('DOMContentLoaded', async () => {
    // Aguardar scripts carregarem
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const path = window.location.pathname || '/';
    
    // Verificar autenticação antes de navegar
    const protectedRoutes = ['/dashboard', '/properties', '/plots', '/soil-analysis', '/crop-cycles', '/products', '/stock', '/applications', '/equipment'];
    const isProtectedRoute = protectedRoutes.includes(path) || path === '/';
    
    if (isProtectedRoute) {
        // Aguardar funções de auth estarem disponíveis
        let retries = 0;
        while (typeof isAuthenticated !== 'function' && retries < 20) {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
        }
        
        if (typeof isAuthenticated === 'function') {
            const authenticated = await isAuthenticated();
            if (!authenticated) {
                navigate('/login');
                return;
            }
        }
    }
    
    // Se for a página inicial, redirecionar para dashboard
    if (path === '/') {
        navigate('/dashboard');
    } else {
        navigate(path);
    }
});

// Exportar para uso global
window.navigate = navigate;

