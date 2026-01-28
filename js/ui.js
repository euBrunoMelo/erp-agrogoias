// UI Utilities - Centralização de funções de interface
// Este arquivo centraliza a declaração de _globalShowNotification
// para evitar conflitos de redeclaração em múltiplos arquivos

// Armazenar referência à função global de notificação (se existir)
// Esta declaração deve acontecer APENAS UMA VEZ em todo o projeto
const _globalShowNotification = window.showNotification;

// Função wrapper para mostrar notificações
// Usa a função global se disponível, caso contrário cria elemento DOM
function showNotification(message, type = 'info') {
    // Se existe uma função global e ela é diferente desta, usar ela
    if (typeof _globalShowNotification === 'function' && _globalShowNotification !== showNotification) {
        _globalShowNotification(message, type);
        return;
    }
    
    // Fallback: criar notificação via DOM
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos básicos se não existirem
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 4px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
                max-width: 400px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .notification-success { background-color: #10b981; }
            .notification-error { background-color: #ef4444; }
            .notification-warning { background-color: #f59e0b; }
            .notification-info { background-color: #3b82f6; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remover após 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Exportar função globalmente
window.showNotification = showNotification;
