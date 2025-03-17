import {connectDB} from '@repo/db'
import express from 'express'
import { config, promptModel } from './config'
import { authMiddleware } from '@repo/config/middlewares/auth.middleware'
import Project from '@repo/db/models/Project.model'
import { IProject } from '@repo/types';
import {parseXML} from './xmlParser'
import { onFileCommand ,onShellCommand } from './os'
import cors from 'cors'
const app = express()

app.use(express.json());
app.use(cors({
    origin:"http://localhost:3000",
    credentials: true
}))

app.post('/prompt', async (req, res) => {
    try {
        const {projectId, prompt} = req.body;
        console.log('prompt', prompt);
        const project = await Project.findById(projectId) as IProject;
        const history = project.chats?.map((chat) => ({role: chat.from == "user" ? "user" : "model", parts: [{text: chat.content.content}]})) as any || [] ;
        const session = promptModel.startChat(
            {
                history
            }
        )
        const response = await session.sendMessage(prompt);
        const xmlWrappedContent = response.response.text()
        project.chats?.push({from: "user", content: {type: "text", content: prompt}});
        project.chats?.push({from: "assistant", content: {type: "text", content: xmlWrappedContent}});
        const content = response.response.text().split("```xml")[1].split("```")[0];
        console.log('content', content);
        const jsonParsedData = parseXML(content);
        jsonParsedData.actions.map((js:any) => {
            if(js.type == "file"){
                onFileCommand({
                    filePath: js.attributes.filepath,
                    content: js.content
                })
            }
            if(js.type == "shell"){
                onShellCommand(js.content)
            }
        });
        console.log('jsonParsedData', jsonParsedData);
        console.log("All commands executed");
        console.log("Go to http://localhost:8081 to see the changes");
        await project.save();
        res.status(200).json({content, project});
    } catch (error:any){
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

