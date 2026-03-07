import { Hono } from "hono";
import userRoutes from "./user.routes";

const router = new Hono();

router.route("/users", userRoutes);

export default router;
