function authenticateUser(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader === 'Bearer mock-jwt-token-123') {
        req.user = {
            id: '22222222-2222-2222-2222-222222222222',
            organization_id: '11111111-1111-1111-1111-111111111111'
        };
        return next();
    }
    res.status(401).json({ 
        success: false, 
        error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } 
    });
}

module.exports = { authenticateUser };
