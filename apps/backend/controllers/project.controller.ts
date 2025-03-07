import Project from "@repo/db/models/Project.model";
import { Request, Response } from "express";
import { AITemplateSession } from "../config";

export const createProject = async (req: Request, res: Response) => {
    const { initPrompt } = req.body;
    const template = await fetch("http://localhost:9090/api/v1/project/template", { method: "POST" , headers: { "Content-Type": "application/json" }, body: JSON.stringify({ initPrompt }) });
    const response = await template.json() as { type: "web" | "app", description: string };
    
    const project = await Project.create({type: response.type, description: response.description});
    res.status(200).json({ projectId: project._id });
}

export const getTemplate = async (req: Request, res: Response) => {
    const { initPrompt } = req.body;
    const template = await AITemplateSession.sendMessage(initPrompt);
    const templateJson = JSON.parse(template.response.text().split("```json")[1].split("```")[0]);
    res.status(200).json(templateJson);
}