import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CiBookmark } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { FaRegMessage } from "react-icons/fa6";
import { MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { IoSend } from "react-icons/io5";
import CommentDialog from "./CommentDialog";
const Post = () => {
  const [text, setText] = useState("");
  const [open,setOpen]=useState(false)
  return (
    <div className="my-8 w-full  max-w-md   mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" alt="posrt" />
            <AvatarFallback>Cn</AvatarFallback>
          </Avatar>
          <h1>username</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal asChild children=" cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm justify-center">
            <Button
              variant="gost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              unfollow
            </Button>
            <Button
              variant="gost"
              className="cursor-pointer w-fit text-[#8249ed] font-bold"
            >
              Add to favioutes
            </Button>
            <Button
              variant="gost"
              className="cursor-pointer w-fit text-black font-bold"
            >
              Delete
            </Button>
            <Button
              variant="gost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Cancel
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-3 w-full aspect-square object-cover"
        src="https://images.stockcake.com/public/c/8/6/c866b030-bba0-4ebf-8e40-8ebd3e353fb9_large/peaceful-meditation-spot-stockcake.jpg"
        alt="post_image"
      />
      {/* commment section */}
      <div className=" flex justify-between my-3">
        <div className="flex  items-center justify-between gap-4">
          <CiHeart
            size={"26px"}
            className="cursor-pointer hover:text-gray-600"
          />
          <FaRegMessage
          onClick={()=>setOpen(true)}
            size={"24px"}
            className="cursor-pointer hover:text-gray-600"
          />
          <IoSend
            size={"24px"}
            className="cursor-pointer hover:text-gray-600"
          />
        </div>
        <div>
          <CiBookmark
            size={"26px"}
            className="cursor-pointer hover:text-gray-600"
          />
        </div>
      </div>
      <span className="font-medium block mb-2">20k likes</span>
      <p className="text-gray-300">
        <span className="font-medium mr-2">username</span>
        caption
      </p>
      <span onClick={()=>setOpen(true)  } className="cursor-pointer text-gray-300">view all 10 comment</span>
      <CommentDialog open={open} setopen={setOpen} />
      <div className="flex  items-center justify-between my-2">
        <input
          type="text"
          placeholder="Add a comment....."
          className="outline-none text-sm w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {text && <span className="text-blue-400">Post</span>}
      </div>
    </div>
  );
};

export default Post;
