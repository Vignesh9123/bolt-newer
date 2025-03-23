import { IChatBlock } from "@repo/types";
import mongoose, { model, Schema } from "mongoose";
/*
Chat Block

projectId,
role: user/assistant,
actions(present only if role is of assistant),
createdAt(to sort the blocks)
*/
const ChatBlockSchema = new Schema({
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref:'Project', 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['user', 'assistant'],
        required: true 
    },
    actions:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Action'
        }
    ],
}, {timestamps: true})

export default model<IChatBlock>('ChatBlock', ChatBlockSchema)
