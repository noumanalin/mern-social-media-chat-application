import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { toast } from 'react-toastify'
import axios from 'axios'
import FriendBage from './user/FriendBage'

const SuggestedFriends = () => {
    const [friends, setFriends] = useState([])
    const token = useSelector((state:RootState)=>state?.user?.token)
    const userId = useSelector((state:RootState)=>state?.user?.currentUser?._id)

    const getFriends = async () =>{
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/v1/user/users`, {
              withCredentials:true, headers:{Authorization: `Bearer ${token}`}
            })

            const people = await res?.data?.users.filter((person) => {
              if( !person?.followers.includes(userId) && person?._id !== userId){
                console.log("for user interface:", person)
                return person
              }
            })

            setFriends(people)
            console.log(`friends ::: ${friends}`)

        } catch (error) {
            console.log(`getFriends Error:: ${error}`)
            toast.error(error?.message || res?.data?.message || "Sorry! there is an error to fetch suggested friends, try again or Please refresh page, or post an issues on my github account")
            
        }
    }



    useEffect(()=>{
      getFriends()
            console.log(`friends ::: ${friends}`)

    }, [userId])

      const filterFriend = (id)=> {
    setFriends(friends?.filter( f => {
      if(f?._id !== id){
        return f
      }
    }))
  }

  return (
    <div>
      <h1 className='text-primar text-3xl mb-5'>SuggestedFriends</h1>
      {
        friends.length == 0 && <p>No User avilable to show in your 'Suggested Friends' Widgets</p>
      }
      <menu>
      {
        friends && friends.map((friend, index) => (
          <FriendBage key={index} friend={friend} filterFriend={filterFriend} />
        ))
      }
      </menu>

    </div>
  )
}

export default SuggestedFriends