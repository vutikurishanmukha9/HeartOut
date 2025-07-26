import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Feed from '@pages/Feed'
import CreatePost from '@pages/CreatePost'
import PostDetail from '@pages/PostDetail'
import Drafts from '@pages/Drafts'
import CallRoom from '@pages/CallRoom'

const FeedRoutes = () => {
  return (
    <Routes>
      {/* Main feed */}
      <Route index element={<Feed />} />
      
      {/* Create new post */}
      <Route path="create" element={<CreatePost />} />
      
      {/* Post details */}
      <Route path="post/:id" element={<PostDetail />} />
      
      {/* User drafts */}
      <Route path="drafts" element={<Drafts />} />
      
      {/* Video call room */}
      <Route path="call/:roomId" element={<CallRoom />} />
      
      {/* Search results */}
      <Route path="search" element={<Feed searchMode />} />
      
      {/* Category filtering */}
      <Route path="category/:category" element={<Feed />} />
      
      {/* Tag filtering */}
      <Route path="tag/:tag" element={<Feed />} />
      
      {/* Trending posts */}
      <Route path="trending" element={<Feed trending />} />
      
      {/* Following posts */}
      <Route path="following" element={<Feed following />} />
      
      {/* Catch all - redirect to main feed */}
      <Route path="*" element={<Navigate to="/feed" replace />} />
    </Routes>
  )
}

export default FeedRoutes