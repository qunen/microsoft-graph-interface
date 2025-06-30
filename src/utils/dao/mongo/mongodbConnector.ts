import mongoose from 'mongoose';
import { logger } from '@utils/logger';

const conStr = process.env.MONGODB_CONNECTION_STRING || '';

const mongoConnector = {
    initMongoConnection: async () => {
        await mongoose.connect(conStr);

        // Log Disconnect/Reconnect
        mongoose.connection.on('error', (err) => logger.error(err));
        mongoose.connection.on('disconnected', () => logger.warn('MongoDB connection is disconnected'));
        mongoose.connection.on('reconnected', () => logger.info('Reconnected to MongoDB'));
    },

    disconnectMongo: async () => {
        await mongoose.disconnect();
    }
};

export default mongoConnector;