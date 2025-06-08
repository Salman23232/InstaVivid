import { Conversation } from "../models/conversationmodle.js";
import { Message } from "../models/messagemodel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// for chatting
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ success: false, error: "Message content is required." });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    // Correctly populate
    await newMessage.populate("senderId", "-password");
    await newMessage.populate("receiverId", "-password");

    // Push message to conversation
    conversation.messages.push(newMessage._id);
    await conversation.save();

    // Emit with socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log("Send message error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};



export const getMessage = async (req, res) => {
    try {
      const senderId = req.id;
      const receiverId = req.params.id
      
      // to get previous conversation
      let conversation = await Conversation.findOne({
          participants:{$all: [senderId, receiverId]}
  
      }).populate({
  path: 'messages',
  populate: [
    { path: 'senderId', select: '-password' },
    { path: 'receiverId', select: '-password' }
  ]
})

      if (!conversation) return res.status(200).json({success:false, messages:[]})
          
  
      return res.status(200).json({
          success: true,
          messages:conversation?.messages
        });
  
    } catch (error) {
      console.log(error);
    }
  };