import { logger, WinstonAdaptor } from './winstonAdaptor';

const env = process.env.ENV || 'DEV';

class LoggerWrapper {
    logger: WinstonAdaptor

    constructor (logger: WinstonAdaptor) {
        this.logger = logger;
    }

    /**
     * Wrapper for info logs
     * @params {string} logMessage
     * @params {object} obj
     */
    info(logMessage: string, obj = {}) {
        const logObj = {
            env: env,
            level: 'info',
            message: logMessage,
            details: obj,
            timestamp: new Date().toISOString()
        };
        this.logger.log('info', logObj);
    }

    /**
     * Wrapper for error logs
     * @params {string} logMessage
     * @params {object} obj
     */
     error(logMessage: string, obj = {}) {
        const errorObj = (obj instanceof Error) ? { errorMessage: obj.message, errorStack: obj.stack } : obj;
        const logObj = {
            env: env,
            level: 'error',
            message: logMessage,
            details: errorObj,
            timestamp: new Date().toISOString()
        };
        this.logger.log('error', logObj);
    }

    /**
     * Wrapper for warning logs
     * @params {string} logMessage
     * @params {object} obj
     */
     warn(logMessage: string, obj = {}) {
        const logObj = {
            env: env,
            level: 'warn',
            message: logMessage,
            details: obj,
            timestamp: new Date().toISOString()
        };
        this.logger.log('warn', logObj);
    }
}

const loggerWrapper = new LoggerWrapper(logger);
export { loggerWrapper as logger, LoggerWrapper };