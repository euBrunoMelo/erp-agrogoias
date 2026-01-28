// Autenticação com Supabase Auth

// Obter cliente Supabase
function getSupabaseClient() {
    return window.supabaseClient;
}

// Função de Login
async function signIn(email, password) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        throw new Error('Supabase não está inicializado');
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        showNotification('Login realizado com sucesso!', 'success');
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        showNotification(error.message || 'Erro ao fazer login', 'error');
        return { data: null, error };
    }
}

// Função de Registro
async function signUp(email, password, userData = {}) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        throw new Error('Supabase não está inicializado');
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData // Dados adicionais do usuário (nome, role, etc.)
            }
        });

        if (error) throw error;

        showNotification('Conta criada com sucesso! Verifique seu email para confirmar.', 'success');
        return { data, error: null };
    } catch (error) {
        console.error('Erro ao criar conta:', error);
        showNotification(error.message || 'Erro ao criar conta', 'error');
        return { data: null, error };
    }
}

// Função de Logout
async function signOut() {
    const supabase = getSupabaseClient();
    if (!supabase) {
        throw new Error('Supabase não está inicializado');
    }

    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        showNotification('Logout realizado com sucesso!', 'success');
        navigate('/login');
        return { error: null };
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        showNotification(error.message || 'Erro ao fazer logout', 'error');
        return { error };
    }
}

// Obter usuário atual
async function getCurrentUser() {
    const supabase = getSupabaseClient();
    if (!supabase) {
        return null;
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    } catch (error) {
        console.error('Erro ao obter usuário:', error);
        return null;
    }
}

// Obter sessão atual
async function getCurrentSession() {
    const supabase = getSupabaseClient();
    if (!supabase) {
        return null;
    }

    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    } catch (error) {
        console.error('Erro ao obter sessão:', error);
        return null;
    }
}

// Verificar se usuário está autenticado
async function isAuthenticated() {
    const session = await getCurrentSession();
    return session !== null;
}

// Listener de mudanças de autenticação
function setupAuthListener() {
    const supabase = getSupabaseClient();
    if (!supabase) {
        return;
    }

    supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session);

        // Disparar evento customizado para atualizar navbar
        window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { event, session } }));

        if (event === 'SIGNED_IN') {
            if (typeof showNotification === 'function') {
                showNotification('Bem-vindo!', 'success');
            }
            // Verificar se não está na página de login/registro
            const currentPath = window.location.pathname;
            if ((currentPath === '/login' || currentPath === '/register') && typeof navigate === 'function') {
                setTimeout(() => navigate('/dashboard'), 500);
            }
        } else if (event === 'SIGNED_OUT') {
            if (typeof showNotification === 'function') {
                showNotification('Logout realizado!', 'info');
            }
            if (typeof navigate === 'function') {
                setTimeout(() => navigate('/login'), 500);
            }
        } else if (event === 'TOKEN_REFRESHED') {
            console.log('Token refreshed');
        }
    });
}

// Proteger rota - redireciona para login se não autenticado
async function requireAuth() {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            if (typeof navigate === 'function') {
                navigate('/login');
            } else {
                window.location.href = '/login';
            }
            return false;
        }
        return true;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        if (typeof navigate === 'function') {
            navigate('/login');
        } else {
            window.location.href = '/login';
        }
        return false;
    }
}

// Inicializar auth listener quando Supabase carregar
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar Supabase carregar
    const checkSupabase = setInterval(() => {
        if (window.supabaseClient) {
            setupAuthListener();
            clearInterval(checkSupabase);
        }
    }, 100);

    // Timeout após 5 segundos
    setTimeout(() => {
        clearInterval(checkSupabase);
    }, 5000);
});

// Exportar funções para uso global
window.signIn = signIn;
window.signUp = signUp;
window.signOut = signOut;
window.getCurrentUser = getCurrentUser;
window.getCurrentSession = getCurrentSession;
window.isAuthenticated = isAuthenticated;
window.requireAuth = requireAuth;

