import { logger } from "@utils/logger";
import { SecurityGroups } from "./mongo/models/schema";

const mongoHandler = {
    createOrUpdateSecurityGroup: async (security_groups: SecurityGroups) => {
        const options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        };
        const query = { user: security_groups.user };
        const update = {
            security_groups: security_groups.security_groups,
            updated_at: security_groups.updated_at
        }

        try {
            await SecurityGroups.findOneAndUpdate(query, update, options);
        }
        catch (err) {
            logger.error('Failed to update securitygroups collection', { error: err });
            throw 'DB_WRITE_ERR';
        }
    }
};

const dao = {
    mongoHandler
};
export default dao;