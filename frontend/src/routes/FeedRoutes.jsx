import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Feed from '../pages/Feed';
import CreatePost from '../pages/CreatePost';
import PostDetail from '../pages/PostDetail';
import Drafts from '../pages/Drafts';

export default function FeedRoutes() {
  return (
    <Routes>
      <Route index element={<Feed />} />
      <Route path="create" element={<CreatePost />} />
      <Route path="story/:id" element={<PostDetail />} />
      <Route path="drafts" element={<Drafts />} />
      <Route path="*" element={<Navigate to="/feed" replace />} />
    </Routes>
  );
}