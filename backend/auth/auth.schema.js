import joi from "joi";

const versionSchema = joi.object({
    question: joi.string().required(),
    answer: joi.string().required()
});

const chatSchema = joi.object({
    versions: joi.array().items(versionSchema).required(),
    timestamp: joi.date().required()
});

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(100).required(),
    availableChats: joi.array().items(chatSchema).max(5).optional()
});

export const signupSchema = joi.object({
    name: joi.string().min(5).max(100).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(100).required(),
    availableChats: joi.array().items(chatSchema).max(5).optional()
});