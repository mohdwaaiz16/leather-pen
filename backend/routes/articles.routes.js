const express = require('express');
const router = express.Router();
const articleService = require('../services/article.service');
const { authenticateUser } = require('../middleware/auth.middleware');

router.use(authenticateUser);

router.get('/', async (req, res, next) => {
    try {
        const articles = await articleService.getArticles(req.user.organization_id);
        res.json({ success: true, data: articles });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const article = await articleService.getArticleById(req.user.organization_id, req.params.id);
        res.json({ success: true, data: article });
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const article = await articleService.createArticle(req.user.organization_id, req.body, req.user.id);
        res.status(201).json({ success: true, data: article });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
