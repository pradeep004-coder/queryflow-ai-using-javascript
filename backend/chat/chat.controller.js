
import chatModel from './chat.model.js';
import { generateAIResponse } from './chat.service.js';


export const getChatsController = async (req, res) => {
    try {
        const userId = req.user._id;
        const offset = req.params.offset;
        const chats = await chatModel.find({ userId }).sort({ timestamp: 1 }).skip(offset).limit(10);
        const availableChats = await chatModel.find({ userId }).countDocuments();
        const trimmedChats = chats.map(item => {
            return {
                chatId: item._id,
                versions: item.versions,
                timestamp: item.timestamp
            }
        });
        const canLoadMore = availableChats > offset + 10

        if (trimmedChats == []) {
            return res.status(404).json({ success: false, message: 'No more chats in db', chats: trimmedChats });
        }
        if (trimmedChats.length < 10) {
            return res.status(200).json({ success: true, message: 'Chat data fetched but no more to fetch', chats: trimmedChats, canLoadMore });
        }
        if (trimmedChats.length === 10) {
            return res.status(200).json({ success: true, message: 'Chat data fetched', chats: trimmedChats, canLoadMore });
        }

        return res.status(404).json({ success: false, message: 'Chats not found!! no chat data in db', canLoadMore});


    } catch (error) {
        console.error("Error at Get Chat Controller: ", error);
        return res.status(500).json({ success: false, message: 'internal server error', error });
    }
}

export const askAIController = async (req, res) => {
    try {
        const { question, timestamp } = req.body;
        const userId = req.user?._id;
        let aiResponse = "";
        try {
            aiResponse = await generateAIResponse(question);
        } catch (error) {
            console.log("Could not generate response: ", error);
            return res.status(502).json({
                success: false,
                message: "AI service failed to generate response"
            });
        }
        if (!userId && aiResponse) return res.status(200).json({ success: true, answer: aiResponse });

        const newChat = {
            userId,
            versions: [{ question, answer: aiResponse }],
            timestamp
        };
        const new_row = new chatModel(newChat);
        await new_row.save();
        return res.status(201).json({ success: true, answer: aiResponse, chatId: new_row._id })
    } catch (error) {
        console.error("Error at Ask AI Controller: ", error);
        return res.status(500).json({ message: 'Internal server error', success: false, error });
    }
}

export const editController = async (req, res) => {
    try {
        const { question, chatId } = req.body;
        const userId = req.user?._id;
        let aiResponse = "";

        try {
            aiResponse = await generateAIResponse(question);
        } catch (error) {
            return res.status(502).json({
                success: false,
                message: "AI service failed to generate response"
            });
        }

        if (!userId && aiResponse) return res.status(200).json({ success: true, answer: aiResponse });

        const targetedChat = await chatModel.findById(chatId);
        if (!targetedChat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }
        const newVersion = { question, answer: aiResponse };

        targetedChat.versions.push(newVersion);
        await targetedChat.save();

        return res.status(200).json({ success: true, answer: aiResponse })


    } catch (error) {
        console.error("Error at Edit Chat Controller: ", error);
        return res.status(500).json({ success: false, message: 'Internal server error', error });
    }
}