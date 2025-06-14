import { CircleUserRound } from "lucide-react"
import React from "react"

interface ProtileImageProps {
  image?: string
}

const ProtileImage: React.FC<ProtileImageProps> = ({ image }) => {
    if(!image){
        return <span className="text-primary"><CircleUserRound size={40} /></span>
    }
  return (
    <img src={image} alt="profile image" className="w-10 h-10 rounded-full"/>
  )
}

export default ProtileImage