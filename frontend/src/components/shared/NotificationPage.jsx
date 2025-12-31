import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { USER_API_END_POINT } from '@/utils/address';
import axios from 'axios';

function NotificationPage() {

let notificationCount = 0;
  let notificationsMessages = [];

useEffect(()=>{
  async function getNotifications(){
    const res = await axios.get(`${USER_API_END_POINT}/notification`);
    if(res.data.success){
      notificationCount = res.data.notifications.newMessageCount;
      notificationsMessages = res.data.notifications.allMessages;
    }
  }

  getNotifications();
},[]);


  return (
    <div>
<div className="h-full relative flex items-center">
        <Sidebar highlightIndex={1}/><Navbar/>
      </div>

    </div>
  )
}

export default NotificationPage