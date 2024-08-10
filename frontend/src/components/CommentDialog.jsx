import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MoreHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPost } from "../redux/postSlice";

const CommentDialog = ({ open, setopen }) => {
  const [text, settext] = useState("");
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  const { selectedPost, post } = useSelector((state) => state.posts);
  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost?.Comments);
    }
  }, [selectedPost]);
  const messageHandler = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(
        `/api/v1/post/addcomment/${selectedPost._id}`,
        { text },
        {
          headers: {
            "Content-type": "application/json",
          },
        },
        {
          withCredentials: true,
        }
      );
      // console.log(res);
      if (res.data.success) {
        // Update the local state for comments
        const updatedPostComment = [...comment, res?.data?.comment];
        setComment(updatedPostComment);

        // Update the specific post's comments in the Redux store or local state
        const updatedPostData = post.map((p) =>
          p._id === selectedPost?._id
            ? { ...p, Comments: updatedPostComment } // Update the comment array for the matching post
            : p
        );
        dispatch(setPost(updatedPostData));
        dispatch({
          type: "setselectedPost",
          payload: {
            ...selectedPost,
            Comments: updatedPostComment,
          },
        });

        // Update the Redux store if applicable
        // dispatch(setPost(updatedPostData)); // Uncomment if you're using Redux

        // Show success message
        toast.success(res.data.message);
        settext("");

        // Clear the comment input field
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setopen(false)}
        className="max-w-5xl max-h-5xl  p-0 flex flex-col"
      >
        <div className="flex flex-1 gap-4">
          <div className="w-1/2">
            <img
              className="w-full h-full object-cover rounded-l-lg"
              src={selectedPost?.image}
              alt="post_image"
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4 ">
              <div className="flex gap-3 items-center">
                <Link to="/profile">
                  <Avatar>
                    <AvatarImage
                      src={selectedPost?.author?.profilePicture}
                      alt="posrt"
                    />
                    <AvatarFallback>Cn</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-sm">
                    {selectedPost?.author?.username}
                  </Link>
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
            <div className="flex-1 overflow-y-auto max-h-95 p-4">
              {selectedPost?.Comments.map((comment, index) => (
                <Comment key={index} comment={comment} />
              ))}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment....."
                  className="outline-none text-sm w-full"
                  value={text}
                  onChange={(e) => settext(e.target.value)}
                />
                <Button disable={!text.trim()} onClick={messageHandler}>
                  send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
