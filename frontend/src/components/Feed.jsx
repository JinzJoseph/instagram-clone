import React, { useEffect } from "react";
import Posts from "./Posts";
import useGetAllPost from "@/hooks/useGetAllPost";

const Feed = () => {

  useGetAllPost()

  return (
    <div className="flex-1 my-8 flex flex-col items-center pl-[20%]">
      <Posts />
    </div>
  );
};

export default Feed;
