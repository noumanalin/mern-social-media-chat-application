import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ProfileImage from '../ProfileImage'
import { Check, X } from 'lucide-react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { toast } from 'react-toastify'

interface FriendBageProps {
    friend: {
 _id: string
  userName: string
  profilePhoto?: string
  bio?: string
  followers: string[]
  followings: string[]
    }
    filterFriend: (id: string) => void
}

const FriendBage = ({friend, filterFriend}: FriendBageProps) => {
  const [spinner, setSpinner] = useState<boolean>(false)
  const token = useSelector((state:RootState)=>state?.user?.token)


    const followUnFollowUser = async () => {
      setSpinner(true)
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/user/follow-unfollow/${friend?._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success( res?.data?.message || "Followed user");
        filterFriend(friend?._id)
        setSpinner(false)
      }
    } catch (error) {
      toast.error("Failed to follow/unfollow user");
      setSpinner(false)

    }
  };

  return (
    <>
    <article className='flex justify-between items-center'>
      <Link to={`/user/${friend?._id}`} className='flex items-center gap-3' title='Go to user profile.'>
        <ProfileImage image={friend?.profilePhoto} />
        <span>
          <h3 className='text-xl font-bold tracking-tighter'>{friend?.userName}</h3>
         <p className='text-gray-600 tracking-tight dark:text-gray-300'>
          {friend?.bio && friend.bio.length > 30 ? (
            <>
              {friend.bio.substring(0, 30)} <strong>...</strong>
            </>
          ) : (
            friend?.bio
          )}
        </p>
        </span>
      </Link>

      <div>
        {spinner ? 
          <span className=" spinner " title='Please, wait your action is performing'/> 
          : 
          <button onClick={followUnFollowUser} title='follow' className='bg-primary web-parymary-btn rounded-full p-1 text-gray-200  '><Check /></button> 
        }
        
        <button onClick={()=>filterFriend(friend?._id)} title='remove' className='ml-3 cursor-pointer'><X /></button>

      </div>

    </article>
    </>
  )
}

export default FriendBage