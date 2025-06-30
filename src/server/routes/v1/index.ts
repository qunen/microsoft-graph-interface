import express, { Router } from 'express';
import authorizationController from '@controllers/authorization';
import microsoftGraphApiController from '@controllers/microsoftGraphApi';
import validations from '@middlewares/validations';

// Initialize /api/v1/* routes
const router: Router = express.Router();

// Authorization routes
router.post('/auth/token/devicecode', authorizationController.initializeDeviceCode);
router.post('/auth/token/verify', validations.authTokenVerifyValidation, authorizationController.verifyDeviceCodeValidation);
router.post('/auth/token/refresh', validations.authTokenRefreshValidation, authorizationController.refreshDeviceCodeAccessToken);

// Microsoft Graph Routes
router.get('/graph/securitygroup', validations.graphGetSecurityGroupValidation, microsoftGraphApiController.getSecurityGroup);

export { router as v1Routes };