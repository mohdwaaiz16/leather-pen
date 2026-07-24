const { supabase } = require('../config/supabase');

async function getMasterSwatchesByArticle(organizationId, articleId) {
    const { data, error } = await supabase
        .from('master_swatches')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('article_id', articleId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

async function createMasterSwatch(organizationId, swatchData, userId) {
    const { data, error } = await supabase
        .from('master_swatches')
        .insert([{
            organization_id: organizationId,
            created_by: userId,
            ...swatchData
        }])
        .select()
        .single();
    if (error) throw error;
    return data;
}
module.exports = { getMasterSwatchesByArticle, createMasterSwatch };
