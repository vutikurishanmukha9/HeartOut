"""
WebSocket Tests - Test real-time notification infrastructure
"""
import pytest
from app.api.v1.websockets import ConnectionManager, manager, notify_reaction, notify_comment


class TestConnectionManager:
    """Test WebSocket connection manager"""
    
    def test_connection_manager_init(self):
        """Test connection manager initialization"""
        cm = ConnectionManager()
        assert cm.active_connections == {}
        assert cm.story_readers == {}
    
    def test_add_reader(self):
        """Test adding a reader to a story"""
        cm = ConnectionManager()
        cm.add_reader(story_id=1, user_id=100)
        
        assert 1 in cm.story_readers
        assert 100 in cm.story_readers[1]
        assert cm.get_reader_count(1) == 1
    
    def test_add_multiple_readers(self):
        """Test adding multiple readers"""
        cm = ConnectionManager()
        cm.add_reader(story_id=1, user_id=100)
        cm.add_reader(story_id=1, user_id=101)
        cm.add_reader(story_id=1, user_id=102)
        
        assert cm.get_reader_count(1) == 3
    
    def test_remove_reader(self):
        """Test removing a reader"""
        cm = ConnectionManager()
        cm.add_reader(story_id=1, user_id=100)
        cm.add_reader(story_id=1, user_id=101)
        
        cm.remove_reader(story_id=1, user_id=100)
        
        assert cm.get_reader_count(1) == 1
        assert 100 not in cm.story_readers[1]
    
    def test_remove_last_reader_cleans_up(self):
        """Test removing last reader cleans up story"""
        cm = ConnectionManager()
        cm.add_reader(story_id=1, user_id=100)
        cm.remove_reader(story_id=1, user_id=100)
        
        assert 1 not in cm.story_readers
    
    def test_get_reader_count_no_readers(self):
        """Test reader count for story with no readers"""
        cm = ConnectionManager()
        assert cm.get_reader_count(999) == 0
    
    def test_disconnect_removes_from_all_stories(self):
        """Test disconnect removes user from all story readers"""
        cm = ConnectionManager()
        cm.add_reader(story_id=1, user_id=100)
        cm.add_reader(story_id=2, user_id=100)
        cm.add_reader(story_id=3, user_id=100)
        
        cm.disconnect(user_id=100)
        
        assert 100 not in cm.story_readers.get(1, set())
        assert 100 not in cm.story_readers.get(2, set())
        assert 100 not in cm.story_readers.get(3, set())
    
    def test_global_manager_exists(self):
        """Test global manager instance exists"""
        assert manager is not None
        assert isinstance(manager, ConnectionManager)


class TestNotificationHelpers:
    """Test notification helper functions"""
    
    @pytest.mark.asyncio
    async def test_notify_reaction_no_connection(self):
        """Test notify_reaction doesn't fail without active connection"""
        # Should not raise even without active connection
        await notify_reaction(
            story_author_id=999,
            story_id="test-id",
            story_title="Test Story",
            reactor_username="testuser",
            reaction_type="love"
        )
    
    @pytest.mark.asyncio
    async def test_notify_comment_no_connection(self):
        """Test notify_comment doesn't fail without active connection"""
        # Should not raise even without active connection
        await notify_comment(
            story_author_id=999,
            story_id="test-id",
            story_title="Test Story",
            commenter_username="testuser",
            comment_preview="This is a comment"
        )
    
    @pytest.mark.asyncio
    async def test_notify_reaction_truncates_long_title(self):
        """Test long titles are truncated"""
        long_title = "A" * 100
        # Should not fail with long title
        await notify_reaction(
            story_author_id=999,
            story_id="test-id",
            story_title=long_title,
            reactor_username="testuser",
            reaction_type="love"
        )
    
    @pytest.mark.asyncio
    async def test_notify_comment_truncates_long_preview(self):
        """Test long comment previews are truncated"""
        long_comment = "B" * 200
        # Should not fail with long comment
        await notify_comment(
            story_author_id=999,
            story_id="test-id",
            story_title="Test",
            commenter_username="testuser",
            comment_preview=long_comment
        )


class TestMultipleStoryReaders:
    """Test multiple stories with multiple readers"""
    
    def test_multiple_stories_multiple_readers(self):
        """Test tracking readers across multiple stories"""
        cm = ConnectionManager()
        
        # Story 1 readers
        cm.add_reader(story_id=1, user_id=100)
        cm.add_reader(story_id=1, user_id=101)
        
        # Story 2 readers
        cm.add_reader(story_id=2, user_id=101)
        cm.add_reader(story_id=2, user_id=102)
        cm.add_reader(story_id=2, user_id=103)
        
        # Story 3 - no readers yet
        
        assert cm.get_reader_count(1) == 2
        assert cm.get_reader_count(2) == 3
        assert cm.get_reader_count(3) == 0
    
    def test_same_user_multiple_stories(self):
        """Test same user reading multiple stories"""
        cm = ConnectionManager()
        
        cm.add_reader(story_id=1, user_id=100)
        cm.add_reader(story_id=2, user_id=100)
        cm.add_reader(story_id=3, user_id=100)
        
        assert 100 in cm.story_readers[1]
        assert 100 in cm.story_readers[2]
        assert 100 in cm.story_readers[3]
    
    def test_duplicate_add_reader_ignored(self):
        """Test adding same reader twice doesn't duplicate"""
        cm = ConnectionManager()
        
        cm.add_reader(story_id=1, user_id=100)
        cm.add_reader(story_id=1, user_id=100)
        cm.add_reader(story_id=1, user_id=100)
        
        # Should still be just 1
        assert cm.get_reader_count(1) == 1
