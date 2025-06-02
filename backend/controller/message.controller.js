import mongoose from 'mongoose';
import messageModel from '../model/message.model.js';
import conversationModel from '../model/conversation.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js' 

// ===================== 1. CREATE MESSAGE ==========================
// POST: /api/messages/:receiverId
// PROTECTED
export const createMessage = async (req, res, next) => {
    try {
        const receiverId = req.params.receiverId;
        const message = req.body.message;
        const senderId = req.id;

        if (!message) {
            return res.status(400).json({ success: false, message: "You can't send an empty message" });
        }

        // Find or create conversation
        let conversation = await conversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await conversationModel.create({
                participants: [senderId, receiverId],
                lastMessages: { text: message, senderId }
            });
        }

        // Create message
        const newMessage = await messageModel.create({
            conversationId: conversation._id,
            senderId,
            receiverId,
            message
        });

        // Update last message
        conversation.lastMessages = { text: message, senderId };
        await conversation.save();

        // 🔴 Emit socket message to receiver if online
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({ success: true, message: newMessage });
    } catch (error) {
        next(error);
    }
};


















// ================================ 2. GET MESSAGES =====================================
//  GET: api/messages/:receiverId
// PROTECTED
export const getMessages = async (req, res, next) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.receiverId;

        // Validate receiverId
        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ success: false, message: "Invalid receiver ID" });
        }

        // Find conversation
        const conversation = await conversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            return res.status(404).json({ success: false, message: "You have no conversation with this user" });
        }

        // Fetch messages
        const messages = await messageModel
            .find({ conversationId: conversation._id })
            .populate('senderId', 'username avatar')
            .sort({ createdAt: 1 });

        // Optional: Mark messages as seen
        await messageModel.updateMany(
            { conversationId: conversation._id, receiverId: senderId, seen: false },
            { $set: { seen: true } }
        );

        res.status(200).json({ success: true, messages });

    } catch (error) {
        next(error);
    }
}













// ================================ 3. GET CONVERSATION =====================================
//  GET: api/messages/conversations
// PROTECTED
export const getConversation = async (req, res, next) => {
    try {
        const senderId = req.id;

        const conversations = await conversationModel.find({ participants: senderId })
            .populate({
                path: "participants",
                select: "fullName ProfilePhoto"
            });

        // Filter out current user from participants in response
        const response = conversations.map(conv => {
            const otherParticipants = conv.participants.filter(p => p._id.toString() !== senderId.toString());
            return {
                _id: conv._id,
                lastMessage: conv.lastMessages, // consider renaming in schema to lastMessage
                participants: otherParticipants,
                updatedAt: conv.updatedAt
            };
        });

        res.status(200).json({ success: true, conversations: response });

    } catch (error) {
        next(error);
    }
};
