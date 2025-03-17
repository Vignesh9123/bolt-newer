import { Request, Response } from "express";
import {User} from "@repo/db/models/User.model";
import jwt from "jsonwebtoken";
import { app } from "../config/firebaseAdmin";
import { config } from "../config";
import { AuthenticatedRequest } from "..";

export const auth =async (req: AuthenticatedRequest, res: Response) => {
    // TODO: Get idToken from req.body and use it to verify the user
    try {
        const {idToken}:{idToken: string} = req.body;
        if(!idToken){
            res.status(400).json({error: 'No idToken provided'});
            return
        }
        const decodedToken = await app.auth().verifyIdToken(idToken);
        const {email, name} = decodedToken; 
        const user = await User.findOne({email});
        if(user){
            const token = jwt.sign({id: user._id}, config.JWT_SECRET, {expiresIn: '1d'});
            res.status(200).json({token});
            return
        }
        const newUser = await User.create(
            //Data from payload
            {
                email,
                name
            }
        );
        const token = jwt.sign({id: newUser._id}, config.JWT_SECRET, {expiresIn: '1d'});
        res
        .cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000
        })
        .status(200)
        .json({token});
        return
    } catch (error: any) {
        res.status(400).json({error: error.message || 'Something went wrong'});
        console.error('Failed to authenticate user: ',error);
    }
};

export const logout = (req: AuthenticatedRequest, res: Response) => {
    try {
        res
        .clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 0
        })
        .status(200)
        .json({message: 'Logged out'});
    } catch (error : any) {
        res.status(400).json({error: error.message || 'Something went wrong'});
        console.error('Failed to logout user: ',error);
    }
}

export const currentUser = async(req: AuthenticatedRequest, res: Response) => {
   try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if(!user){
        res.status(404).json({error: 'User not found'});
        return
    }
    res.status(200).json(user);
   } catch (error : any) {
    res.status(400).json({error: error.message || 'Something went wrong'});
    console.error('Failed to get current user: ',error);
   }
}