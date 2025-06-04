import React, { useState } from 'react'
import { Heart } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { toast } from 'react-toastify'
import axios from 'axios'

interface LikeDislikePostProps {
  post: {
    _id: string
    likes: string[]
  }
}

const LikeDislikePost: React.FC<LikeDislikePostProps> = ({ post }) => {
  const token = useSelector((state: RootState) => state?.user?.token)
  const userId = useSelector((state: RootState) => state?.user?.currentUser?._id)
  const [postLiked, setPostLiked] = useState<string | any>(post?.likes?.includes(userId))
  const [likeCount, setLikeCount] = useState(post?.likes?.length || 0)

  const handleLikeDislikePost = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/post/${post._id}/like-dislike`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )

      if (res.data.success) {
        setPostLiked(!postLiked)
        setLikeCount(postLiked ? likeCount - 1 : likeCount + 1)
      }
    } catch (error) {
      toast.error('Failed to like/dislike post')
      console.error('Like/dislike error:', error)
    }
  }

  return (
    <button onClick={handleLikeDislikePost}>
      <Heart fill={postLiked ? 'currentColor' : 'none'} />
      <small>{likeCount}</small>
    </button>
  )
}

export default LikeDislikePost