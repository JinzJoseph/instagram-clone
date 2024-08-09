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
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LeftSidebar = () => {
  const navigate=useNavigate()
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
          <AvatarImage alt="@shadcn" />
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
  const handleItem=(item)=>{
    if(item.text==="logout") handleLogout()
  }
const handleLogout=async()=>{
  try {
    const res=await axios.get("/api/v1/user/logout");
    if(res.data.success){
      toast.success(res.data.message)
      navigate("/login")
    }
  } catch (error) {
    console.log(error)
  }
}
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
              onClick={()=>handleItem(item)}
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeftSidebar;
