"""
Reading Time Calculator for Stories
Estimates reading time based on word count
"""


def calculate_reading_time(content: str) -> int:
    """
    Calculate estimated reading time in minutes.
    
    Uses average reading speed of 225 words per minute.
    
    Args:
        content: Story content text
        
    Returns:
        Reading time in minutes (minimum 1)
    """
    if not content:
        return 1
    
    # Count words
    words = len(content.split())
    
    # Average reading speed is 225 words per minute
    reading_time = words // 225
    
    # Minimum 1 minute
    return max(1, reading_time)


def calculate_reading_time_detailed(content: str) -> dict:
    """
    Calculate detailed reading time statistics.
    
    Args:
        content: Story content text
        
    Returns:
        Dict with word_count, reading_time_minutes, reading_speed_used
    """
    if not content:
        return {
            "word_count": 0,
            "reading_time_minutes": 1,
            "reading_speed_wpm": 225
        }
    
    words = len(content.split())
    reading_time = max(1, words // 225)
    
    return {
        "word_count": words,
        "reading_time_minutes": reading_time,
        "reading_speed_wpm": 225
    }
