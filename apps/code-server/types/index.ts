import mongoose, {Document} from "mongoose";

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
    chatBlocks: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IChatBlock extends Document {
    projectId: mongoose.Types.ObjectId;
    role: 'user' | 'assistant';
    actions: mongoose.Types.ObjectId[];
    prompt: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAction extends Document {
    chatBlockId: mongoose.Types.ObjectId;
    desc: string;
    createdAt: Date;
    status: CommandStatus;
}

export interface CommandItem {
    id: string;
    command: string;
    priority: number;
    timeout?: number;
    startTime?: number;
  }
  
export interface CommandResult {
    id: string;
    success: boolean;
    output: string;
    error?: string;
    exitCode?: number;
  }
  
export interface ProcessedCommand extends CommandItem, CommandResult {}
  
export interface GetCommandStatus extends ProcessedCommand{
      status: CommandStatus
  }
export enum CommandStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    COMPLETED = 'COMPLETED',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    NOT_FOUND = 'NOT_FOUND'
}