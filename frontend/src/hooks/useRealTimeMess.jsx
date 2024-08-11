import { setMessage } from "@/redux/chatSlice";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useRealTimeMess = () => {
  const dispatch = useDispatch();
  const {message}=useSelector((state)=>state.chat)
  const {socket}=useSelector((state)=>state.socket)
  useEffect(() => {
    socket?.on('newMessage',(newMessage)=>{
        dispatch(setMessage([...message,newMessage]))
    })
    return()=>{
        socket?.off('newMessage')
    }
  },[message,setMessage]);
};

export default useRealTimeMess;
