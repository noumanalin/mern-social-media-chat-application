import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { toast } from 'react-toastify';
import axios from 'axios';

interface LikeDislikePostProps {
  post: {
    _id: string;
    likes: string[];
  };
}

const LikeDislikePost: React.FC<LikeDislikePostProps> = ({ post }) => {
  const token = useSelector((state: RootState) => state.user.token);
  const userId = useSelector((state: RootState) => state.user.currentUser?._id);

  const [likes, setLikes] = useState(post.likes); 
  const [isLoading, setIsLoading] = useState(false);

  const isLiked = likes.includes(userId);
  const likeCount = likes.length;

  const handleLikeDislikePost = async () => {
    if (!token || !userId) return;

    setIsLoading(true);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/post/like-dislike/${post._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        // ✅ Update local likes array
        setLikes(prevLikes =>
          prevLikes.includes(userId)
            ? prevLikes.filter(id => id !== userId)
            : [...prevLikes, userId]
        );

        toast.success(data.message);
      }
    } catch (error) {
      toast.error('Failed to like/dislike post');
      console.error('Like/dislike error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLikeDislikePost} 
      className={`flex gap-1 items-center ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
      disabled={isLoading}
      title={isLiked ? 'Unlike post' : 'Like post'}
    >
      <Heart 
        fill={isLiked ? 'currentColor' : 'none'} 
        className={isLiked ? 'text-red-500' : 'text-gray-500'}
      />
      <small>{likeCount}</small>
    </button>
  );
};

export default LikeDislikePost;
