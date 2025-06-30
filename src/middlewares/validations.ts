import { logger } from '@utils/logger';
import type { NextFunction, Request, Response } from 'express';

const validations = {
    authTokenVerifyValidation: (req: Request, res: Response, next: NextFunction) => {
        const device_code: string = req.body.device_code.trim();
    
        try {
            if (!device_code) throw 'device_code cannot be empty';
            next();
        }
        catch (err) {
            const error = {
                error_code: 'INVALID_PARAMS',
                error_meesage: err
            };
            logger.error('Failed authTokenVerifyValidation', error);
            res.status(400).send(error);
        }
    },

    authTokenRefreshValidation: (req: Request, res: Response, next: NextFunction) => {
        const refresh_token: string = req.body.refresh_token.trim();
    
        try {
            if (!refresh_token) throw 'refresh_token cannot be empty';
            next();
        }
        catch (err) {
            const error = {
                error_code: 'INVALID_PARAMS',
                error_meesage: err
            };
            logger.error('Failed authTokenRefreshValidation', error);
            res.status(400).send(error);
        }
    },

    graphGetSecurityGroupValidation: (req: Request, res: Response, next: NextFunction) => {
        const authToken = req.headers['authorization'] || '';
    
        try {
            if (!authToken) throw 'Authorization header is missing';
            next();
        }
        catch (err) {
            const error = {
                error_code: 'INVALID_PARAMS',
                error_meesage: err
            };
            logger.error('Failed graphGetSecurityGroupValidation', error);
            res.status(400).send(error);
        }
    }
};

export default validations;