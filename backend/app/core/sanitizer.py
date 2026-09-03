"""
Security Content Sanitizer
Server-side defense-in-depth sanitization to prevent Stored XSS.
Supports bleach with pure-Python regex fallback for zero-downtime portability.
"""
import re
import html

try:
    import bleach
    HAS_BLEACH = True
except ImportError:
    HAS_BLEACH = False

ALLOWED_TAGS = [
    'p', 'br', 'strong', 'em', 'u', 's', 'strike',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'span', 'div'
]

ALLOWED_ATTRIBUTES = {
    '*': ['class'],
    'a': ['href', 'title', 'target', 'rel']
}

# Regex to strip dangerous tags like <script>, <style>, <iframe>, etc.
DANGEROUS_TAGS_RE = re.compile(
    r'<(script|style|iframe|object|embed|form|input|button|svg|math)[^>]*>.*?</\1>',
    re.IGNORECASE | re.DOTALL
)
INLINE_HANDLERS_RE = re.compile(
    r'\s+(on[a-z]+|javascript:|data:)\s*=\s*["\'][^"\']*["\']',
    re.IGNORECASE
)
ALL_TAGS_RE = re.compile(r'<[^>]+>')


def sanitize_content(text: str) -> str:
    """Sanitize rich content by stripping dangerous tags and scripts."""
    if not text:
        return ""
    if HAS_BLEACH:
        return bleach.clean(
            text,
            tags=ALLOWED_TAGS,
            attributes=ALLOWED_ATTRIBUTES,
            strip=True
        )
    # Pure Python fallback
    clean = DANGEROUS_TAGS_RE.sub('', text)
    clean = INLINE_HANDLERS_RE.sub('', clean)
    return clean


def sanitize_text(text: str) -> str:
    """Sanitize plain text inputs (title, bio, names) by stripping all HTML tags."""
    if not text:
        return ""
    if HAS_BLEACH:
        return bleach.clean(
            text,
            tags=[],
            attributes={},
            strip=True
        )
    # Pure Python fallback
    return ALL_TAGS_RE.sub('', text)
