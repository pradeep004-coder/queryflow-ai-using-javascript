import mongoose from "mongoose";

const versionSchema = new mongoose.Schema({
    question: { type: String, required: true},
    answer: { type: String, required: true},
    createdAt: {type: Date, default: Date.now}
})

const chatSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    versions: [versionSchema],
    timestamp: {type: Date, default: Date.now, required: true}
});

const chatModel = mongoose.model("chats", chatSchema);
export default chatModel;