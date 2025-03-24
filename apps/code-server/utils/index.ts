import mongoose from "mongoose";
import ActionModel from "../models/Action.model";
import ChatBlockModel from "../models/ChatBlock.model";
export const saveAction = async (desc: string, projectId: string, chatBlockId: string) => {
    const chatBlock = await ChatBlockModel.findById(chatBlockId)
    if (!chatBlock) {
        throw new Error("ChatBlock not found");
    }
    if(chatBlock.projectId.toString() !== projectId) {
        throw new Error("ChatBlock does not belong to this project");
    }
    const action = await ActionModel.create({
        desc,
        chatBlockId
    }) 
    chatBlock.actions.push(action._id as mongoose.Types.ObjectId);
    await chatBlock.save();
    return action
}