import { setAuthUser, setsuggestedUser } from "@/redux/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";
import { setPost, setselectedPost } from "@/redux/postSlice";
import SuggestedUser from "./SuggestedUser";

const LeftSidebar = () => {
  const { user } = useSelector((state) => state.auth);
  console.log(user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarItems = [
    {
      icon: <Home />,
      text: "Home",
    },
    {
      icon: <Search />,
      text: "Search",
    },
    {
      icon: <TrendingUp />,
      text: "Explore",
    },
    {
      icon: <MessageCircle />,
      text: "Message",
    },
    {
      icon: <Heart />,
      text: "Notification",
    },
    {
      icon: <PlusSquare />,
      text: "Create",
    },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage
            className="rounded-full"
            src={
              user?.profilePicture ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            }
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    {
      icon: <LogOut />,
      text: "logout",
    },
  ];
  const handleItem = (item) => {
    if (item.text === "logout") {
      handleLogout();
    } else if (item.text === "Create") {
      setOpen(true)
    }
  };
  const [open, setOpen] = useState(false);
  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/v1/user/logout");
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setPost(null));
        dispatch(setselectedPost(null))
        dispatch(setsuggestedUser(null))
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed top-0 z-10  ml-10 border-r border-gray-300 w-[15%] h-screen ">
      <div className="flex flex-col ml-10">
        <h1 className="my-8 pl-3 font-bold text-xl">Logo</h1>
      </div>

      <div>
        {sidebarItems.map((item, index) => {
          return (
            <div
              key={index}
              className="flex items-center gap-3 hover:bg-gray-400 cursor-pointer rounded-lg p-3 my-3"
              onClick={() => handleItem(item)}
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
      <CreatePost open={open} setOpen={setOpen}/>
    </div>
  );
};

export default LeftSidebar;
