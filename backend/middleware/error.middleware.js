function errorHandler(err, req, res, next) {
    console.error(`[Error] ${err.message}`);
    if (err.stack) {
        console.error(err.stack);
    }
    
    const statusCode = err.statusCode || 500;
    const errorResponse = {
        success: false,
        error: {
            code: err.code || 'INTERNAL_SERVER_ERROR',
            message: statusCode === 500 ? 'Internal server error' : err.message,
            details: err.details || []
        }
    };
    
    res.status(statusCode).json(errorResponse);
}

module.exports = errorHandler;
