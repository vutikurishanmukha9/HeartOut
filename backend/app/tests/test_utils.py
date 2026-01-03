"""
Utility Function Tests
Tests for utility functions and helpers
"""
import pytest
from app.services.story_service import calculate_reading_time


class TestReadingTimeCalculation:
    """Tests for reading time calculation"""
    
    def test_empty_content(self):
        """Test reading time for empty content"""
        result = calculate_reading_time("")
        assert result == 1  # Minimum 1 minute
        
    def test_short_content(self):
        """Test reading time for short content"""
        content = "This is a short text."
        result = calculate_reading_time(content)
        assert result >= 1
        
    def test_medium_content(self):
        """Test reading time for medium content (about 1 min)"""
        # ~200 words = 1 minute
        content = "word " * 200
        result = calculate_reading_time(content)
        assert 1 <= result <= 2
        
    def test_long_content(self):
        """Test reading time for long content"""
        # ~1000 words = 5 minutes
        content = "word " * 1000
        result = calculate_reading_time(content)
        assert result >= 4
        
    def test_returns_int(self):
        """Test reading time returns integer"""
        content = "Some content here"
        result = calculate_reading_time(content)
        assert isinstance(result, int)


class TestEdgeCases:
    """Test edge cases for various utilities"""
    
    def test_whitespace_only_content(self):
        """Test content with only whitespace"""
        result = calculate_reading_time("   \n\t   ")
        assert result == 1
        
    def test_special_characters(self):
        """Test content with special characters"""
        content = "Hello! @#$%^&* World?"
        result = calculate_reading_time(content)
        assert result >= 1
        
    def test_unicode_content(self):
        """Test content with unicode characters"""
        content = "Hello 你好 مرحبا שלום"
        result = calculate_reading_time(content)
        assert result >= 1


class TestWordCounting:
    """Tests for word counting accuracy"""
    
    def test_single_word(self):
        """Test single word content"""
        result = calculate_reading_time("Hello")
        assert result == 1
        
    def test_multiple_spaces(self):
        """Test multiple spaces between words"""
        content = "word1    word2    word3"
        result = calculate_reading_time(content)
        assert result >= 1
        
    def test_newlines(self):
        """Test content with newlines"""
        content = "word1\nword2\nword3"
        result = calculate_reading_time(content)
        assert result >= 1
