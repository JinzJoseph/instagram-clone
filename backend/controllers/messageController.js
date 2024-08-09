import {Conversation} from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // Establish a connection if it is not yet started
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Push details into Message model
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    // Implement Socket.IO for real-time communication
    // Assuming you have `io` available in the scope
   // io.to(receiverId).emit("newMessage", newMessage);

    await newMessage.save();

    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
};


export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const reciverId = req.params.id;
    const conversation = await Conversation.findone({
      participants: {
        $all: [senderId, reciverId],
      },
    }).populate('messages');
    if(!conversation){
        return res.status(200).json({
            success:true,
            message:[]
        })
    }
    return res.status(200).json({success:true, messages:conversation?.messages});
  } catch (error) {
    console.log(error);
  }
};
