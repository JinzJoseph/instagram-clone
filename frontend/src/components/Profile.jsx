import useUserProfile from "@/hooks/useUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";

const Profile = () => {
  const params = useParams(); // Corrected typo
  useUserProfile(params.id);
  const { userProfile, user } = useSelector((state) => state.auth);

  // Default values to prevent potential undefined errors
  const loggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = userProfile?.following?.includes(user?._id);
  const [activeTab, setActiveTab] = useState("posts");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts || [] : userProfile?.bookmarks || [];

  return (
    <div className="flex max-w-4xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <div className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userProfile?.profilePicture || "/default-profile.png"} // Default image if profilePicture is undefined
                alt={userProfile?.username || "Profile"}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username || "User"}</span>
                {loggedInUserProfile ? (
                  <>
                    <Link to="/editprofile">
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8"
                      >
                        Edit Profile
                      </Button>
                    </Link>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">
                      View Archive
                    </Button>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">
                      Add Tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button variant="secondary" className="h-8"> {/* Corrected "varient" to "variant" */}
                      Unfollow
                    </Button>
                    <Button variant="secondary" className="h-8">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button className="bg-[#0095F6] hover:bg-[#3192d2] h-8">
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold mr-1 ">
                    {userProfile?.posts?.length || 0}
                  </span>
                  posts
                </p>
                <p>
                  <span className="font-semibold mr-1 ">
                    {userProfile?.followers?.length || 0}
                  </span>
                  followers
                </p>
                <p>
                  <span className="font-semibold mr-1  ">
                    {userProfile?.following?.length || 0}
                  </span>
                  following
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex mb-7 gap-3">
                  <Badge className="w-fit" variant="secondary">
                    <AtSign />
                    <span className="pl-1">{userProfile?.username || "User"}</span>
                  </Badge>
                  <span className="font-semibold">
                    {userProfile?.bio || "Bio here..."}
                  </span>
                </div>

                <span>🤯 Learning full stack in MERN</span>
                <span>🤯 Building amazing projects</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-t-gray-400">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              Posts
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              Saved
            </span>
            <span className="py-3 cursor-pointer">Reels</span>
            <span className="py-3 cursor-pointer">Tags</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayedPost.map((post, index) => (
              <div key={index} className="relative group cursor-pointer">
                <img
                  src={post.image || "/default-image.png"} // Default image if post.image is undefined
                  className="rounded-sm my-2 w-full aspect-square object-cover"
                  alt={`Post ${index + 1}`}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-100 duration-300">
                  <div className="flex items-center text-white space-x-4">
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <Heart />
                      <span>{post?.likes?.length || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <MessageCircle />
                      <span>{post?.Comments?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
