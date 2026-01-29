// CRUD de Produtos (Insumos)
import { getSupabaseClient } from './config.js';
import { showNotification } from './ui.js';

export async function getProducts() {
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

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        showNotification('Erro ao carregar produtos', 'error');
        return [];
    }
}

export async function getProductById(id) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        return null;
    }
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        showNotification('Erro ao carregar produto', 'error');
        return null;
    }
}

export async function createProduct(product) {
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

        const productData = {
            ...product,
            owner_id: user.id
        };

        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select()
            .single();
        
        if (error) throw error;
        showNotification('Produto criado com sucesso!', 'success');
        return data;
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        showNotification(error.message || 'Erro ao criar produto', 'error');
        throw error;
    }
}

export async function updateProduct(id, updates) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        showNotification('Produto atualizado com sucesso!', 'success');
        return data;
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        showNotification(error.message || 'Erro ao atualizar produto', 'error');
        throw error;
    }
}

export async function deleteProduct(id) {
    const supabase = getSupabaseClient();
    if (!supabase) {
        console.error('Supabase não está inicializado');
        throw new Error('Supabase não está inicializado');
    }
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        showNotification('Produto excluído com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        showNotification(error.message || 'Erro ao excluir produto', 'error');
        throw error;
    }
}
