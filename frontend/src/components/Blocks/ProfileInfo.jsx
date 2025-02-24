import React from 'react'
import { getInitials } from '../../utilites/helper'

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    <div className='flex items-center gap-3'>
      <div className='flex rounded-full border border-blue-300 bg-blue-100 p-2 dark:border-blue-300/10 dark:bg-blue-400/10'>
        {getInitials((userInfo?.fullName))}
      </div>
      <div>
        <p className='text-sm font-medium'>{userInfo?.fullName}</p>
        <button className='text-sm text-slate-700 underline cursor-pointer' onClick={onLogout}>Logout</button>
      </div>
    </div>

  )
}

export default ProfileInfo;