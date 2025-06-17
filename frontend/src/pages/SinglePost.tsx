import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import type { RootState } from "../store/store";
import axios from "axios";
import { toast } from "react-toastify";
import BookMarkPosts from '../components/BookMarkPosts';
import { MessageCircleMore, Send, Share2, Trash2 } from "lucide-react";
import LikeDislikePost from "../components/LikeDislikePost";
import TimeAgo from "react-timeago";
import ProtileImage from "../components/ProfileImage";

interface Comment {
  _id: string;
  text: string;
  author: {
    _id: string;
    userName: string;
    profilePhoto?: string;
  };
  createdAt: string;
}

interface Post {
  _id: string;
  creator: {
    _id: string;
    userName: string;
    profilePhoto?: string;
  };
  body: string;
  image: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

const SinglePost = () => {
  const {id} = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const token = useSelector((state: RootState) => state?.user?.token);
  const userId = useSelector((state: RootState) => state?.user?.currentUser?._id);
  const [showFeedHeaderMenu, setShowFeedHeaderMenu] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getPost = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/post/${id}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      if(res?.data?.success){
        setPost(res.data.post);
        setComments(res.data.post.comments || []);
      }
    } catch (error: any) {
      console.error(`getPost ERROR:: ${error}`);
      toast.error(error?.response?.data?.message || error?.message || "Sorry! Unable to fetch post data.");
    } finally {
      setIsLoading(false);
    }
  };

  const createComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    try {
      setIsCommenting(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/comment/${id}`,
        { comment },
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      if(res?.data?.success){
        setComments([res?.data?.newComment, ...comments]);
        setComment("");
        toast.success(res.data.message);
      }
    } catch (error: any) {
      console.error(`createComment ERROR:: ${error}`);
      toast.error(error?.response?.data?.message || error?.message || "Sorry! Unable to create comment. Please try again.");
    } finally {
      setIsCommenting(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/comment/${commentId}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      if(res?.data?.success){
        setComments(comments.filter(c => c._id !== commentId));
        toast.success(res.data.message);
      }
    } catch (error: any) {
      console.error(`deleteComment ERROR:: ${error}`);
      toast.error(error?.response?.data?.message || error?.message || "Sorry! Unable to delete comment. Please try again.");
    }
  };

  useEffect(() => {
    getPost();
  }, [id]);

  if (isLoading) return <div className="text-center py-10">Loading post...</div>;
  if (!post) return <div className="text-center py-10">Post not found</div>;

  return (
      <article className='p-4 rounded-md shadow-xl my-4 bg-white dark:bg-gray-800'>
        {/* Post Header */}
        <header className='relative flex items-center justify-between'>
          <Link to={`/user/${post?.creator?._id}`} className='flex items-center gap-3'>
            <ProtileImage image={post?.creator?.profilePhoto} />
            <div>
              <h2 className='font-bold dark:text-white'>{post?.creator?.userName}</h2>
              <p className="text-gray-500 dark:text-gray-300">
                <TimeAgo date={post?.createdAt} />
              </p>
            </div>
          </Link>

          <span 
            className='font-extrabold cursor-pointer dark:text-white' 
            onClick={() => setShowFeedHeaderMenu(!showFeedHeaderMenu)}
          >
            ...
          </span>

          {showFeedHeaderMenu && userId === post?.creator?._id && (
            <menu className='absolute right-1 top-10 flex flex-col gap-2 items-start p-2 rounded-md bg-gray-200 dark:bg-gray-700 shadow-lg z-10'>
              <button className='text-blue-600 dark:text-blue-400 font-semibold'>Edit</button>
              <button className='text-red-600 dark:text-red-400 font-semibold'>Delete</button>
            </menu>
          )}
        </header>

        {/* Post Content */}
        <figure className='w-full mt-4'>
          <figcaption className="mb-3 dark:text-white">
            {post?.body}
          </figcaption>
          {post?.image && (
            <img 
              className='w-full h-auto max-h-[600px] object-cover rounded-md' 
              src={post.image} 
              alt="Post content" 
              loading="lazy"
            />
          )}
        </figure>
        
        {/* Post Actions */}
        <footer className='flex items-center justify-between my-5'>
          <div className='flex gap-5'>
            <LikeDislikePost post={post} />
            <div className='flex gap-1 items-center dark:text-white'>
              <MessageCircleMore size={20} />
              <small>{comments.length}</small>
            </div>
            <button className="dark:text-white">
              <Share2 size={20} />
            </button>
          </div>

          <BookMarkPosts post={post} />
        </footer>

        {/* Comment Form */}
        <form 
          onSubmit={createComment}
          className="w-full flex items-center gap-2 mt-5 my-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-md"
        >
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment..."
            className="flex-1 bg-transparent border-none outline-none resize-none dark:text-white"
            rows={1}
          />
          <button 
            type="submit" 
            disabled={isCommenting || !comment.trim()}
            className="bg-primary p-2 text-gray-200 rounded-md disabled:bg-white disabled:text-gray-800"
          >
            <Send size={20} />
          </button>
        </form>

        {/* Comments List */}
        <ul className="mt-4 space-y-4">
          {comments.map((comment) => (
            <li key={comment._id} className="flex items-start gap-3">
              <ProtileImage image={comment.author?.profilePhoto} size="small" />
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <Link 
                      to={`/user/${comment.author?._id}`} 
                      className="font-semibold dark:text-white"
                    >
                      {comment.author?.userName}
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      <TimeAgo date={comment.createdAt} />
                    </p>
                  </div>
                  {userId === comment.author?._id && (
                    <button 
                      onClick={() => deleteComment(comment._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <p className="mt-1 dark:text-white">{comment.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </article>
  );
};

export default SinglePost;