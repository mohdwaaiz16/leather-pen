const { supabase } = require('../config/supabase');

async function getArticles(organizationId) {
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

async function getArticleById(organizationId, articleId) {
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('id', articleId)
        .single();
    if (error) throw error;
    return data;
}

async function createArticle(organizationId, articleData, userId) {
    const { data, error } = await supabase
        .from('articles')
        .insert([{
            organization_id: organizationId,
            created_by: userId,
            ...articleData
        }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

module.exports = {
    getArticles,
    getArticleById,
    createArticle
};
