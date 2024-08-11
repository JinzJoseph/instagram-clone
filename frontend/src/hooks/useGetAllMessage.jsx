import { setMessage } from "@/redux/chatSlice";

import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const {selectedUser}=useSelector((state)=>state.auth)
  useEffect(() => {
    const fetchmessage = async () => {
      try {
        const res = await axios.get(`/api/v1/message/getmessage/${selectedUser._id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          console.log(res);
          dispatch(setMessage(res.data.messages));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchmessage()
  },[]);
};

export default useGetAllMessage;
