const express = require('express');
const router = express.Router();

// Mock login for vertical slice
router.post('/login', (req, res) => {
    // Return the demo user profile
    res.json({
        success: true,
        data: {
            token: 'mock-jwt-token-123',
            user: {
                id: '22222222-2222-2222-2222-222222222222',
                organization_id: '11111111-1111-1111-1111-111111111111',
                full_name: 'Demo Operator',
                role: 'OPERATOR'
            }
        }
    });
});

module.exports = router;
