// CRUD de Equipamentos
import { getSupabaseClient } from './config.js';
import { showNotification } from './ui.js';

export async function getEquipment(propertyId = null) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        return [];
    }
    try {
        let query = supabase
            .from('equipment')
            .select('*, properties(name)')
            .order('created_at', { ascending: false });
        
        if (propertyId) {
            query = query.eq('property_id', propertyId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar equipamentos:', error);
        showNotification('Erro ao carregar equipamentos', 'error');
        return [];
    }
}

export async function getEquipmentById(id) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        return null;
    }
    try {
        const { data, error } = await supabase
            .from('equipment')
            .select('*, properties(*)')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar equipamento:', error);
        showNotification('Erro ao carregar equipamento', 'error');
        return null;
    }
}

export async function createEquipment(equipment) {
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

        const equipmentData = {
            ...equipment,
            owner_id: user.id
        };

        const { data, error } = await supabase
            .from('equipment')
            .insert([equipmentData])
            .select()
            .single();
        
        if (error) throw error;
        showNotification('Equipamento cadastrado com sucesso!', 'success');
        return data;
    } catch (error) {
        console.error('Erro ao criar equipamento:', error);
        showNotification(error.message || 'Erro ao cadastrar equipamento', 'error');
        throw error;
    }
}

export async function updateEquipment(id, updates) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        const { data, error } = await supabase
            .from('equipment')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        showNotification('Equipamento atualizado com sucesso!', 'success');
        return data;
    } catch (error) {
        console.error('Erro ao atualizar equipamento:', error);
        showNotification(error.message || 'Erro ao atualizar equipamento', 'error');
        throw error;
    }
}

export async function deleteEquipment(id) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        const { error } = await supabase
            .from('equipment')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        showNotification('Equipamento excluído com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao excluir equipamento:', error);
        showNotification(error.message || 'Erro ao excluir equipamento', 'error');
        throw error;
    }
}
