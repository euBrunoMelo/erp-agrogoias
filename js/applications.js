// CRUD de Aplicações (Pulverização/Fertilização)

// Obter cliente Supabase
function getSupabaseClient() {
    return window.supabaseClient || supabase;
}

async function getApplications(plotId = null) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        return [];
    }
    try {
        let query = supabase
            .from('applications')
            .select('*, plots(name, properties(name)), products(name, type, unit), equipment(name, type)')
            .order('application_date', { ascending: false });
        
        if (plotId) {
            query = query.eq('plot_id', plotId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar aplicações:', error);
        showNotification('Erro ao carregar aplicações', 'error');
        return [];
    }
}

async function getApplicationById(id) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        return null;
    }
    try {
        const { data, error } = await supabase
            .from('applications')
            .select('*, plots(*, properties(*)), products(*), equipment(*)')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar aplicação:', error);
        showNotification('Erro ao carregar aplicação', 'error');
        return null;
    }
}

async function createApplication(application) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        // Obter usuário atual
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error('Usuário não autenticado');
        }

        const applicationData = {
            ...application,
            owner_id: user.id
        };

        const { data, error } = await supabase
            .from('applications')
            .insert([applicationData])
            .select()
            .single();
        
        if (error) throw error;
        showNotification('Aplicação registrada com sucesso!', 'success');
        return data;
    } catch (error) {
        console.error('Erro ao criar aplicação:', error);
        showNotification(error.message || 'Erro ao registrar aplicação', 'error');
        throw error;
    }
}

async function updateApplication(id, updates) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        const { data, error } = await supabase
            .from('applications')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        showNotification('Aplicação atualizada com sucesso!', 'success');
        return data;
    } catch (error) {
        console.error('Erro ao atualizar aplicação:', error);
        showNotification(error.message || 'Erro ao atualizar aplicação', 'error');
        throw error;
    }
}

async function deleteApplication(id) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        const { error } = await supabase
            .from('applications')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        showNotification('Aplicação excluída com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao excluir aplicação:', error);
        showNotification(error.message || 'Erro ao excluir aplicação', 'error');
        throw error;
    }
}

// Função auxiliar para mostrar notificação
function showNotification(message, type = 'info') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// Exportar funções globalmente
window.getApplications = getApplications;
window.getApplicationById = getApplicationById;
window.createApplication = createApplication;
window.updateApplication = updateApplication;
window.deleteApplication = deleteApplication;

