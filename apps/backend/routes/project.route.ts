import { Router } from "express";
import { createProject, getTemplate } from "../controllers/project.controller";

const router = Router();

router.route("/")
router.route("/create").post(createProject)
router.route("/template").post(getTemplate)

export default router;