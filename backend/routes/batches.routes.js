const express = require('express');
const router = express.Router();
const batchService = require('../services/batch.service');
const { authenticateUser } = require('../middleware/auth.middleware');

router.use(authenticateUser);

router.get('/', async (req, res, next) => {
    try {
        const batches = await batchService.getBatches(req.user.organization_id);
        res.json({ success: true, data: batches });
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const batch = await batchService.createBatch(req.user.organization_id, req.body, req.user.id);
        res.status(201).json({ success: true, data: batch });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
