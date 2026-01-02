"""
WebSocket Manager for Real-Time Features
- Real-time notifications (reactions, comments)
- Live reader tracking
"""

from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, Set, Optional
import json
import asyncio


class ConnectionManager:
    """Manages WebSocket connections for real-time notifications"""
    
    def __init__(self):
        # Map user_id to their WebSocket connection
        self.active_connections: Dict[int, WebSocket] = {}
        # Map story_id to set of user_ids currently reading
        self.story_readers: Dict[int, Set[int]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: int):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self.active_connections[user_id] = websocket
    
    def disconnect(self, user_id: int):
        """Remove a WebSocket connection"""
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        # Also remove from any story reader lists
        for story_id, readers in self.story_readers.items():
            readers.discard(user_id)
    
    async def send_notification(self, user_id: int, notification: dict):
        """Send a notification to a specific user"""
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_json(notification)
            except Exception:
                # Connection might be closed, remove it
                self.disconnect(user_id)
    
    async def broadcast_to_users(self, user_ids: list, notification: dict):
        """Send notification to multiple users"""
        for user_id in user_ids:
            await self.send_notification(user_id, notification)
    
    # Live Reader Tracking
    def add_reader(self, story_id: int, user_id: int):
        """Track a user reading a story"""
        if story_id not in self.story_readers:
            self.story_readers[story_id] = set()
        self.story_readers[story_id].add(user_id)
    
    def remove_reader(self, story_id: int, user_id: int):
        """Remove a user from story readers"""
        if story_id in self.story_readers:
            self.story_readers[story_id].discard(user_id)
            # Clean up empty sets
            if not self.story_readers[story_id]:
                del self.story_readers[story_id]
    
    def get_reader_count(self, story_id: int) -> int:
        """Get the number of users currently reading a story"""
        return len(self.story_readers.get(story_id, set()))
    
    async def broadcast_reader_count(self, story_id: int):
        """Broadcast updated reader count to all readers of a story"""
        count = self.get_reader_count(story_id)
        readers = self.story_readers.get(story_id, set())
        
        for user_id in readers:
            await self.send_notification(user_id, {
                "type": "reader_count",
                "story_id": story_id,
                "count": count
            })


# Global connection manager instance
manager = ConnectionManager()


# Helper functions for sending notifications
async def notify_reaction(
    story_author_id: int,
    story_id: int,
    story_title: str,
    reactor_username: str,
    reaction_type: str
):
    """Send notification when someone reacts to a story"""
    await manager.send_notification(story_author_id, {
        "type": "reaction",
        "story_id": story_id,
        "story_title": story_title[:50] + "..." if len(story_title) > 50 else story_title,
        "from_user": reactor_username,
        "reaction_type": reaction_type,
        "message": f"{reactor_username} reacted to your story"
    })


async def notify_comment(
    story_author_id: int,
    story_id: int,
    story_title: str,
    commenter_username: str,
    comment_preview: str
):
    """Send notification when someone comments on a story"""
    await manager.send_notification(story_author_id, {
        "type": "comment",
        "story_id": story_id,
        "story_title": story_title[:50] + "..." if len(story_title) > 50 else story_title,
        "from_user": commenter_username,
        "comment_preview": comment_preview[:100] + "..." if len(comment_preview) > 100 else comment_preview,
        "message": f"{commenter_username} commented on your story"
    })
