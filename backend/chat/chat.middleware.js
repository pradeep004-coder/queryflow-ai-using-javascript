import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { askAiAuthSchema, askAiGuestSchema, editChatSchema } from './chat.schema.js';
dotenv.config();

export const getChatsMiddleware = (req, res, next) => {
    try {
        const offset = req.params.offset;
        if (isNaN(offset)) return res.status(400).json({ success: false, message: 'Offset should be a number' });

        const authHeader = req.headers?.authorization;
        if (!authHeader?.startsWith("Bearer ")) throw new Error("Token not provide");

        const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
        if (!token?.length) throw new Error("Could not get token");

        const decoded = jwt.verify(token, process.env.JWT_Secret);
        req.user = decoded;
    } catch (error) {
        console.error("Error at Get Chats middleware: ", error);
        return res.status(401).json({ success: false, message: 'Could not get user info', error });
    }
    next();
}

export const askAIMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers?.authorization;
        if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader?.split(" ")[1];
            if (token?.length) {
                console.log("token found: ", token);
                try {
                    const decodedToken = jwt.verify(token, process.env.JWT_Secret);
                    req.user = decodedToken;                    
                } catch (error) {
                    console.warn("Invalid token ignored");
                }
            }
        }

        let validationError;
        if(req.user) {
            validationError = askAiAuthSchema.validate(req.body).error;
        } else {
            validationError = askAiGuestSchema.validate(req.body).error;
        }

        if (validationError) {
            console.error("Error in Validation: ", validationError);
            return res.status(400).json({ message: 'Incorrect request!!', success: false, validationError });
        }

        next();
    } catch (error) {
        console.error("Error at Ask AI middleware: ", error);
        return res.status(500).json({ message: 'Internal server error', success: false, error });
    }

}

export const editChatMiddleware = (req, res, next) => {
    try {
        try {
            const authHeader = req.headers?.authorization;
            if (!authHeader?.startsWith("Bearer ")) throw new Error("Token is missing or expired");

            const token = authHeader.split(" ")[1];
            console.log("token found: ", token);

            if (!token?.length) throw new Error("Token is missing or expired");

            const decodedToken = jwt.verify(token, process.env.JWT_Secret);
            req.user = decodedToken;
        } catch (error) {
            console.log("Token error: ", error);
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }

        const { error } = editChatSchema.validate(req.body);
        if (error) {
            console.error("Error: ", error);
            return res.status(400).json({ message: 'Incorrect request!!', success: false, error });
        }
        console.log("Done validation.");

        next();

    } catch (error) {
        console.error("Error at Edit Chat middleware: ", error);
        return res.status(500).json({ message: 'Internal server error', success: false, error });
    }

}
