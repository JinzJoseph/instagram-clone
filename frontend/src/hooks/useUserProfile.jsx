import { setsuggestedUser, setUserProfile } from "@/redux/authSlice";

import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
const useUserProfile = (id) => {
   
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchuserprofile = async () => {
      try {
        const res = await axios.get(`/api/v1/user/getProfile/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          console.log(res);
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchuserprofile()
  },[]);
};

export default useUserProfile;
