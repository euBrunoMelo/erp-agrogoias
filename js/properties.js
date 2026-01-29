// CRUD de Propriedades
import { getSupabaseClient } from './config.js';
import { showNotification } from './ui.js';

export async function getProperties() {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        return [];
    }
    try {
        const { data, error } = await supabase
            .from('properties')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar propriedades:', error);
        showNotification('Erro ao carregar propriedades', 'error');
        return [];
    }
}

export async function getPropertyById(id) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        return null;
    }
    try {
        const { data, error } = await supabase
            .from('properties')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar propriedade:', error);
        showNotification('Erro ao carregar propriedade', 'error');
        return null;
    }
}

export async function createProperty(property) {
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

        const propertyData = {
            ...property,
            owner_id: user.id
        };

        const { data, error } = await supabase
            .from('properties')
            .insert([propertyData])
            .select()
            .single();
        
        if (error) throw error;
        showNotification('Propriedade criada com sucesso!', 'success');
        return data;
    } catch (error) {
        console.error('Erro ao criar propriedade:', error);
        showNotification(error.message || 'Erro ao criar propriedade', 'error');
        throw error;
    }
}

export async function updateProperty(id, updates) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        const { data, error } = await supabase
            .from('properties')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        showNotification('Propriedade atualizada com sucesso!', 'success');
        return data;
    } catch (error) {
        console.error('Erro ao atualizar propriedade:', error);
        showNotification(error.message || 'Erro ao atualizar propriedade', 'error');
        throw error;
    }
}

export async function deleteProperty(id) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        const { error } = await supabase
            .from('properties')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        showNotification('Propriedade excluída com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao excluir propriedade:', error);
        showNotification(error.message || 'Erro ao excluir propriedade', 'error');
        throw error;
    }
}
