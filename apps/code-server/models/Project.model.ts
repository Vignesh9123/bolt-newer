import mongoose, { Schema } from 'mongoose';
import { IProject } from '../types';

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
            //required: true, //TODO: add this
        },
        s3Storage: 
            {
                key: {
                    type: String,
                },
                url: {
                    type: String,
                },
            },
        chatBlocks: [
            {
                type: Schema.Types.ObjectId,
                ref: 'ChatBlock'
            }
        ]
    },
    { timestamps: true }
);

export default mongoose.model<IProject>('Project', ProjectSchema);

