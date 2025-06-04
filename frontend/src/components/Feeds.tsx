import React from 'react'
import Feed from './Feed'

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



interface FeedsProps {
  posts: Post[]
}

const Feeds: React.FC<FeedsProps> = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return <p>No posts found.</p>
  }

  return (
    <div>
      {posts.map((post) => (
        <Feed key={post._id} post={post} />
      ))}
    </div>
  )
}

export default Feeds