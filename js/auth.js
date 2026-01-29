// Autenticação com Supabase Auth
import { getSupabaseClient } from './config.js';
import { showNotification } from './ui.js';
import { navigate } from './router.js';

/**
 * Função de Login
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{data: any, error: any}>}
 */
export async function signIn(email, password) {
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

/**
 * Função de Registro
 * @param {string} email 
 * @param {string} password 
 * @param {object} userData 
 * @returns {Promise<{data: any, error: any}>}
 */
export async function signUp(email, password, userData = {}) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        throw new Error('Supabase não está inicializado');
    }

    try {
        console.log('📝 Tentando criar conta para:', email);
        console.log('📋 Dados do usuário:', userData);
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData,
                emailRedirectTo: window.location.origin + '/login'
            }
        });

        if (error) {
            console.error('❌ Erro do Supabase:', error);
            throw error;
        }

        console.log('✅ Conta criada com sucesso!');
        
        if (data.user) {
            console.log('👤 Usuário criado:', data.user.id);
            console.log('📧 Email:', data.user.email);
        }

        // Não mostrar notificação aqui - deixar a página de registro fazer isso
        return { data, error: null };
    } catch (error) {
        console.error('❌ Erro ao criar conta:', error);
        
        let errorMessage = error.message || 'Erro ao criar conta';
        
        if (error.code === 'signup_disabled') {
            errorMessage = 'Cadastro está desabilitado. Entre em contato com o administrador.';
        } else if (error.code === 'email_rate_limit_exceeded') {
            errorMessage = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
        } else if (error.message && error.message.includes('already registered')) {
            errorMessage = 'Este email já está cadastrado. Faça login ou recupere sua senha.';
        }
        
        return { data: null, error: { ...error, message: errorMessage } };
    }
}

/**
 * Função de Logout
 * @returns {Promise<{error: any}>}
 */
export async function signOut() {
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

/**
 * Obter usuário atual
 * @returns {Promise<import('@supabase/supabase-js').User | null>}
 */
export async function getCurrentUser() {
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

/**
 * Obter sessão atual
 * @returns {Promise<import('@supabase/supabase-js').Session | null>}
 */
export async function getCurrentSession() {
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

/**
 * Verificar se usuário está autenticado
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
    const session = await getCurrentSession();
    return session !== null;
}

/**
 * Listener de mudanças de autenticação
 */
export function setupAuthListener() {
    const supabase = getSupabaseClient();
    if (!supabase) {
        return;
    }

    supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session);

        // Disparar evento customizado para atualizar navbar
        window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { event, session } }));

        if (event === 'SIGNED_IN') {
            showNotification('Bem-vindo!', 'success');
            // Verificar se não está na página de login/registro
            const currentPath = window.location.pathname;
            if ((currentPath === '/login' || currentPath === '/register')) {
                setTimeout(() => navigate('/dashboard'), 500);
            }
        } else if (event === 'SIGNED_OUT') {
            showNotification('Logout realizado!', 'info');
            setTimeout(() => navigate('/login'), 500);
        } else if (event === 'TOKEN_REFRESHED') {
            console.log('Token refreshed');
        }
    });
}

/**
 * Proteger rota - redireciona para login se não autenticado
 * @returns {Promise<boolean>}
 */
export async function requireAuth() {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            navigate('/login');
            return false;
        }
        return true;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        navigate('/login');
        return false;
    }
}
