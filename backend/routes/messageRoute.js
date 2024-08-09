import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getMessage, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.post("/sendmessage/:id", isAuthenticated, sendMessage);
router.get("/getmessage/:id", isAuthenticated, getMessage);

export default router;