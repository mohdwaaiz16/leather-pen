const { supabase } = require('../config/supabase');

async function getDevices(organizationId) {
    const { data, error } = await supabase
        .from('devices')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

module.exports = { getDevices };
