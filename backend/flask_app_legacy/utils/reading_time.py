"""
Utility to calculate estimated reading time for stories
"""

def calculate_reading_time(content):
    """
    Calculate estimated reading time based on word count
    
    Args:
        content (str): The story content
        
    Returns:
        int: Estimated reading time in minutes
    """
    if not content:
        return 0
    
    # Average reading speed: 200-250 words per minute
    # Using 225 as a middle ground
    WORDS_PER_MINUTE = 225
    
    # Count words (split by whitespace)
    word_count = len(content.split())
    
    # Calculate minutes, round up to nearest minute
    reading_time = (word_count + WORDS_PER_MINUTE - 1) // WORDS_PER_MINUTE
    
    # Minimum 1 minute for any content
    return max(1, reading_time)


def get_excerpt(content, length=150):
    """
    Get a short excerpt from the story content
    
    Args:
        content (str): The full story content
        length (int): Maximum length of excerpt in characters
        
    Returns:
        str: Excerpt with ellipsis if truncated
    """
    if not content:
        return ""
    
    if len(content) <= length:
        return content
    
    # Find the last space before the length limit
    excerpt = content[:length]
    last_space = excerpt.rfind(' ')
    
    if last_space > 0:
        excerpt = excerpt[:last_space]
    
    return excerpt + "..."
