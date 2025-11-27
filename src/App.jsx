import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { featuredGroups, posts } from './data/posts'

const navItems = [
  { key: 'about', label: 'about' },
  { key: 'posts', label: 'posts' },
  { key: 'notes', label: 'notes' },
  { key: 'tags', label: 'tags' },
]

const Pill = ({ children }) => (
  <span className="px-3 py-1 rounded-full border border-border bg-panel text-sm text-muted hover:border-accent hover:text-accent transition-colors duration-150">
    {children}
  </span>
)

const Sidebar = ({ currentPage, onNavigate }) => (
  <aside className="hidden md:flex flex-col gap-2 w-32 pt-4">
    {navItems.map((item) => (
      <button
        key={item.key}
        className={`sidebar-link text-left ${currentPage === item.key ? 'active' : ''}`}
        onClick={() => onNavigate(item.key)}
      >
        {item.label}
      </button>
    ))}
  </aside>
)

const MobileNav = ({ currentPage, onNavigate }) => (
  <div className="md:hidden flex flex-wrap items-center gap-2 mb-4">
    {navItems.map((item) => (
      <button
        key={item.key}
        className={`px-3 py-1 rounded-full border text-sm ${
          currentPage === item.key
            ? 'bg-ink text-white border-ink'
            : 'border-border bg-white text-muted'
        }`}
        onClick={() => onNavigate(item.key)}
      >
        {item.label}
      </button>
    ))}
  </div>
)

