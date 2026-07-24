const { supabase } = require('../config/supabase');

async function authenticateDevice(req, res, next) {
    const deviceId = req.headers['x-device-id'];
    const deviceKey = req.headers['x-device-key'];

    if (!deviceId || !deviceKey) {
        return res.status(401).json({ 
            success: false, 
            error: { code: 'MISSING_DEVICE_CREDENTIALS', message: 'Device credentials missing' } 
        });
    }

    try {
        const { data: credentials, error } = await supabase
            .from('device_credentials')
            .select('secret_hash, device_id')
            .eq('device_id', deviceId)
            .is('revoked_at', null)
            .single();

        if (error || !credentials) {
            return res.status(401).json({ 
                success: false, 
                error: { code: 'INVALID_DEVICE', message: 'Invalid device or credentials' } 
            });
        }

        // In production: bcrypt.compare(deviceKey, credentials.secret_hash)
        // For prototype: we check simple match
        if (deviceKey !== credentials.secret_hash) {
            return res.status(401).json({ 
                success: false, 
                error: { code: 'INVALID_DEVICE_KEY', message: 'Invalid device key' } 
            });
        }

        req.device = {
            id: credentials.device_id
        };
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = { authenticateDevice };
