'use client'
import React, { useState } from 'react'
import Header from '@/components/Header'
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { api } from '@/config'
function page() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const placeholders = [
    "Create a todo react website",
    "Create a mobile app for chatting",
    "Create a blog site with nextjs",
    "Create a portfolio site",
  ];
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    console.log(e.target.value);
  };
  const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setLoading(true)
    const response = await api.post("/project/create", {initPrompt: inputValue})
    const projectId = response.data.projectId
    router.push(`/project/${projectId}`);
    setLoading(false)
    console.log("submitted");
  };
  return (
    <>
      <div className='p-4 h-screen relative overflow-hidden'>
        <Header/>
        <div className={`flex flex-col transition-all duration-700 ${submitted ? "" : "w-full h-full justify-center"} items-center`}>
          <h1 className={`text-xl my-5 font-mono transition-opacity duration-500 ${submitted ? "opacity-0" : "opacity-100"}`}>
            Transform your ideas into reality
          </h1>
          <AnimatePresence>
            <motion.div
              initial={{ y: 0, scale: 1, opacity: 1 }}
              animate={submitted ? { y: -120, scale: 0.95, transition: { duration: 0.6, ease: "easeInOut" } } : { y: 0, scale: 1 }}
              exit={{ y: -120, scale: 0.95, transition: { duration: 0.6, ease: "easeInOut" } }}
              className='transition-all duration-700'
            >
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onSubmit={onSubmit}
                onChange={handleChange}
                disabled={submitted}

              />
            </motion.div>
          </AnimatePresence>
        </div>
        {loading && (
          <div className="absolute top-0 w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
    </>
  )
}

export default page
