import axios from "axios"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import type { RootState } from "../store/store";
import Feed from "../components/Feed";
import FeedSkeleton from "../components/FeedSkeleton";

interface Post {
  _id: string;
  body: string;
  image?: string;
  createdAt: string;
  creator: {
    _id: string;
    userName: string;
    profilePhoto?: string;
  };
  likes: string[];
  comments: any[];
}

const Bookmarks = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const token = useSelector((state: RootState) => state?.user?.token);
  const userId = useSelector((state: RootState) => state?.user?.currentUser?._id);

  const getBookMarks = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/v1/user/${userId}/bookmarks`, 
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data?.success) {
        setPosts(res.data.bookmarks || []);
      }
    } catch (error: any) {
      console.error('getBookMarks API ERROR:', error);
      toast.error(error?.response?.data?.message || error?.message || "Sorry! There was an error fetching your bookmarks");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (userId) {
      getBookMarks();
    }
  }, [userId]);



if (isLoading) {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <FeedSkeleton key={i} />
      ))}
    </div>
  );
}

  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        You have no bookmarked posts
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Feed key={post._id} post={post} />
      ))}
    </div>
  );
}

export default Bookmarks;