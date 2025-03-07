import mongoose, {  Schema } from 'mongoose';
import {IProject} from '@repo/types';

const ProjectSchema: Schema = new Schema(
{
    description: {
    type: String,
    required: true,
    trim: true,
    },
    type: {
    type: String,
    enum: ['web', 'app'],
    required: true,
    },
    chats: [
    {
        from: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
        },
        content: {
        type: {
            type: String,
            enum: ['action', 'text'],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        },
    },
    ],
    userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    },
    s3Storage: [
    {
        key: {
        type: String,
        required: true,
        },
        url: {
        type: String,
        required: true,
        },
    },
    ],
},
{ timestamps: true }
);

export default mongoose.model<IProject>('Project', ProjectSchema);

