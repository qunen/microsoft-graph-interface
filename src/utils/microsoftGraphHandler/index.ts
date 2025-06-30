import { isErrorResponse, isSecurityGroupsResponse, isUserEmailResponse, type MicrosoftGraphApiResponse } from '@interfaces/microsoftGraphApi';
import microsoftGraphWrapper from './microsoftGraphWrapper';
import { logger } from '@utils/logger';

const microsoftGraphAuthHandler = {
    initializeDeviceCodeFlow: async () => {
        try {
            const deviceCodeAuth = await microsoftGraphWrapper.initDeviceCodeFlow();
            return deviceCodeAuth;
        }
        catch (err) {
            logger.error('Fail to intiate device code flow', { error: err });
            throw err;
        }
    },

    verifyDeviceCodeFlow: async (device_code: string) => {
        try {
            const accessToken = await microsoftGraphWrapper.verifyDeviceCodeUserAuth(device_code);
            return accessToken;
        }
        catch (err) {
            logger.error('Fail to verify device code flow', { error: err });
            throw err;
        }
    },

    refreshAccessToken: async (refresh_token: string) => {
        try {
            const accessToken = await microsoftGraphWrapper.refreshDeviceCodeAccessToken(refresh_token);
            return accessToken;
        }
        catch (err) {
            logger.error('Fail to refresh access token', { error: err });
            throw err;
        }
    },
};

const microsoftGraphApiHandler = {
    getUserEmail: async (access_token: string) => {
        try {
            const method = 'GET';
            const endpoint = '/me?$select=userPrincipalName'

            const response = await microsoftGraphWrapper.callGraphEndpoint(access_token, method, endpoint);
            const responseBody = await response.json() as MicrosoftGraphApiResponse;
            if (isUserEmailResponse(responseBody)) {
                const email = responseBody.userPrincipalName;
                return email;
            }
            else if (isErrorResponse(responseBody)) {
                logger.error('Get user email request failed', { response: responseBody });
                throw responseBody.error.code;
            }
            else throw 'Fail to retrieve email';
        }
        catch (err) {
            logger.error('Fail get user email', { error: err });
            throw err;
        }
    },

    getSecurityGroup: async (access_token: string) => {
        try {
            const method = 'GET';
            const endpoint = '/groups?$filter=mailEnabled eq false&securityEnabled eq true'
            
            const response = await microsoftGraphWrapper.callGraphEndpoint(access_token, method, endpoint);
            const responseBody = await response.json() as MicrosoftGraphApiResponse;
            if (isSecurityGroupsResponse(responseBody)) {
                const securityGroups = responseBody.value;
                return securityGroups;
            }
            else if (isErrorResponse(responseBody)) {
                logger.error('Get security group request failed', { response: responseBody });
                throw responseBody.error.code;
            } else {
                throw `Failed to retrieve security group`;
            }
        }
        catch (err) {
            logger.error('Fail get security groups', { error: err });
            throw err;
        }
    }
};

export { microsoftGraphAuthHandler, microsoftGraphApiHandler };