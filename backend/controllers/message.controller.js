import { Conversation } from "../models/conversationmodle.js";
import { Message } from "../models/messagemodel.js";

// for chatting
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id
    const {message} = req.body
    // to get previous conversation
    let conversation = await Conversation.findOne({
        participants:{$all: [senderId, receiverId]}

    })
    //establish the conversation if not started
    if (!conversation) {
        conversation = await Conversation.create({
            participants:[senderId,receiverId]
        })
    }
    //create new message
    const newMessage = Message.create({
        senderId,
        receiverId,
        message
    })
    if(newMessage) conversation.messages.push(newMessage._id)
    await Promise.all([conversation.save(),newMessage.save()])

    //implement socket.io for realtime message

    return res.status(201).json({
        success: true,
        newMessage
      });

  } catch (error) {
    console.log(error);
  }
};

export const getMessage = async (req, res) => {
    try {
      const senderId = req.id;
      const receiverId = req.params.id
      
      // to get previous conversation
      let conversation = await Conversation.findOne({
          participants:{$all: [senderId, receiverId]}
  
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