// CRUD de Talhões

// Obter cliente Supabase
function getSupabaseClient() {
    return window.supabaseClient;
}

async function getPlots(propertyId = null) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        return [];
    }
    try {
        let query = supabase
            .from('plots')
            .select('*, properties(name)')
            .order('created_at', { ascending: false });
        
        if (propertyId) {
            query = query.eq('property_id', propertyId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar talhões:', error);
        showNotification('Erro ao carregar talhões', 'error');
        return [];
    }
}

async function getPlotById(id) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        return null;
    }
    try {
        const { data, error } = await supabase
            .from('plots')
            .select('*, properties(name)')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar talhão:', error);
        showNotification('Erro ao carregar talhão', 'error');
        return null;
    }
}

async function createPlot(plot) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        const { data, error } = await supabase
            .from('plots')
            .insert([plot])
            .select()
            .single();
        
        if (error) throw error;
        showNotification('Talhão criado com sucesso!', 'success');
        return data;
    } catch (error) {
        console.error('Erro ao criar talhão:', error);
        showNotification(error.message || 'Erro ao criar talhão', 'error');
        throw error;
    }
}

async function updatePlot(id, updates) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        const { data, error } = await supabase
            .from('plots')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        showNotification('Talhão atualizado com sucesso!', 'success');
        return data;
    } catch (error) {
        console.error('Erro ao atualizar talhão:', error);
        showNotification(error.message || 'Erro ao atualizar talhão', 'error');
        throw error;
    }
}

async function deletePlot(id) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        const { error } = await supabase
            .from('plots')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        showNotification('Talhão excluído com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao excluir talhão:', error);
        showNotification(error.message || 'Erro ao excluir talhão', 'error');
        throw error;
    }
}

// Função auxiliar para mostrar notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

