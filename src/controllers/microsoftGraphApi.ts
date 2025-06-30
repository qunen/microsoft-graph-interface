import dao from '@utils/dao/daoHandler';
import { logger } from '@utils/logger';
import { microsoftGraphApiHandler } from '@utils/microsoftGraphHandler';
import type { ErrorObject } from 'constant/error';
import errorMap, { defaultError } from 'constant/error';
import type { Request, Response } from 'express';

const microsoftGraphApiController = {
    getSecurityGroup: async (req: Request, res: Response) => {
        try {
            const authToken = req.headers['authorization'] as string;

            const email = await microsoftGraphApiHandler.getUserEmail(authToken);
            const securityGroups = await microsoftGraphApiHandler.getSecurityGroup(authToken);

            res.status(200).send(securityGroups);

            const records = {
                user: email,
                security_groups: securityGroups || [],
                updated_at: new Date().toISOString()
            };
            dao.mongoHandler.createOrUpdateSecurityGroup(records);
        }
        catch (err) {
            logger.error('Failed to retrieve security groups', { error: err });
            const errorKey = String(err);
            const { code , error }: ErrorObject = errorMap[errorKey] || defaultError;
            res.status(code).send(error);
        }
    }
};

export default microsoftGraphApiController;