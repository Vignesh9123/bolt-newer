import { Router } from "express";
import { auth, currentUser, logout } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = Router();


router.route("/auth").post(auth);
router.route("/logout").get(authMiddleware, logout);
router.route("/current").get(authMiddleware, currentUser);

export default router;
