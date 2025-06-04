import Feed from './Feed.tsx'

const Feeds = ({posts}) => {
    if(posts?.length < 1 ){
        return <p>No posts found.</p>
    }
  return (
    <div>
        { posts?.map((posts, i)=> <Feed key={i} post={post} />)

        }
    </div>
  )
}

export default Feeds