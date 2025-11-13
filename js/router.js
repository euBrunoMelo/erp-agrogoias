// Router SPA simples

const routes = {
    '/': 'pages/dashboard.html',
    '/dashboard': 'pages/dashboard.html',
    '/properties': 'pages/properties.html',
    '/plots': 'pages/plots.html'
};

let currentPage = '';

async function navigate(path) {
    if (currentPage === path) return;
    
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
            
            // Disparar evento de página carregada
            window.dispatchEvent(new CustomEvent('pageLoaded', { detail: { path } }));
        }
    } catch (error) {
        console.error('Erro ao carregar página:', error);
        document.getElementById('app').innerHTML = `
            <div class="error-page">
                <h2>Página não encontrada</h2>
                <p>Erro ao carregar: ${path}</p>
                <button onclick="navigate('/')">Voltar ao início</button>
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
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname || '/';
    // Se for a página inicial, redirecionar para dashboard
    if (path === '/') {
        navigate('/dashboard');
    } else {
        navigate(path);
    }
});

// Exportar para uso global
window.navigate = navigate;

