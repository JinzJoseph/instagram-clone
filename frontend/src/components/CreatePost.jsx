import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { useRef, useState } from "react";
import { DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useDispatch,useSelector } from "react-redux";
import { setPost } from "@/redux/postSlice";
const CreatePost = ({ open, setOpen }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const imageRef = useRef();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
const dispatch=useDispatch()
  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataurl = await readFileAsDataURL(file);
      setImagePreview(dataurl);
    }
  };
const {post}=useSelector((state)=>state.posts)
const {user}=useSelector((state)=>state.auth)
  const createPostHandler = async () => {
    const data = new FormData();
    data.append("image", file);
    data.append("caption", caption);

    try {
      setLoading(true);
      const res = await axios.post("/api/v1/post/addnewpost", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      setLoading(false);
      console.log(res)
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setPost([res?.data?.post,...post]))
        setOpen(false);
        setCaption("");
        setFile(null);
        setImagePreview("");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader>Create a Post</DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar className="w-7 h-7">
            <AvatarImage
              className="rounded-full"
              src={
                user.profilePicture
              }
              alt="User Avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">username</h1>
            <span className="text-gray-600 text-xs">Bio here.....</span>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a caption..."
        />
        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center">
            <img
              src={imagePreview}
              alt="preview_img"
              className="object-cover h-full w-full rounded-md"
            />
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]"
        >
          Select from computer
        </Button>
        {imagePreview && (
          <Button
            onClick={createPostHandler}
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Post"
            )}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
