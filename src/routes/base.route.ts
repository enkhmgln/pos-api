import { authController, fileController, userController } from "@/controllers";
import { Hono } from "hono";

const router = new Hono();

router.route("/users", userController);
router.route("/auth", authController);
router.route("/files", fileController);
export default router;
