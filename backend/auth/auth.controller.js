import userModel from "../user/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import chatModel from "../chat/chat.model.js";

export const signupController = async (req, res) => {
    try {
        const { name, email, password, availableChats } = req.body;

        const existing_user = await userModel.findOne({ email });
        if (existing_user) {
            return res.status(409).json({ message: 'user already exists', success: false });
        }
        const new_user = new userModel({ name, email, password });
        new_user.password = await bcrypt.hash(password, 10);
        await new_user.save();

        if (availableChats?.length > 0) {
            const chats = [...availableChats]
                .filter(item => item.versions?.length)
                .map(item => ({
                    userId: new_user._id,
                    versions: item.versions,
                    timestamp: item.timestamp
                }));

            if (chats.length) await chatModel.insertMany(chats, { ordered: false, runValidators: true });
        }

        const jwtToken = jwt.sign(
            { _id: new_user._id, email },
            process.env.JWT_Secret,
            { expiresIn: "3d" }
        );

        res.status(201).json({
            success: true,
            token: jwtToken
        });
    } catch (err) {
        console.error("error at signup controller: ", err);
        return res.status(500).json({ message: 'internal server error', success: false });
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password, availableChats } = req.body;

        const existing_user = await userModel.findOne({ email });
        console.log("Logging user: ", existing_user);
        if (!existing_user) {
            return res.status(404).json({ message: 'Invalid credentials', success: false });
        }
        const isPassEqual = await bcrypt.compare(password, existing_user.password);
        if (!isPassEqual) {
            return res.status(401).json({ message: 'Invalid credentials', success: false });
        }

        if (availableChats?.length > 0) {
            const chats = [...availableChats]
                .filter(item => item.versions?.length)
                .map(item => ({
                    userId: existing_user._id,
                    versions: item.versions,
                    timestamp: item.timestamp
                }));

            if (chats.length) await chatModel.insertMany(chats, { ordered: false, runValidators: true });
        }

        const jwtToken = jwt.sign(
            {
                _id: existing_user._id,
                email: existing_user.email
            },
            process.env.JWT_Secret,
            { expiresIn: "3d" }
        );

        res.status(200).json({
            success: true,
            token: jwtToken
        });
    } catch (err) {
        console.error("error at login controller: ", err);
        return res.status(500).json({ message: 'internal server error', success: false });
    }
}