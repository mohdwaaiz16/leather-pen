const { supabase } = require('../config/supabase');

async function getScans(organizationId) {
    const { data, error } = await supabase
        .from('scans')
        .select('*, articles(article_name), devices(name)')
        .eq('organization_id', organizationId)
        .order('captured_at', { ascending: false });
    if (error) throw error;
    return data;
}

async function createScan(deviceId, scanData) {
    const { data: device, error: deviceError } = await supabase
        .from('devices')
        .select('organization_id')
        .eq('id', deviceId)
        .single();
        
    if (deviceError || !device) {
        throw new Error('Device not found or not registered');
    }

    const { data, error } = await supabase
        .from('scans')
        .insert([{
            organization_id: device.organization_id,
            device_id: deviceId,
            ...scanData
        }])
        .select()
        .single();
        
    if (error) throw error;
    return data;
}

module.exports = { getScans, createScan };
