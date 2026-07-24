const express = require('express');
const router = express.Router();
const swatchService = require('../services/swatch.service');
const { authenticateUser } = require('../middleware/auth.middleware');

router.use(authenticateUser);

router.get('/article/:articleId', async (req, res, next) => {
    try {
        const swatches = await swatchService.getMasterSwatchesByArticle(req.user.organization_id, req.params.articleId);
        res.json({ success: true, data: swatches });
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const swatch = await swatchService.createMasterSwatch(req.user.organization_id, req.body, req.user.id);
        res.status(201).json({ success: true, data: swatch });
    } catch (error) {
        next(error);
    }
});
module.exports = router;
