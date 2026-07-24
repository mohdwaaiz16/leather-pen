const express = require('express');
const router = express.Router();
const deviceService = require('../services/device.service');
const scanService = require('../services/scan.service');
const { authenticateDevice } = require('../middleware/deviceAuth.middleware');
const { authenticateUser } = require('../middleware/auth.middleware');

// UI Listing
router.get('/', authenticateUser, async (req, res, next) => {
    try {
        const devices = await deviceService.getDevices(req.user.organization_id);
        res.json({ success: true, data: devices });
    } catch (error) {
        next(error);
    }
});

// Device API Ingestion
router.post('/scans', authenticateDevice, async (req, res, next) => {
    try {
        const { scan_type, article_id, master_swatch_id, batch_id, spectral, sensor_temperature, firmware_version, captured_at } = req.body;
        
        if (!['MASTER', 'PRODUCTION', 'CALIBRATION'].includes(scan_type)) {
            return res.status(400).json({ success: false, error: { code: 'INVALID_SCAN_PAYLOAD', message: 'Invalid scan type' } });
        }
        if (!article_id) {
            return res.status(400).json({ success: false, error: { code: 'INVALID_SCAN_PAYLOAD', message: 'Missing article_id' } });
        }
        if (scan_type === 'MASTER' && !master_swatch_id) {
            return res.status(400).json({ success: false, error: { code: 'INVALID_SCAN_PAYLOAD', message: 'MASTER scan requires master_swatch_id' } });
        }
        if (scan_type === 'PRODUCTION' && !batch_id) {
            return res.status(400).json({ success: false, error: { code: 'INVALID_SCAN_PAYLOAD', message: 'PRODUCTION scan requires batch_id' } });
        }
        if (!spectral) {
            return res.status(400).json({ success: false, error: { code: 'INVALID_SCAN_PAYLOAD', message: 'Missing spectral data' } });
        }
        if (!captured_at) {
             return res.status(400).json({ success: false, error: { code: 'INVALID_SCAN_PAYLOAD', message: 'Missing captured_at timestamp' } });
        }

        const scanData = {
            scan_type,
            article_id,
            master_swatch_id,
            batch_id,
            raw_spectral_data: spectral,
            sensor_temperature,
            firmware_version,
            captured_at
        };

        const scan = await scanService.createScan(req.device.id, scanData);
        
        res.status(201).json({ 
            success: true, 
            data: {
                scan_id: scan.id,
                status: 'RECEIVED',
                processing_status: 'RECEIVED'
            } 
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
