import { useMemo } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Shell from './layouts/Shell'
import About from './pages/About'
import PostList from './pages/PostList'
import PostDetail from './pages/PostDetail'
import Tags from './pages/Tags'
import { posts } from './data/posts'

function App() {
  const orderedPosts = useMemo(() => [...posts].sort((a, b) => b.date.localeCompare(a.date)), [])

  return (
    <Routes>
      <Route path="/" element={<Shell posts={orderedPosts} />}>
        <Route index element={<About />} />
        <Route path="posts" element={<PostList page="posts" posts={orderedPosts} />} />
        <Route path="tags" element={<Tags />} />
        <Route path="posts/:postId" element={<PostDetail />} />
        <Route path="about" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
