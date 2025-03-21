import {connectDB} from '@repo/db'
import express from 'express'
import { config, promptModel } from './config'
import { authMiddleware } from '@repo/config/middlewares/auth.middleware'
import Project from '@repo/db/models/Project.model'
import { IProject } from '@repo/types';
import { XMLParser } from './xmlParser'
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
        //One-shot response - Receive a single big response
        // const session = promptModel.startChat(
        //     {
        //         history
        //     }
        // )
        // const response = await session.sendMessage(prompt);
        
        //Stream response - Receive multiple small responses in a stream to form a big response at last
        const session = promptModel.startChat(
            {
                history
            }
        )
        const response = await session.sendMessageStream(prompt);
        let xmlWrappedContent = ''
        // const xmlWrappedContent = response.response.text()
        const xmlParserFunctions = {
            "file": (filePath: string, content: string) => {
                onFileCommand({
                    filePath,
                    content
                })
            },
            "shell": (content: string) => {
                onShellCommand(content);
            }
        }
        const parser = new XMLParser({onFileCommand: xmlParserFunctions.file, onShellCommand: xmlParserFunctions.shell});
        for await (const chunk of response.stream) {
            xmlWrappedContent += chunk.candidates?.[0].content.parts[0].text;
            
            const currentContent = chunk.candidates?.[0].content.parts[0].text || '';
            // console.log('currentContent', currentContent);
            let content = currentContent.split("```xml").length > 1 ? currentContent.split("```xml")[1].split("```")[0] : currentContent.split("```xml")[0].split("```")[0];
            if(content.trim() =="```" || content.trim() == "xml" || content.trim() == "") continue;
            if(content.trim().includes("xml")){
                content = content.split("xml")[1];
            }
            // console.log('content', content);
            // const jsonParsedData = parseXML(content);
            // jsonParsedData.actions.map((js:any) => {
            //     if(js.type == "file"){
            //         onFileCommand({
            //             filePath: js.attributes.filepath,
            //             content: js.content
            //         })
            //     }
            //     if(js.type == "shell"){
            //         onShellCommand(js.content)
            //     }
            //     console.log('jsonParsedData', jsonParsedData);
            // });
            parser.append(content);
            parser.parse();
        }
        // project.chats?.push({from: "user", content: {type: "text", content: prompt}});
        // project.chats?.push({from: "assistant", content: {type: "text", content: xmlWrappedContent}});
        
        console.log("All commands executed");
        console.log("Go to http://localhost:8081 to see the changes");
        await project.save();
        res.status(200).json({content: xmlWrappedContent.split("```xml")[1].split("```")[0], project});
    } catch (error:any){
        console.log(error)
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

