import mongoose from 'mongoose';

const securityGroupsSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
            unique: true
        },
        security_groups: [
            {
                type: Object
            }
        ],
        updated_at: {
            type: String,
            required: true
        }
    }
);

export type SecurityGroups = mongoose.InferSchemaType<typeof securityGroupsSchema>;
export const SecurityGroups = mongoose.model('SecurityGroups', securityGroupsSchema);