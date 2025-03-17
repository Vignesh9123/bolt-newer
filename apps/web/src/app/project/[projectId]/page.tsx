'use client'
import Header from "@/components/Header";
import {Input} from "@/components/ui/input";
import { api } from "@/config";
import {motion} from "framer-motion";
import React, {Usable, useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import {PanelGroup, Panel, PanelResizeHandle} from "react-resizable-panels";
function page({params}:{params:Usable<{projectId: string}>}) {
    const {projectId} = React.use(params)
    const router = useRouter()
    const [codeServerUrl, setCodeServerUrl] = useState<string>("http://localhost:9091")
    const [promptInput, setPromptInput] = useState<string>("")
    const fetchProject = async (initial?: boolean) => {
        try {
            const response = await api.get(`/project/${projectId}?initial=${initial}`)
            console.log(response.data);
            const {chats, description, type, codeServer} = response.data;
            if(initial){
                // setCodeServerUrl(codeServer)
            }

        } catch (error) {
            console.log(error);
        }
    }

    const onSendClick = async()=>{
        console.log("Hello")
        try {
            const response = await api.post(`${codeServerUrl}/prompt`, {projectId, prompt: promptInput})
            const {project, content} = response.data.data;
            console.log({project, content});
        } catch (error) {
            alert("Error")
            console.log(error);   
        }

    }
    useEffect(() => {
        if(!projectId){
            router.push("/")
        }
        fetchProject(codeServerUrl ? false : true)
    },[])
  return (
    <div className='p-4 h-screen relative'>
        <Header/>
        <motion.div
        initial={{ y: -10, scale: 0.95, width:"50%" }}
        animate={{ y: 10, scale: 1, width:"100%" }}
        transition={{ duration: 0.5, ease:"easeOut"}}
        className="gap-2 items-center mx-auto"
        >
        <PanelGroup autoSaveId={"persistence"} direction="horizontal">
            <Panel minSize={20}>
        <div className="relative h-[90vh] bg-muted">
            <div className="absolute bottom-2 w-full flex">

            <Input value={promptInput} onChange={(e)=>setPromptInput(e.target.value)} className="bg-white dark:bg-black m-2" placeholder="Enter your prompt"/>
            <Button onClick={onSendClick} className="bg-white dark:bg-black m-2 cursor-pointer">
                <Send  className="text-black dark:text-white"/>
            </Button>
            </div>
        </div>
            </Panel>
            <PanelResizeHandle />
            <Panel minSize={30}>
        <div className=" h-[90vh] bg-muted">
            <iframe src="http://localhost:8080" width={"100%"} height={"100%"} allow="clipboard-read; clipboard-write"/>
        </div>
            </Panel>
        </PanelGroup>
        </motion.div>
      
    </div>
  )
}

export default page
