type DeviceCodeInit = {
    user_code: string;
    device_code: string;
    verification_uri: string;
    expires_in: number;
    interval: number;
    message: string;
};

type DeviceCodeToken = {
    type: 'token';
    token_type: string;
    scope: string;
    expires_in: number;
    access_token: string;
    refresh_token?: string;
    id_token?: string;
}

type DeviceCodeError = {
    type: 'error';
    error: string;
    error_description: string;
    error_codes: string[];
    timestamp: string;
    trace_id: string;
    correlation_id: string;
    error_uri: string;
}

export type DeviceCodeResponse = DeviceCodeInit | DeviceCodeToken | DeviceCodeError;

export interface DeviceCodeTokenDetail {
    access_token: string;
    expires_at: string;
    refresh_token?: string;
};

export function isDeviceCodeInit(res: DeviceCodeResponse): res is DeviceCodeInit {
    return 'device_code' in res;
};

export function isDeviceCodeToken(res: DeviceCodeResponse): res is DeviceCodeToken {
    return 'access_token' in res;
};

export function isDeviceCodeError(res: DeviceCodeResponse): res is DeviceCodeError {
    return 'error' in res;
};