import React, { useState } from 'react'
import ProfileImage from './ProfileImage'
import { Link } from 'react-router-dom'
import TimeAgo from 'react-timeago'
import LikeDislikePost from './LikeDislikePost'
import { MessageCircleMore, Share2, Bookmark } from 'lucide-react'
import TrimText from '../helpers/TrimText'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import BookMarkPosts from './BookMarkPosts'
import axios from 'axios'
import { toast } from 'react-toastify'
import Modal from './Modal'

interface FeedProps {
  post: {
    _id: string
    body: string
    image?: string
    createdAt: string
    creator: {
      _id: string
      userName: string
      profilePhoto: string
    }
    likes: string[]
    comments: any[]
  }
  onDelete?: (postId: string) => void
  onEdit?: (postId: string, body: string) => void
  isDeleting?: boolean
}

const Feed: React.FC<FeedProps> = ({ post, onDelete, onEdit, isDeleting }) => {
  const token = useSelector((state: RootState) => state?.user?.token)
  const userId = useSelector((state: RootState) => state?.user?.currentUser?._id)
  const [showFeedHeaderMenu, setShowFeedHeaderMenu] = useState(false);
  const [body, setBody] = useState(post?.body)

    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);



  return (
    <article className=' p-2 rounded-md shadow-xl my-4 bg-white dark:bg-gray-600'>
      <header className='relative flex items-center justify-between'>
        <Link to={`/user/${post?.creator?._id}`} className='flex items-center gap-3'>
          <ProfileImage image={post?.creator?.profilePhoto} />
          <div>
            <h2 className='font-bold'>{post?.creator?.userName}</h2>
            <p>
              <TimeAgo date={post?.createdAt} />
            </p>
          </div>
        </Link>

        {userId === post?.creator?._id &&
        <button className=' font-extrabold cursor-pointer' onClick={()=> setShowFeedHeaderMenu(!showFeedHeaderMenu)} >...</button>
        }{showFeedHeaderMenu && userId === post?.creator?._id &&
          <menu className='absolute right-1 top-10 flex flex-col gap-2 items-start p-2 rounded-md bg-gray-200'>
            <button onClick={openModal} className='text-primary font-semibold'>Edit</button>
            <button onClick={() => onDelete(post._id)} className='text-red-600 font-semibold'>{`${isDeleting ? "Deleting Post..." : "Delete"}`}</button>
          </menu>
        }

      </header>

      <figure className='w-full'>
        <Link to={`/post/${post?._id}`}>
          <figcaption>
            <TrimText text={post?.body} maxlength={160} />
          </figcaption>
        </Link>
        {<img className='w-full h-auto aspect-auto rounded-md my-5' src={post.image} alt="Post content" loading="lazy"/>}
      </figure>
      
      <footer className='flex items-center justify-between my-5'>
        <div className='flex  gap-5'>
          <LikeDislikePost post={post} />
          <Link to={`/post/${post?._id}`} className='flex gap-1'>
            <MessageCircleMore /> <small>{post?.comments?.length}</small>
          </Link>
          <button>
            <Share2 />
          </button>
        </div>

        <BookMarkPosts post={post} />
        

      </footer>



        <Modal isOpen={isOpen} onClose={closeModal}>
  <form onSubmit={(e) => {
    e.preventDefault();
    onEdit(post?._id,  body );  
    closeModal();
  }}>
    <h2 className="text-xl font-semibold mb-4">Edit Post</h2>
    <textarea 
      value={body} 
      onChange={(e) => setBody(e.target.value)} 
      className="w-full p-2 mb-3 rounded-md min-h-[200px] bg-gray-100 outline-none text-gray-800" 
      rows={3}
    />
    <button type="submit" className="web-parymary-btn px-3 py-1 rounded-md">
      Update 
    </button>
  </form>
</Modal>



    </article>
  )
}

export default Feed