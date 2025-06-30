import winston, { Logger } from 'winston';
import type { ConsoleTransportInstance, FileTransportInstance } from 'winston/lib/winston/transports';

const { combine, timestamp, label, json } = winston.format;
const logFile: string = process.env.LOGPATH_DEFAULT || '';
const env = process.env.ENV || 'DEV';

const transports: (ConsoleTransportInstance | FileTransportInstance)[] = [new winston.transports.Console()];
if (logFile) transports.push(new winston.transports.File({ filename: logFile }));

class WinstonAdaptor {
    winstonLogger: Logger;

    constructor () {
        this.winstonLogger = winston.createLogger({
            level: 'info',
            format: combine(
                label({ label: env }),
                timestamp(),
                json()
            ),
            transports: transports
        });
    }

    log(level: string, logObj: any) {
        this.winstonLogger.log(level, logObj);
    }
}

const logger = new WinstonAdaptor();
export { logger, WinstonAdaptor };