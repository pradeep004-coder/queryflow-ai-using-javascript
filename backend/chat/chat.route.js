import { Router } from "express";
import { askAIMiddleware, editChatMiddleware, getChatsMiddleware } from "./chat.middleware.js";
import {askAIController, editController, getChatsController} from "./chat.controller.js";

const chatRouter = Router();

chatRouter.post("/ai/ask", askAIMiddleware, askAIController);
chatRouter.patch("/edit", editChatMiddleware, editController);
chatRouter.get('/getchats/:offset', getChatsMiddleware, getChatsController);


export default chatRouter;  