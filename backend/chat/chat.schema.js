import joi from "joi";

export const askAiAuthSchema = joi.object({
    question: joi.string().required(),
    timestamp: joi.date().required()
});

export const askAiGuestSchema = joi.object({
    question: joi.string().required(),
    timestamp: joi.date().optional()
});

export const getChatsSchema = joi.object({
    chatLength: joi.number().required()
});

export const editChatSchema = joi.object({
    question: joi.string().required(),
    chatId: joi.string().required() 
});