const express = require('express');
const winston = require('winston');
const app = express();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(), 
        new winston.transports.File({ filename: 'app.log' })  // Loggs will be go in this filess
    ]
});

// Middleware for the logging each req
function requestLogger(req, res, next) {
    logger.info(`HTTP ${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
}

function errorHandler(err, req, res, next) {
    logger.error(`Error occurred: ${err.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
}

app.use(requestLogger);

app.get('/public', (req, res) => {
    res.send('This is a public route');
});

app.get('/error', (req, res) => {
    throw new Error('This is a test error!');
});

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
