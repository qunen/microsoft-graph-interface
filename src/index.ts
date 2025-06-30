import type { Server } from 'http';
import { app } from './server/index';
import mongoConnector from '@utils/dao/mongo/mongodbConnector';

let server: Server;
mongoConnector.initMongoConnection()
    .then(() => {
        console.log('Successfully connected to mongodb');
        const port: string = process.env.PORT || '3000';
        server = app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to mongodb. Error: ', err);
    });

// Handler error and exception
const exitHandler = () => {
    mongoConnector.disconnectMongo();
    if (server) {
        server.close(() => {
            console.log('Server closed');
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
};
const exceptionErrorHandler = (err: Error) => {
    console.error('Unexpected error occured!', err);
    exitHandler()
}

process.on('uncaughtException', exceptionErrorHandler);
process.on('unhandledRejection', exceptionErrorHandler);
process.on('SIGTERM', () => {
    if (server) exitHandler();
});