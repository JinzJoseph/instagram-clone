import { setsuggestedUser } from "@/redux/authSlice";

import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const useSuggestedUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchuser = async () => {
      try {
        const res = await axios.get("/api/v1/user/otherusers", {
          withCredentials: true,
        });
        if (res.data.success) {
          console.log(res);
          dispatch(setsuggestedUser(res.data.users));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchuser()
  },[]);
};

export default useSuggestedUser;
