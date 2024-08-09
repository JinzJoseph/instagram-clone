import mongoose from "mongoose";
const messageSchem = new mongoose.Schema({
  senderId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  reciverId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  message: {
    type: String,
    required: true,
  },
});
 const  message = mongoose.model("Message", messageSchem);
 export default message