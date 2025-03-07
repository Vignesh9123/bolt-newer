import mongoose from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IProject extends Document {
    description: string;
    type: 'web' | 'app';
    chats: {
        from: 'user' | 'assistant';
        content: {
        type: 'action' | 'text';
        content: string;
        };
    }[];
    userId: mongoose.Types.ObjectId;
    s3Storage: {
        key: string;
        url: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
    }
    