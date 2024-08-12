import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SuggestedUser = () => {
  const { suggesteduser } = useSelector((state) => state.auth);

  return (
    <div className="my-10 w-full">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-700">Suggested Users</h1>
        <span className="text-sm font-medium text-blue-500 cursor-pointer hover:underline">See all</span>
      </div>

      {suggesteduser?.map((user, index) => (
        <div key={index} className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${user?._id}`}>
              <Avatar className="">
                <AvatarImage
                  src={user?.profilePicture}
                  alt="user_profile_picture"
                  className="rounded-full w-10 h-10"
                />
                <AvatarFallback className="bg-gray-300 text-gray-700">
                  {user?.username[0]}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex flex-col">
              <Link to={`/profile/${user?._id}`}>
                <h1 className="font-semibold text-sm text-gray-800 hover:underline">
                  {user?.username}
                </h1>
              </Link>
              <span className="text-gray-600 text-xs">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <button className="text-xs font-bold text-white bg-blue-500 rounded-full px-4 py-1 hover:bg-blue-600 transition duration-200">
            Follow
          </button>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUser;
