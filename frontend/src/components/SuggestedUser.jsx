import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SuggestedUser = () => {
  const { suggesteduser } = useSelector((state) => state.auth);
  return (
    <div className="my-10 w-full">
      <div className="flex items-center justify-between  my-5">
        <h1 className="font-semibold text-gray-600">Suggested Users</h1>
        <span className="font-medium cursor-pointer">See all</span>
      </div>
      {suggesteduser?.map((user, index) => {
        return (
          <div key={index} className="flex items-center justify-between my-5">
            <div className="flex items-center gap-2">
              <Link to={`/profile/${user?._id}`}>
                <Avatar>
                  <AvatarImage src={user?.profilePicture} alt="post_image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm">
                  <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                </h1>
                <span className="text-gray-600 text-sm">
                  {user?.bio || "Bio here..."}
                </span>
              </div>
            </div>
            <span className="text-white bg-blue-500 rounded-full px-5 py-1 text-xs font-bold cursor-pointer hover:text-[#0b161d]">
              Follow
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUser;
