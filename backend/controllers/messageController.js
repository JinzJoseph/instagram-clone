import { Conversation } from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getReciverSocketId, io } from "../socket/soket.js";
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const message = req.body.textmessage;

    // Check if a conversation between the two users exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // Create a new conversation if it doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create a new message
    const newMessage = await Message.create({
      senderId,
      reciverId: receiverId,
      message,
    });


    if (newMessage) {
      // Add the message to the conversation
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    // Get the receiver's socket ID
    const receiverSocketId = getReciverSocketId(receiverId);
    console.log(receiverSocketId);

    // Send the message in real-time if the receiver is connected
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Respond to the sender with success
    res.status(200).json({
      success: true,
      message: "Message sent successfully!",
      newMessage,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send message." });
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id; // Assuming `req.id` contains the sender's ID
    const receiverId = req.params.id; // Assuming `req.params.id` contains the receiver's ID

    // Find the conversation between the sender and receiver
    const conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    }).populate("messages");

    // If no conversation is found, return an empty array of messages
    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: [],
        message: "No conversation found between these users.",
      });
    }

    // Return the messages from the conversation
    return res.status(200).json({
      success: true,
      messages: conversation.messages,
    });
  } catch (error) {
    console.error("Error retrieving messages:", error);

    // Return a generic error message to the client
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving messages.",
    });
  }
};
