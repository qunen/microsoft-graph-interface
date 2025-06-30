import { logger } from '@utils/logger';
import { microsoftGraphAuthHandler } from '@utils/microsoftGraphHandler';
import errorMap, { defaultError, type ErrorObject } from 'constant/error';
import type { Request, Response } from 'express';

const authorizationController = {
    initializeDeviceCode: async (_req: Request, res: Response) => {
        try {
            const deviceCode = await microsoftGraphAuthHandler.initializeDeviceCodeFlow();
            res.status(200).send(deviceCode);
        }
        catch (err) {
            logger.error('Failed to initialize device code flow', { error: err });
            const errorKey = String(err);
            const { code , error }: ErrorObject = errorMap[errorKey] || defaultError;
            res.status(code).send(error);
        }
    },

    verifyDeviceCodeValidation: async (req: Request, res: Response) => {
        const device_code = req.body.device_code;

        try {
            const accessToken = await microsoftGraphAuthHandler.verifyDeviceCodeFlow(device_code);
            res.status(200).send(accessToken);
        }
        catch (err) {
            logger.error('Failed to verify device code', { error: err });
            const errorKey = String(err);
            const { code , error }: ErrorObject = errorMap[errorKey] || defaultError;
            res.status(code).send(error);
        }
    },

    refreshDeviceCodeAccessToken: async (req: Request, res: Response) => {
        const refresh_token = req.body.refresh_token;

        try {
            const accessToken = await microsoftGraphAuthHandler.refreshAccessToken(refresh_token);
            res.status(200).send(accessToken);
        }
        catch (err) {
            logger.error('Failed to refresh access token', { error: err });
            const errorKey = String(err);
            const { code , error }: ErrorObject = errorMap[errorKey] || defaultError;
            res.status(code).send(error);
        }
    }
};

export default authorizationController;