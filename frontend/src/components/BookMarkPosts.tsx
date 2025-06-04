import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Bookmark } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { updateBookmarks } from '../store/user-slice.js'


interface BMPosts {
    post: {
        _id: string,
    }
}

const BookMarkPosts: React.FC<BMPosts> = ({ post }) => {
    const token = useSelector((state: RootState) => state?.user?.token)
    const userId = useSelector((state: RootState) => state?.user?.currentUser?._id)
    const userBookMarked = useSelector((state: RootState) => state?.user?.currentUser?.bookmarks)
    const [isBookMarked, setIsBookMarked] = useState(false)
    const dispatch = useDispatch()


    // Sync with Redux state on mount and when userBookMarked changes
    useEffect(() => {
        setIsBookMarked(userBookMarked?.includes(post?._id) ?? false)
    }, [userBookMarked, post?._id])

   const handleToggleBookMark = async () => {
  if (!token || !userId) return;

  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/post/${post?._id}/add-bookmark`,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (data.success) {
      setIsBookMarked(prev => !prev);
      dispatch(updateBookmarks(post._id)); // ✅ Toggle Redux state
      toast.success(data.message);
    }
  } catch (error) {
    console.error('BookMark API ERROR:', error);
    toast.error(error.response?.data?.message || "Failed to update bookmark");
  }
};


    return (
        <button
            onClick={handleToggleBookMark}
            className=''
            title={isBookMarked ? "Remove From Bookmarks" : "Add to Bookmarks"}
        >
            <Bookmark 
                className={isBookMarked ? "text-black dark:text-gray-100" : ""}
                fill={isBookMarked ? "currentColor" : "none"}
            />
        </button>
    )
}

export default BookMarkPosts