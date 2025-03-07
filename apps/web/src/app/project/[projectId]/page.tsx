'use client'
import Header from "@/components/Header";
import {Input} from "@/components/ui/input";
import { api } from "@/config";
import {motion} from "framer-motion";
import React, {Usable, useEffect} from "react";
import { useRouter } from "next/navigation";
function page({params}:{params:Usable<{projectId: string}>}) {
    const {projectId} = React.use(params)
    const router = useRouter()
    const fetchProject = async () => {
        try {
            const response = await api.get(`/project/${projectId}`)
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if(!projectId){
            router.push("/")
        }
        fetchProject()
    },[])
  return (
    <div className='p-4 h-screen relative'>
        <Header/>
        <motion.div
        initial={{ y: -10, scale: 0.95, width:"50%" }}
        animate={{ y: 10, scale: 1, width:"100%" }}
        transition={{ duration: 0.5, ease:"easeOut"}}
        className="flex gap-2 items-center mx-auto"
        >
        <div className="w-1/2 h-screen bg-muted">
        
        </div>
        <div className="w-1/2 h-screen bg-muted">
        
        </div>
        </motion.div>
      
    </div>
  )
}

export default page
