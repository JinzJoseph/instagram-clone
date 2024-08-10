import { setPost } from "@/redux/postSlice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchpost = async () => {
      try {
        const res = await axios.get("/api/v1/post/getallpost", {
          withCredentials: true,
        });
        if (res.data.success) {
          console.log(res);
          dispatch(setPost(res.data.posts));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchpost()
  },[]);
};

export default useGetAllPost;
