import { isDeviceCodeError, isDeviceCodeInit, isDeviceCodeToken, type DeviceCodeResponse, type DeviceCodeTokenDetail } from '@interfaces/microsoftGraphDeviceCode';

const client_id = process.env.CLIENT_ID || '';
const tenant = process.env.TENANT || '';
const scope = process.env.SCOPE || '';

const oauth2Host = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0`;
const microsoftGraphHost = 'https://graph.microsoft.com/v1.0'

const microsoftGraphWrapper = {
    initDeviceCodeFlow: async () => {
        const reqBody = {
            scope: scope,
            client_id: client_id
        };
        const response = await fetch(
            `${oauth2Host}/devicecode`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(reqBody).toString()
            }
        );

        const responseBody = await response.json() as DeviceCodeResponse;
        if (isDeviceCodeInit(responseBody)) {
            return {
                user_code: responseBody.user_code,
                device_code: responseBody.device_code,
                verification_uri: responseBody.verification_uri,
                expires_at: (new Date(Date.now() + 1000 * responseBody.expires_in)).toISOString()
            }
        }
        else throw 'DEVICE_CODE_INIT_ERR';
    },

    verifyDeviceCodeUserAuth: async (device_code: string) => {
        const reqBody = {
            code: device_code,
            client_id: client_id,
            scope: scope,
            grant_type: 'device_code',
            tenant: tenant
        };
        const response = await fetch(
            `${oauth2Host}/token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(reqBody).toString()
            }
        );

        const responseBody = await response.json() as DeviceCodeResponse;
        if (isDeviceCodeToken(responseBody)) {
            const tokenDetails: DeviceCodeTokenDetail = {
                access_token: `${responseBody.token_type} ${responseBody.access_token}`,
                expires_at: (new Date(Date.now() + 1000 * responseBody.expires_in)).toISOString()
            };
            if (responseBody.refresh_token) tokenDetails.refresh_token = responseBody.refresh_token;
            
            return tokenDetails;
        }
        else if (isDeviceCodeError(responseBody)) {
            throw responseBody.error.toUpperCase();
        }
        else throw 'Failed to verify device code';
    },

    refreshDeviceCodeAccessToken: async (refresh_token: string) => {
        const reqBody = {
            refresh_token: refresh_token,
            client_id: client_id,
            scope: scope,
            grant_type: 'refresh_token',
            tenant: tenant
        };
        const response = await fetch(
            `${oauth2Host}/token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(reqBody).toString()
            }
        );

        const responseBody = await response.json() as DeviceCodeResponse;
        if (isDeviceCodeToken(responseBody)) {
            const tokenDetails: DeviceCodeTokenDetail = {
                access_token: `${responseBody.token_type} ${responseBody.access_token}`,
                expires_at: (new Date(Date.now() + 1000 * responseBody.expires_in)).toISOString()
            };
            if (responseBody.refresh_token) tokenDetails.refresh_token = responseBody.refresh_token;
            
            return tokenDetails;
        }
        else if (isDeviceCodeError(responseBody)) {
            throw responseBody.error.toUpperCase();
        }
        else throw 'Failed to refresh access token';
    },

    callGraphEndpoint: async (access_token: string, method: string, endpoint: string, stringifyBody?: string) => {
        const options: RequestInit = {
            method: method,
            headers: {
                'Authorization': access_token,
                'Content-Type': 'application/json'
            }
        }
        if (!stringifyBody) options.body = stringifyBody;

        const response = await fetch(`${microsoftGraphHost}/${endpoint}`, options);
        return response;
    }
};

export default microsoftGraphWrapper;