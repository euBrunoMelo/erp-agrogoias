// CRUD de Estoque
import { getSupabaseClient } from './config.js';
import { showNotification } from './ui.js';

export async function getStock(propertyId = null) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        return [];
    }
    try {
        // Obter usuário atual
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error('Usuário não autenticado');
        }

        let query = supabase
            .from('stock')
            .select('*, products(name, type, unit), properties(name)')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false });
        
        if (propertyId) {
            query = query.eq('property_id', propertyId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar estoque:', error);
        showNotification('Erro ao carregar estoque', 'error');
        return [];
    }
}

export async function getStockById(id) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        return null;
    }
    try {
        const { data, error } = await supabase
            .from('stock')
            .select('*, products(*), properties(*)')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar estoque:', error);
        showNotification('Erro ao carregar estoque', 'error');
        return null;
    }
}

export async function createStock(stock) {
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

        const stockData = {
            ...stock,
            owner_id: user.id
        };

        const { data, error } = await supabase
            .from('stock')
            .insert([stockData])
            .select()
            .single();
        
        if (error) throw error;
        showNotification('Estoque criado com sucesso!', 'success');
        return data;
    } catch (error) {
        console.error('Erro ao criar estoque:', error);
        showNotification(error.message || 'Erro ao criar estoque', 'error');
        throw error;
    }
}

export async function updateStock(id, updates) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        const { data, error } = await supabase
            .from('stock')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        showNotification('Estoque atualizado com sucesso!', 'success');
        return data;
    } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
        showNotification(error.message || 'Erro ao atualizar estoque', 'error');
        throw error;
    }
}

export async function deleteStock(id) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        const { error } = await supabase
            .from('stock')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        showNotification('Estoque excluído com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao excluir estoque:', error);
        showNotification(error.message || 'Erro ao excluir estoque', 'error');
        throw error;
    }
}

export async function getLowStock(propertyId = null) {
    const stock = await getStock(propertyId);
    return stock.filter(item => {
        if (!item.min_stock || item.min_stock === 0) return false;
        return parseFloat(item.quantity) <= parseFloat(item.min_stock);
    });
}
