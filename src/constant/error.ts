interface ErrorMap {
    [key: string]: ErrorObject
}

export interface ErrorObject {
    code: number,
    error: ErrorResponse
}

interface ErrorResponse {
    error_code: string
    error_message: string
}


const errorMap: ErrorMap = {
    'DEVICE_CODE_INIT_ERR': {
        code: 500,
        error: {
            error_code: 'DEVICE_CODE_INIT_ERR',
            error_message: 'Fail to initiate device code flow authentication.'
        }
    },

    'AUTHORIZATION_PENDING': {
        code: 400,
        error: {
            error_code: 'AUTHORIZATION_PENDING',
            error_message: 'Authorization has not been provided yet by user.'
        }
    },

    'AUTHORIZATION_DENIED': {
        code: 401,
        error: {
            error_code: 'AUTHORIZATION_DENIED',
            error_message: 'Authorization has been denied by user.'
        }
    },

    'BAD_VERIFICATION_CODE': {
        code: 400,
        error: {
            error_code: 'BAD_VERIFICATION_CODE',
            error_message: 'Device code is invalid.'
        }
    },

    'EXPIRED_TOKEN': {
        code: 401,
        error: {
            error_code: 'EXPIRED_TOKEN',
            error_message: 'Device code has expired. Please reinitiate the device code flow.'
        }
    },

    'INVALID_TOKEN': {
        code: 401,
        error: {
            error_code: 'INVALID_TOKEN',
            error_message: 'Access token is invalid or has expired.'
        }
    },

    'DB_WRITE_ERR': {
        code: 500,
        error: {
            error_code: 'DB_WRITE_ERR',
            error_message: 'Fail to update database.'
        }
    },

    'InvalidAuthenticationToken': {
        code: 401,
        error: {
            error_code: 'InvalidAuthenticationToken',
            error_message: 'Access token is invalid or has expired.'
        }
    },

    'unauthorized': {
        code: 403,
        error: {
            error_code: 'unauthorized',
            error_message: 'Access token does not has the required scope.'
        }
    }
};

export const defaultError = {
    code: 500,
    error: {
        error_code: 'SERVER_ERR',
        error_message: 'Server Error'
    }
}

export default errorMap;