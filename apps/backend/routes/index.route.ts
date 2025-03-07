import { Router } from "express";

const router = Router();
import userRouter from "./user.route";
import projectRouter from "./project.route";

router.use("/user", userRouter);
router.use("/project", projectRouter);

export default router;