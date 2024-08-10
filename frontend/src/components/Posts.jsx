import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";
const Posts = () => {
  const { post } = useSelector((state) => state?.posts);
 
  return (
    <div>
      {post?.map((item, index) => {
        return <Post key={index} item={item} />;
      })}
    </div>
  );
};

export default Posts;
