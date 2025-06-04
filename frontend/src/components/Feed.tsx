import React, { useState } from 'react'
import ProtileImage from './ProtileImage'
import { Link } from 'react-router-dom'
import TimeAgo from 'react-timeago'
import LikeDislikePost from './LikeDislikePost'
import { MessageCircleMore, Share2 } from 'lucide-react'
import TrimText from '../helpers/TrimText'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'

interface FeedProps {
  post: {
    _id: string
    body: string
    image?: string
    createdAt: string
    creator: {
      _id: string
      name: string
      image: string
    }
    likes: string[]
    comments: any[]
  }
}

const Feed: React.FC<FeedProps> = ({ post }) => {
  const token = useSelector((state: RootState) => state?.user?.token)
  const userId = useSelector((state: RootState) => state?.user?.currentUser?._id)
  const [showFeedHeaderMenu, setShowFeedHeaderMenu] = useState(false)

  return (
    <article>
      <header>
        <Link to={`/user/${post?.creator?._id}`}>
          <ProtileImage image={post?.creator?.image} />
          <div>
            <h2>{post?.creator?.name}</h2>
            <p>
              <TimeAgo date={post?.createdAt} />
            </p>
          </div>
        </Link>

        {showFeedHeaderMenu && userId === post?.creator?._id && (
          <menu>
            <button>Edit</button>
            <button>Delete</button>
          </menu>
        )}
      </header>

      <figure>
        <Link to={`/posts/${post?._id}`}>
          <figcaption>
            <TrimText text={post?.body} maxlength={160} />
          </figcaption>
        </Link>
        {post?.image && <img src={post.image} alt="Post content" />}
      </figure>
      
      <footer>
        <div>
          <LikeDislikePost post={post} />
          <Link to={`/posts/${post?._id}`}>
            <MessageCircleMore /> <small>{post?.comments?.length}</small>
          </Link>
          <button>
            <Share2 />
          </button>
        </div>
      </footer>
    </article>
  )
}

export default Feed