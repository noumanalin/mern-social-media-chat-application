import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { toast } from "react-toastify";
import axios from "axios";
import CreatePost from "../components/CreatePost";
import Feeds from "../components/Feeds";
import FeedSkeleton from "../components/FeedSkeleton";

interface User {
  _id: string;
  name: string;
  image: string;
}

interface Post {
  _id: string;
  body: string;
  image?: string;
  createdAt: string;
  creator: User;
  likes: string[];
  comments: any[];
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const token = useSelector((state: RootState) => state?.user?.token);

  const createNewPost = async (formData: FormData) => {
    setError("");
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/post`, 
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.success || response?.status === 201) {
        const newPost = response.data.post;
        setPosts([newPost, ...posts]);
        toast.success(response.data.message || "Post created successfully!");
      }
    } catch (error: any) {
      console.error('Create post error:', error);
      const errorMessage = error.response?.data?.message || "Failed to create post";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

const getPosts = async () => {
  setIsLoading(true);
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/post/all-posts`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Posts data:', res.data); // Add logging
    setPosts(res?.data?.posts || []);
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    toast.error(error.response?.data?.message || "Failed to fetch posts");
  } finally {
    setIsLoading(false);
  }
}
  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <CreatePost createNewPost={createNewPost} error={error}  />

      {isLoading ? (
      [...Array(3)].map((_, i) => <FeedSkeleton key={i} />)
    ) : (
      <Feeds posts={posts} />
    )}

    </div>
  );
};

export default Home;