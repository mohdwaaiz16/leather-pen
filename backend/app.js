const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet({
    contentSecurityPolicy: false // Disabled for simplicity in dev/simulator, configure properly for prod
}));
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/articles', require('./routes/articles.routes'));
app.use('/api/v1/master-swatches', require('./routes/swatches.routes'));
app.use('/api/v1/batches', require('./routes/batches.routes'));
app.use('/api/v1/scans', require('./routes/scans.routes'));
app.use('/api/v1/device', require('./routes/devices.routes'));

// Global Error Handler
app.use(require('./middleware/error.middleware'));

module.exports = app;
