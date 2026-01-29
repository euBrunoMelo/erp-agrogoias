// Entry point principal da aplicação
// Este arquivo inicializa todos os módulos e configura a aplicação

import { initSupabase } from './js/config.js';
import { setupAuthListener, isAuthenticated, signOut } from './js/auth.js';
import { navigate } from './js/router.js';
import { checkSystemStatus } from './app.js';
import './js/globals.js'; // Exporta funções para window (compatibilidade)

// Importar CSS do Leaflet (Vite resolve automaticamente)
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-measure/dist/leaflet-measure.css';

// Importar CSS principal
import './styles.css';

// Inicializar Supabase
console.log('🚀 ERP AgroGoiás - Inicializando sistema...');
initSupabase();

// Configurar listener de autenticação
setupAuthListener();

// Funções do menu hambúrguer (mantidas globais para uso no HTML)
function toggleMenu() {
    const sidebar = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('sidebarOverlay');
    const toggle = document.getElementById('menuToggle');
    
    sidebar?.classList.toggle('active');
    overlay?.classList.toggle('active');
    toggle?.classList.toggle('active');
}

function closeMenu() {
    const sidebar = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('sidebarOverlay');
    const toggle = document.getElementById('menuToggle');
    
    sidebar?.classList.remove('active');
    overlay?.classList.remove('active');
    toggle?.classList.remove('active');
}

// Atualizar navbar baseado em autenticação
async function updateNavbar() {
    try {
        const authenticated = await isAuthenticated();
        
        const navDashboard = document.getElementById('navDashboard');
        const navLogin = document.getElementById('navLogin');
        const navLogout = document.getElementById('navLogout');
        
        // Sidebar menu items
        const sidebarDashboard = document.getElementById('sidebarDashboard');
        const sidebarProperties = document.getElementById('sidebarProperties');
        const sidebarPlots = document.getElementById('sidebarPlots');
        const sidebarSoilAnalysis = document.getElementById('sidebarSoilAnalysis');
        const sidebarCropCycles = document.getElementById('sidebarCropCycles');
        const sidebarProducts = document.getElementById('sidebarProducts');
        const sidebarStock = document.getElementById('sidebarStock');
        const sidebarApplications = document.getElementById('sidebarApplications');
        const sidebarEquipment = document.getElementById('sidebarEquipment');
        const sidebarLogin = document.getElementById('sidebarLogin');
        const sidebarLogout = document.getElementById('sidebarLogout');
        
        if (authenticated) {
            // Navbar principal
            if (navDashboard) navDashboard.style.display = 'list-item';
            if (navLogin) navLogin.style.display = 'none';
            if (navLogout) navLogout.style.display = 'list-item';
            
            // Sidebar
            if (sidebarDashboard) sidebarDashboard.style.display = 'list-item';
            if (sidebarProperties) sidebarProperties.style.display = 'list-item';
            if (sidebarPlots) sidebarPlots.style.display = 'list-item';
            if (sidebarSoilAnalysis) sidebarSoilAnalysis.style.display = 'list-item';
            if (sidebarCropCycles) sidebarCropCycles.style.display = 'list-item';
            if (sidebarProducts) sidebarProducts.style.display = 'list-item';
            if (sidebarStock) sidebarStock.style.display = 'list-item';
            if (sidebarApplications) sidebarApplications.style.display = 'list-item';
            if (sidebarEquipment) sidebarEquipment.style.display = 'list-item';
            if (sidebarLogin) sidebarLogin.style.display = 'none';
            if (sidebarLogout) sidebarLogout.style.display = 'list-item';
        } else {
            // Navbar principal
            if (navDashboard) navDashboard.style.display = 'none';
            if (navLogin) navLogin.style.display = 'list-item';
            if (navLogout) navLogout.style.display = 'none';
            
            // Sidebar
            if (sidebarDashboard) sidebarDashboard.style.display = 'none';
            if (sidebarProperties) sidebarProperties.style.display = 'none';
            if (sidebarPlots) sidebarPlots.style.display = 'none';
            if (sidebarSoilAnalysis) sidebarSoilAnalysis.style.display = 'none';
            if (sidebarCropCycles) sidebarCropCycles.style.display = 'none';
            if (sidebarProducts) sidebarProducts.style.display = 'none';
            if (sidebarStock) sidebarStock.style.display = 'none';
            if (sidebarApplications) sidebarApplications.style.display = 'none';
            if (sidebarEquipment) sidebarEquipment.style.display = 'none';
            if (sidebarLogin) sidebarLogin.style.display = 'list-item';
            if (sidebarLogout) sidebarLogout.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao atualizar navbar:', error);
    }
}

async function handleLogout() {
    try {
        await signOut();
        updateNavbar();
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

// Atualizar navbar quando auth mudar
window.addEventListener('authStateChanged', () => {
    setTimeout(updateNavbar, 100);
});

// Executar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Sistema inicializado');
    
    // Verificar status do sistema (apenas na página inicial)
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        checkSystemStatus();
    }
    
    // Atualizar navbar
    setTimeout(updateNavbar, 1000);
});

// Atualizar navbar periodicamente
setInterval(() => {
    updateNavbar();
}, 3000);

// Exportar funções globalmente para uso no HTML
window.toggleMenu = toggleMenu;
window.closeMenu = closeMenu;
window.handleLogout = handleLogout;
window.navigate = navigate;
