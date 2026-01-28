// CRUD de Análises de Solo

// Obter cliente Supabase
function getSupabaseClient() {
    return window.supabaseClient;
}

async function getSoilAnalyses(plotId = null) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        return [];
    }
    try {
        let query = supabase
            .from('soil_analysis')
            .select(`
                *,
                plots (
                    name,
                    properties (
                        name
                    )
                )
            `)
            .order('analysis_date', { ascending: false });
        
        if (plotId) {
            query = query.eq('plot_id', plotId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar análises de solo:', error);
        showNotification('Erro ao carregar análises de solo', 'error');
        return [];
    }
}

async function getSoilAnalysisById(id) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        return null;
    }
    try {
        const { data, error } = await supabase
            .from('soil_analysis')
            .select(`
                *,
                plots (
                    name,
                    properties (
                        name
                    )
                )
            `)
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar análise de solo:', error);
        showNotification('Erro ao carregar análise de solo', 'error');
        return null;
    }
}

async function createSoilAnalysis(analysis) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        const { data, error } = await supabase
            .from('soil_analysis')
            .insert([analysis])
            .select()
            .single();
        
        if (error) throw error;
        showNotification('Análise de solo criada com sucesso!', 'success');
        return data;
    } catch (error) {
        console.error('Erro ao criar análise de solo:', error);
        showNotification(error.message || 'Erro ao criar análise de solo', 'error');
        throw error;
    }
}

async function updateSoilAnalysis(id, updates) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        const { data, error } = await supabase
            .from('soil_analysis')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        showNotification('Análise de solo atualizada com sucesso!', 'success');
        return data;
    } catch (error) {
        console.error('Erro ao atualizar análise de solo:', error);
        showNotification(error.message || 'Erro ao atualizar análise de solo', 'error');
        throw error;
    }
}

async function deleteSoilAnalysis(id) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        const { error } = await supabase
            .from('soil_analysis')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        showNotification('Análise de solo excluída com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao excluir análise de solo:', error);
        showNotification(error.message || 'Erro ao excluir análise de solo', 'error');
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

