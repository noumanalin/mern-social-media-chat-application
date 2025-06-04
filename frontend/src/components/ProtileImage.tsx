import React from "react"

interface ProtileImageProps {
  image?: string
}

const ProtileImage: React.FC<ProtileImageProps> = ({ image }) => {
    if(!image){
        return <p>No Image</p>
    }
  return (
    <img src={image} alt="" />
  )
}

export default ProtileImage