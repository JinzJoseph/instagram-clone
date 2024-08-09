import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const CommentDialog = ({ open, setopen }) => {
    const [text,settext]=useState("");
    const messageHandler=async()=>{

    }
  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setopen(false)}
        className="max-w-3xl p-0 flex flex-col"
      >
        <div className="flex gap-4">
          <div className="w-1/2">
            <img
              className="w-full h-full object-cover rounded-l-lg"
              src="https://images.stockcake.com/public/c/8/6/c866b030-bba0-4ebf-8e40-8ebd3e353fb9_large/peaceful-meditation-spot-stockcake.jpg"
              alt="post_image"
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4 ">
              <div className="flex gap-3 items-center">
                <Link to="/profile">
                  <Avatar>
                    <AvatarImage src="" alt="posrt" />
                    <AvatarFallback>Cn</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-sm">username</Link>
                  {/* <span className="text-gray-600 text-sm">Bio</span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal asChild children=" cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-center text-sm justify-center">
                  <div className="cursor-pointer w-full text-red-400">
                    unfollow
                  </div>
                  <div className="cursor-pointer w-full text-red-400">
                    Add to favouite
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-95 p-4">comment</div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment....."
                  className="outline-none text-sm w-full"
                  value={text}
                  onChange={(e)=>settext(e.target,value)}
                />
                <Button disable={!text.trim()} onClick={messageHandler}>send</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
