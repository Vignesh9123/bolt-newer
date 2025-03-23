import mongoose, { model, Schema } from "mongoose";
import { IAction } from "@repo/types";
import { CommandStatus } from "@repo/types";

/*
chatBlockId,
desc,
createdAt,
status
*/
const ActionSchema = new Schema({
    chatBlockId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref:'ChatBlock', 
        required: true 
    },
    desc: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        enum: CommandStatus,
        default: 'PENDING' 
    }
}, {timestamps: true})

export default model<IAction>('Action', ActionSchema)
