import { Link } from 'react-router-dom'

const FeaturedList = ({ groups }) => (
  <div className="mt-6 space-y-3">
    {groups.map((group) => (
      <div key={group.title}>
        <Link
          className={`text-left text-sm font-semibold text-ink hover:text-accent ${
            group.postId ? '' : 'cursor-default'
          }`}
          to={group.postId ? `/posts/${group.postId}` : '#'}
        >
          {group.title}
        </Link>
        {group.children && (
          <ul className="mt-2 ml-3 list-disc text-sm text-muted space-y-1">
            {group.children.map((child) => (
              <li key={child.title}>
                <Link className="underline-offset-2 hover:text-accent" to={`/posts/${child.postId}`}>
                  {child.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </div>
)

export default FeaturedList
