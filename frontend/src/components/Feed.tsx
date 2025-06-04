import React, { useState } from 'react'
import ProtileImage from './ProtileImage'
import { Link } from 'react-router-dom'
import TimeAgo from 'react-timeago'
import LikeDislikePost from './LikeDislikePost'
import { MessageCircleMore, Share2, Bookmark } from 'lucide-react'
import TrimText from '../helpers/TrimText'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import BookMarkPosts from './BookMarkPosts'

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
}

const Feed: React.FC<FeedProps> = ({ post }) => {
  const token = useSelector((state: RootState) => state?.user?.token)
  const userId = useSelector((state: RootState) => state?.user?.currentUser?._id)
  const [showFeedHeaderMenu, setShowFeedHeaderMenu] = useState(false)


  console.log("Creator Name:", post?.creator?.userName)

  return (
    <article className=' p-2 rounded-md shadow-xl my-4 bg-white dark:bg-gray-600'>
      <header className='relative flex items-center justify-between'>
        <Link to={`/user/${post?.creator?._id}`} className='flex items-center gap-3'>
          <ProtileImage image={post?.creator?.profilePhoto} />
          <div>
            <h2 className='font-bold'>{post?.creator?.userName}</h2>
            <p>
              <TimeAgo date={post?.createdAt} />
            </p>
          </div>
        </Link>

        <span className=' font-extrabold cursor-pointer' onClick={()=> setShowFeedHeaderMenu(!showFeedHeaderMenu)} >...</span>

        {showFeedHeaderMenu && userId === post?.creator?._id &&
          <menu className='absolute right-1 top-10 flex flex-col gap-2 items-start p-2 rounded-md bg-gray-200'>
            <button className='text-primary font-semibold'>Edit</button>
            <button className='text-red-600 font-semibold'>Delete</button>
          </menu>
        }

      </header>

      <figure className='w-full'>
        <Link to={`/post/${post?._id}`}>
          <figcaption>
            <TrimText text={post?.body} maxlength={160} />
          </figcaption>
        </Link>
        {<img className='w-full h-auto max-h-[600px] object-g rounded-md' src={post.image} alt="Post content" loading="lazy"/>}
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
    </article>
  )
}

export default Feed