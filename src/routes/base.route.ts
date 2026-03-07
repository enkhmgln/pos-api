import { authController, userController } from "@/controllers";
import { Hono } from "hono";

const router = new Hono();

router.route("/users", userController);
router.route("/auth", authController);
export default router;
