import { Link } from 'react-router-dom'

const PostRow = ({ post }) => (
  <Link
    to={`/posts/${post.id}`}
    className="block w-full text-left py-4 dotted-row focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
  >
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-base text-ink hover:text-[#398cff] font-medium transition-colors duration-150">
        {post.title}
      </span>
      <span className="text-sm text-muted font-mono">{post.date}</span>
    </div>
  </Link>
)

export default PostRow
