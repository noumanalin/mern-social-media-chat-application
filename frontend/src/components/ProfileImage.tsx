import { CircleUserRound } from "lucide-react"
import React from "react"

interface ProfileImageProps {
  image?: string
}

const ProfileImage: React.FC<ProfileImageProps> = ({ image }) => {
    if(!image){
        return <span className="text-primary"><CircleUserRound size={40} /></span>
    }
  return (
    <>
    <figure>
      <img src={image} alt="profile image" className="w-10 h-10 rounded-full"/>
    </figure>
    </>
  )
}

export default ProfileImage