const FeaturedList = ({ groups, onSelect }) => (
  <div className="mt-6 space-y-3">
    {groups.map((group) => (
      <div key={group.title}>
        <button
          className="text-left text-sm font-semibold text-ink hover:text-accent"
          onClick={() => group.postId && onSelect(group.postId)}
          disabled={!group.postId}
        >
          {group.title}
        </button>
        {group.children && (
          <ul className="mt-2 ml-3 list-disc text-sm text-muted space-y-1">
            {group.children.map((child) => (
              <li key={child.title}>
                <button
                  className="underline-offset-2 hover:text-accent"
                  onClick={() => onSelect(child.postId)}
                >
                  {child.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </div>
)

const PostRow = ({ post, onSelect }) => (
  <button
    onClick={() => onSelect(post.id)}
    className="w-full text-left py-4 dotted-row focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
  >
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-base text-ink hover:text-accent font-medium transition-colors duration-150">
        {post.title}
      </span>
      <span className="text-sm text-muted font-mono">{post.date}</span>
    </div>
  </button>
)

const TagFilter = ({ tags, activeTag, onSelect }) => (
  <div className="flex flex-wrap gap-2">
    <button
      className={`px-3 py-1 rounded-full border text-sm transition-colors duration-150 ${
        !activeTag
          ? 'bg-ink text-white border-ink shadow-sm'
          : 'border-border bg-panel text-muted hover:border-accent hover:text-accent'
      }`}
      onClick={() => onSelect(null)}
    >
      All
    </button>
    {tags.map((tag) => (
      <button
        key={tag.name}
        className={`px-3 py-1 rounded-full border text-sm transition-colors duration-150 ${
          activeTag === tag.name
            ? 'bg-ink text-white border-ink shadow-sm'
            : 'border-border bg-panel text-muted hover:border-accent hover:text-accent'
        }`}
        onClick={() => onSelect(tag.name)}
      >
        {tag.name} <span className="text-xs opacity-70 ml-1">{tag.count}</span>
      </button>
    ))}
  </div>
)

const PostView = ({ post, onBackToList }) => (
  <div className="card p-6 sm:p-10">
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
      <button
        className="underline underline-offset-2 hover:text-accent"
        onClick={onBackToList}
      >
        Back to posts
      </button>
      <span aria-hidden="true">•</span>
      <span className="font-mono">{post.date}</span>
    </div>
    <h1 className="text-2xl sm:text-3xl font-semibold text-ink mt-4">{post.title}</h1>
    <div className="mt-3 flex flex-wrap gap-2">
      {post.tags.map((tag) => (
        <Pill key={tag}>{tag}</Pill>
      ))}
    </div>
    <div className="markdown text-base mt-6 leading-7">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content || post.excerpt}</ReactMarkdown>
    </div>
  </div>
)

const SectionTitle = ({ children }) => (
  <h2 className="text-lg font-semibold text-ink">{children}</h2>
)

const AboutSection = ({ onSelectFeatured }) => (
  <div className="card p-6 sm:p-10">
    <p className="text-sm uppercase tracking-[0.2em] text-muted">Synthesis</p>
    <h1 className="text-3xl font-semibold text-ink mt-2">Syntheist in the Shell</h1>
    <p className="text-xl font-semibold text-ink mt-4">
      Hey, I create and share knowledge with writing.
    </p>
    <p className="text-base text-muted mt-3 leading-7">
      Get in touch via <a className="underline" href="https://t.me">Telegram</a> or drop a note.
      Buy me a drink if you find my content helpful :)
    </p>

    <div className="mt-8">
      <SectionTitle>Featured</SectionTitle>
      <FeaturedList groups={featuredGroups} onSelect={onSelectFeatured} />
    </div>
  </div>
)

const PostsSection = ({ page, postsData, onSelectPost }) => {
  const visible = useMemo(
    () =>
      postsData.filter((post) => (page === 'posts' ? post.category !== 'misc' : post.category === page)),
    [page, postsData],
  )

  const titleMap = {
    posts: 'All Posts',
    notes: 'Notes',
    misc: 'Misc',
  }

  return (
    <div className="card p-6 sm:p-10">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <SectionTitle>
          {titleMap[page]} ({visible.length})
        </SectionTitle>
        <span className="text-sm text-muted">Sorted by date</span>
      </div>
      <div className="mt-4 divide-y divide-border">
        {visible.map((post) => (
          <PostRow key={post.id} post={post} onSelect={onSelectPost} />
        ))}
      </div>
    </div>
  )
}

const TagsSection = ({ postsData, activeTag, onSelectTag, onSelectPost }) => {
  const tags = useMemo(() => {
    const counts = postsData.reduce((acc, post) => {
      post.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    }, {})
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [postsData])

  const filteredPosts = useMemo(() => {
    if (!activeTag) return postsData
    return postsData.filter((post) => post.tags.includes(activeTag))
  }, [activeTag, postsData])

  return (
    <div className="space-y-6">
      <div className="card p-6 sm:p-10">
        <SectionTitle>Filter by Tags</SectionTitle>
        <p className="text-sm text-muted mt-2">
          Explore themes across the archive. Select a tag to filter the list below.
        </p>
        <div className="mt-4">
          <TagFilter tags={tags} activeTag={activeTag} onSelect={onSelectTag} />
        </div>
      </div>

      <div className="card p-6 sm:p-10">
        <SectionTitle>
          {activeTag ? `Posts tagged "${activeTag}" (${filteredPosts.length})` : `All Posts (${filteredPosts.length})`}
        </SectionTitle>
        <div className="mt-4 divide-y divide-border">
          {filteredPosts.map((post) => (
            <PostRow key={post.id} post={post} onSelect={onSelectPost} />
          ))}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [page, setPage] = useState('about')
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [activeTag, setActiveTag] = useState(null)

  const orderedPosts = useMemo(
    () => [...posts].sort((a, b) => b.date.localeCompare(a.date)),
    [],
  )
  const selectedPost = useMemo(
    () => orderedPosts.find((post) => post.id === selectedPostId),
    [selectedPostId, orderedPosts],
  )

  const handleNavigate = (nextPage) => {
    setPage(nextPage)
    setSelectedPostId(null)
    setActiveTag(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSelectPost = (postId) => {
    setSelectedPostId(postId)
    setPage('posts')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const mainContent = (() => {
    if (page === 'about') {
      return <AboutSection onSelectFeatured={handleSelectPost} />
    }

    if (page === 'tags') {
      return (
        <TagsSection
          postsData={orderedPosts}
          activeTag={activeTag}
          onSelectTag={setActiveTag}
          onSelectPost={handleSelectPost}
        />
      )
    }

    if (page === 'posts' && selectedPost) {
      return <PostView post={selectedPost} onBackToList={() => setSelectedPostId(null)} />
    }

    return <PostsSection page={page} postsData={orderedPosts} onSelectPost={handleSelectPost} />
  })()

  return (
    <div className="min-h-screen px-4 md:px-10 py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[140px,1fr] gap-6 md:gap-12">
        <Sidebar currentPage={page} onNavigate={handleNavigate} />
        <main className="space-y-6">
          <MobileNav currentPage={page} onNavigate={handleNavigate} />
          {mainContent}
        </main>
      </div>
    </div>
  )
}

export default App
