import React, { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useRealTimeMess from '@/hooks/useRealTimeMess'


const Messages = ({ seluser }) => {
  
    useRealTimeMess()
    useGetAllMessage();
    const {message} = useSelector(store=>store.chat);
    const {user} = useSelector(store=>store.auth);
  
    return ( 
           
        <div className='overflow-y-auto flex-1 p-4'>
            <div className='flex justify-center'>
                <div className='flex flex-col items-center justify-center'>
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={seluser?.profilePicture} alt='profile' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>{seluser?.username}</span>
                    <Link to={`/profile/${seluser?._id}`}><Button className="h-8 my-2" variant="secondary">View profile</Button></Link>
                </div>
            </div>
            <div className='flex flex-col gap-3'>
                {
                         message.map((msg) => {
                        return (
                            <div key={msg._id} className={`flex ${msg.senderId[0] === user?._id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId[0] === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                    {msg.message}
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </div>  
    )
}

export default Messages