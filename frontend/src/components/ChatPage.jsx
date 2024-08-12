import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { setSelecteduser } from "@/redux/authSlice";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import Message from "./Message";
import axios from "axios";
import { setMessage } from "@/redux/chatSlice";
import { Navigate } from "react-router-dom";

const ChatPage = () => {
  const { user, suggesteduser, selectedUser } = useSelector(
    (state) => state.auth
  );
  if (!user) {
    Navigate("/login");
  }

  const dispatch = useDispatch();
  const { onlineuser, message } = useSelector((state) => state.chat);
  const [textmessage, settextmessage] = useState("");

  const handleSubmit = async (id) => {
    try {
      const res = await axios.post(
        `/api/v1/message/sendmessage/${id}`,
        { textmessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessage([...message, res.data.newMessage]));
        settextmessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelecteduser(null));
    };
  }, []);

  return (
    <div className="flex ml-[20%] h-screen">
      <section className="w-1/4 p-4">
        <h1 className="font-bold mb-4 text-xl">{user.username}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {suggesteduser.map((user) => {
            const isOnline = onlineuser.includes(user._id);
            return (
              <div
                key={user._id}
                className="flex items-center p-3 hover:bg-gray-300 cursor-pointer gap-3"
                onClick={() => {
                  dispatch(setSelecteduser(user));
                  // dispatch(setRefresh())
                }}
              >
                <Avatar>
                  <AvatarImage
                    src={user?.profilePicture}
                    alt={user?.username}
                  />
                  <AvatarFallback>{user?.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user?.username}</span>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-400" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className="flex-1 border-l border-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage
                src={selectedUser?.profilePicture}
                alt={selectedUser?.username}
              />
              <AvatarFallback>{selectedUser?.username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser?.username}</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <Message seluser={selectedUser} />
          </div>
          <div className="flex items-center p-4 border-t border-gray-300">
            <input
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Type a message..."
              value={textmessage}
              onChange={(e) => settextmessage(e.target.value)}
            />
            <Button onClick={() => handleSubmit(selectedUser._id)}>Send</Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto text-center w-full">
          <MessageCircle className="w-32 h-32 my-4" />
          <h1 className="text-lg font-semibold">Your Messages</h1>
          <span>Send a message to start a chat.</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
