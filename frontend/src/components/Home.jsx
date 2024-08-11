import React from 'react'

import { Outlet } from 'react-router-dom'
import Feed from './Feed'
import RightSideBar from './RightSideBar'
import useSuggestedUser from '../hooks/useSuggestedUser'

const Home = () => {
   useSuggestedUser()
    return (
        <div className='flex'>
            <div className='flex-grow'>
                <Feed />
                {/* <Outlet /> */}
            </div>
            <RightSideBar/>
        </div>
    )
}

export default Home