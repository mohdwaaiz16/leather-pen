const express = require('express');
const router = express.Router();
const scanService = require('../services/scan.service');
const { authenticateUser } = require('../middleware/auth.middleware');

router.use(authenticateUser);

router.get('/', async (req, res, next) => {
    try {
        const scans = await scanService.getScans(req.user.organization_id);
        res.json({ success: true, data: scans });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
