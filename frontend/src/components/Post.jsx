import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CiBookmark } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaRegMessage } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";
import { MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { IoSend } from "react-icons/io5";
import CommentDialog from "./CommentDialog";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { setPost, setselectedPost } from "@/redux/postSlice";
import axios from "axios";
const Post = ({ item }) => {
  const [text, setText] = useState("");

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { post } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const [like, setLike] = useState(item?.likes?.includes(user?._id) || false);
  const [comment, setcomment] = useState(item?.Comments);
  const [postLike, setpostlike] = useState(item?.likes?.length);
  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`/api/v1/post/deletePost/${item?._id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        const updatedResult = post.filter(
          (postItem) => postItem._id !== item._id
        );
        dispatch(setPost(updatedResult));
        toast.success("Post Deleted Successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const likeAndDislike = async () => {
    try {
      const action = like ? "dislike" : "like";
      const res = await axios.put(
        `/api/v1/post/${action}/${item?._id}`,
        {}, // No need to send data in the body for this request
        { withCredentials: true }
      );

      if (res.data.success) {
        // Update the local state for likes count
        const updatedLike = like ? postLike - 1 : postLike + 1;
        setpostlike(updatedLike);
        setLike(!like);

        // Update the post's likes in the Redux store
        const updatedPostData = post.map((p) =>
          p._id === item._id
            ? {
                ...p,
                likes: like
                  ? p.likes.filter((id) => id !== user._id) // Dislike: Remove user ID from likes
                  : [...p.likes, user._id], // Like: Add user ID to likes
              }
            : p
        );
        dispatch(setPost(updatedPostData));

        // Show success message
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the post.");
    }
  };
  const commentHandler = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(
        `/api/v1/post/addcomment/${item?._id}`,
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
        const updatedPostComment = [...comment, res.data.comment];
        setcomment(updatedPostComment);

        // Update the specific post's comments in the Redux store or local state
        const updatedPostData = post.map((p) =>
          p._id === item._id
            ? { ...p, Comments: updatedPostComment } // Update the comment array for the matching post
            : p
        );
        dispatch(setPost(updatedPostData));
        // Update the Redux store if applicable
        // dispatch(setPost(updatedPostData)); // Uncomment if you're using Redux

        // Show success message
        toast.success(res.data.message);
        setText("");
        // Clear the comment input field
      }
    } catch (error) {
      console.log(error);
    }
  };
  const bookMarHandler = async () => {
    try {
      const res = await axios.post(
        `/api/v1/post/bookmarked/${item._id}`,
        {
          headers: {
            "content-type": "application/json",
          },
        },
        { withCredentials: true }
      );
      console.log(res);
      if (res.data.success) {
        toast.message(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="my-8 w-full  max-w-md   mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={item?.author?.profilePicture} alt="post" />
            <AvatarFallback>Cn</AvatarFallback>
          </Avatar>
          <h1>{item?.author?.username}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal asChild children=" cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm justify-center">
            {item?.author?._id !== user?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Unfollow
              </Button>
            )}
          
            <Button
              variant="gost"
              className="cursor-pointer w-fit text-[#8249ed] font-bold"
            >
              Add to favioutes
            </Button>
            {user && user?._id === item?.author?._id && (
              <Button
                onClick={deletePostHandler}
                variant="gost"
                className="cursor-pointer w-fit text-black font-bold"
              >
                Delete
              </Button>
            )}

            {/* <Button
              variant="gost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Cancel
            </Button> */}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-3 w-full aspect-square object-cover"
        src={item?.image}
        alt="post_image"
      />
      {/* commment section */}
      <div className=" flex justify-between my-3">
        <div className="flex  items-center justify-between gap-4">
          {like ? (
            <FaHeart
              onClick={() => likeAndDislike()}
              size={"26px"}
              className="cursor-pointer text-red-600"
            />
          ) : (
            <FaHeart
              onClick={() => likeAndDislike()}
              size={"26px"}
              className="cursor-pointer text-gray-400"
            />
          )}

          <FaRegMessage
            onClick={() => {
              setOpen(true);
              dispatch(setselectedPost(item));
            }}
            size={"24px"}
            className="cursor-pointer hover:text-gray-600"
          />
          <IoSend
            size={"24px"}
            className="cursor-pointer hover:text-gray-600"
          />
        </div>
        <div>
          {/* {
            user?.bookmarks?.includes(item?._id) ?(
              <FaBookmark
              onClick={bookMarHandler}
              size={"26px"}
              className="cursor-pointer hover:text-gray-600"
            />
            ):(
              <CiBookmark
              onClick={bookMarHandler}
              size={"26px"}
              className="cursor-pointer hover:text-gray-600"
            />
            )
          } */}
          <CiBookmark
            onClick={bookMarHandler}
            size={"26px"}
            className="cursor-pointer hover:text-gray-600"
          />
        </div>
      </div>
      <span className="font-medium block mb-2">{postLike} likes</span>
      <p className="">
        <span className="font-medium mr-2">@{item?.author?.username}</span>
        {item.caption}
      </p>
      <span
        onClick={() => {
          setOpen(true);
          dispatch(setselectedPost(item));
        }}
        className="cursor-pointer text-gray-300"
      >
        {item.Comments.length > 0 &&
          `view all ${item.Comments.length} comments`}
      </span>
      <CommentDialog open={open} setopen={setOpen} />
      <div className="flex  items-center justify-between my-2">
        <input
          type="text"
          placeholder="Add a comment....."
          className="outline-none text-sm w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-blue-400 cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
