// CRUD de Ciclos de Cultivo

// Obter cliente Supabase
function getSupabaseClient() {
    return window.supabaseClient || supabase;
}

async function getCropCycles(plotId = null) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        return [];
    }
    try {
        let query = supabase
            .from('crop_cycles')
            .select(`
                *,
                plots (
                    name,
                    properties (
                        name
                    )
                ),
                crops (
                    name
                ),
                culture_varieties (
                    name
                )
            `)
            .order('planting_date', { ascending: false });
        
        if (plotId) {
            query = query.eq('plot_id', plotId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar ciclos de cultivo:', error);
        showNotification('Erro ao carregar ciclos de cultivo', 'error');
        return [];
    }
}

async function getCropCycleById(id) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        return null;
    }
    try {
        const { data, error } = await supabase
            .from('crop_cycles')
            .select(`
                *,
                plots (
                    name,
                    properties (
                        name
                    )
                ),
                crops (
                    name
                ),
                culture_varieties (
                    name
                )
            `)
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar ciclo de cultivo:', error);
        showNotification('Erro ao carregar ciclo de cultivo', 'error');
        return null;
    }
}

async function getCrops() {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        return [];
    }
    try {
        const { data, error } = await supabase
            .from('crops')
            .select('*')
            .order('name');
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar culturas:', error);
        return [];
    }
}

async function getCultureVarieties(cropId) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        return [];
    }
    try {
        const { data, error } = await supabase
            .from('culture_varieties')
            .select('*')
            .eq('crop_id', cropId)
            .order('name');
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar variedades:', error);
        return [];
    }
}

async function createCropCycle(cycle) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        const { data, error } = await supabase
            .from('crop_cycles')
            .insert([cycle])
            .select()
            .single();
        
        if (error) throw error;
        showNotification('Ciclo de cultivo criado com sucesso!', 'success');
        return data;
    } catch (error) {
        console.error('Erro ao criar ciclo de cultivo:', error);
        showNotification(error.message || 'Erro ao criar ciclo de cultivo', 'error');
        throw error;
    }
}

async function updateCropCycle(id, updates) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        const { data, error } = await supabase
            .from('crop_cycles')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        showNotification('Ciclo de cultivo atualizado com sucesso!', 'success');
        return data;
    } catch (error) {
        console.error('Erro ao atualizar ciclo de cultivo:', error);
        showNotification(error.message || 'Erro ao atualizar ciclo de cultivo', 'error');
        throw error;
    }
}

async function deleteCropCycle(id) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        const { error } = await supabase
            .from('crop_cycles')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        showNotification('Ciclo de cultivo excluído com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao excluir ciclo de cultivo:', error);
        showNotification(error.message || 'Erro ao excluir ciclo de cultivo', 'error');
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

