import mongoose from "mongoose";
import { IUser } from "../types";


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
},{timestamps: true});


export const User = mongoose.model<IUser>("User", UserSchema);
