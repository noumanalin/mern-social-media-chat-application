import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../store/store"

 

const MessageList = () => {
    const [conversation, setConversation] = useState([])
    const token = useSelector((state:RootState)=>state?.user?.token)
    const socket = useSelector((state:RootState)=>state?.user?.socket)

  return (
    <>
        MessageList
        {token} <br /> socket:
        {socket}
    </>
  )
}

export default MessageList