const { supabase } = require('../config/supabase');

async function getBatches(organizationId) {
    const { data, error } = await supabase
        .from('batches')
        .select('*, articles(article_name)')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

async function createBatch(organizationId, batchData, userId) {
    const { data, error } = await supabase
        .from('batches')
        .insert([{
            organization_id: organizationId,
            created_by: userId,
            ...batchData
        }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

module.exports = { getBatches, createBatch };
