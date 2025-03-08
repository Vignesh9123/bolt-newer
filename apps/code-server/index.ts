import {connectDB} from '@repo/db'
import express from 'express'
import { config, promptModel } from './config'
import { authMiddleware } from '@repo/config/middlewares/auth.middleware'
import Project from '@repo/db/models/Project.model'
import { IProject } from '@repo/types';
import {parseXML} from './xmlParser'

const app = express()

app.post('/prompt', authMiddleware, async (req, res) => {
    try {
        const {projectId, prompt} = req.body;
        const project = await Project.findById(projectId) as IProject;
        const history = project.chats?.map((chat) => ({role: chat.from == "user" ? "user" : "model", parts: [{text: chat.content}]})) as any || [] ;
        const session = promptModel.startChat(
            {
                history
            }
        )
        const response = await session.sendMessage(prompt);
        const content = response.response.text().split("```xml")[1].split("```")[0];
        console.log('content', content);
        const jsonParsedData = parseXML(content);
        console.log('jsonParsedData', jsonParsedData);
        res.status(200).json({content, project});
    } catch (error) {
        res.status(400).json({error: error.message || 'Something went wrong'}); 
    }
})


app.listen(config.PORT, async () => {
    try {
        await connectDB();
        console.log('Code Server API is running on port 9091');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
});

