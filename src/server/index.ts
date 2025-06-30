import cors from 'cors';
import express, { type Express } from 'express';
import expressWinston from 'express-winston';
import helemt from 'helmet';
import morgan from 'morgan';
import winston from 'winston';
import setRequestId from '@middlewares/requestId';
import { v1Routes } from './routes/v1';

// Initialize app
const app: Express = express();

// Setup app
app.use(setRequestId);
app.use(helemt());
app.use(express.json());
app.use(cors());

// Setup logging
morgan.token('id', (_req, res): string => {
    const id = res.getHeader('X-Request-Id');
    if (typeof id === 'string') return id;
    else return '';
});
app.use(morgan('[:date[iso]] :id Started :method :url for :remote-addr', { immediate: true }));
app.use(morgan('[:date[iso]] :id Completed :method :url :status - :response-time ms', {
    skip: (_req, res) => res.statusCode >= 400
}));
app.use(morgan('[:date[iso]] :id Failed :method :url :status - :response-time ms', {
    skip: (_req, res) => res.statusCode < 400
}));
const apiLogPath: string = process.env.LOGPATH_REST || '';
if (apiLogPath) {
    app.use(expressWinston.logger({
        transports: [
            new winston.transports.File({ filename: apiLogPath })
        ],
        format: winston.format.combine(
            winston.format.label({
                label: process.env.ENV || 'DEV'
            }),
            winston.format.timestamp(),
            winston.format.json()
        )
    }));
}

// Setup routes
app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
});
app.use('/api/v1', v1Routes);
app.use((_req, res) => {
    res.status(404).send('Not Found');
});

export { app };