import re
import requests
from flask import current_app
from typing import Dict, List

# Crisis keywords and phrases
CRISIS_KEYWORDS = [
    'suicide', 'kill myself', 'end it all', 'want to die', 'better off dead',
    'self harm', 'cut myself', 'hurt myself', 'hate myself', 'worthless',
    'no point', 'give up', 'cant go on', "can't take it", 'overdose',
    'jump off', 'hang myself', 'nothing left', 'goodbye world', 'final goodbye'
]

HELP_PHRASES = [
    'need help', 'feeling lost', 'very depressed', 'extremely sad',
    'panic attack', 'anxiety attack', 'mental breakdown', 'falling apart',
    'desperate', 'hopeless', 'overwhelmed', 'cant cope', "can't handle"
]

TOXIC_PATTERNS = [
    r'\b(kill\s+yourself|kys)\b',
    r'\b(go\s+die)\b',
    r'\b(nobody\s+cares)\b',
    r'\b(waste\s+of\s+space)\b',
    r'\b(pathetic|loser|worthless)\b'
]

def check_content_safety(content: str) -> Dict:
    """
    Check content for toxicity and safety issues
    Returns moderation results with scores and flags
    """
    content_lower = content.lower()
    
    # Basic toxicity detection
    toxicity_score = 0.0
    flags = []
    
    # Check for toxic patterns
    for pattern in TOXIC_PATTERNS:
        if re.search(pattern, content_lower):
            toxicity_score += 0.3
            flags.append('toxic_language')
    
    # Check for excessive profanity (basic implementation)
    profanity_words = ['fuck', 'shit', 'damn', 'bitch', 'asshole']  # Basic list
    profanity_count = sum(1 for word in profanity_words if word in content_lower)
    
    if profanity_count > 3:
        toxicity_score += 0.2
        flags.append('excessive_profanity')
    
    # Use Perspective API if available
    perspective_score = get_perspective_api_score(content)
    if perspective_score:
        toxicity_score = max(toxicity_score, perspective_score)
    
    # Determine if content should be flagged
    should_flag = toxicity_score > 0.7 or 'toxic_language' in flags
    
    return {
        'toxicity_score': min(toxicity_score, 1.0),
        'flags': flags,
        'should_flag': should_flag,
        'safe': toxicity_score < 0.3
    }

def analyze_crisis_indicators(content: str) -> Dict:
    """
    Analyze content for crisis indicators and mental health concerns
    Returns crisis assessment with severity and recommended actions
    """
    content_lower = content.lower()
    
    crisis_score = 0
    severity_indicators = []
    detected_keywords = []
    
    # Check for direct crisis keywords
    for keyword in CRISIS_KEYWORDS:
        if keyword in content_lower:
            crisis_score += 2
            detected_keywords.append(keyword)
            if keyword in ['suicide', 'kill myself', 'want to die', 'end it all']:
                severity_indicators.append('suicide_ideation')
            elif keyword in ['self harm', 'cut myself', 'hurt myself']:
                severity_indicators.append('self_harm')
    
    # Check for help-seeking phrases
    for phrase in HELP_PHRASES:
        if phrase in content_lower:
            crisis_score += 1
            detected_keywords.append(phrase)
    
    # Check for emotional distress patterns
    distress_patterns = [
        r'\b(alone|lonely|isolated)\b.*\b(always|forever|never)\b',
        r'\b(pain|hurt|suffering)\b.*\b(unbearable|too much|cant take)\b',
        r'\b(tired|exhausted)\b.*\b(living|trying|fighting)\b'
    ]
    
    for pattern in distress_patterns:
        if re.search(pattern, content_lower):
            crisis_score += 1
            severity_indicators.append('emotional_distress')
    
    # Determine crisis level
    is_crisis = crisis_score >= 3 or any(indicator in ['suicide_ideation', 'self_harm'] 
                                       for indicator in severity_indicators)
    
    # Generate appropriate response message
    if is_crisis:
        if 'suicide_ideation' in severity_indicators:
            message = "Potential suicide ideation detected - immediate intervention recommended"
        elif 'self_harm' in severity_indicators:
            message = "Self-harm indicators detected - urgent support needed"
        else:
            message = "Crisis indicators detected - professional support recommended"
    else:
        message = "Mental health support may be beneficial"
    
    return {
        'is_crisis': is_crisis,
        'crisis_score': crisis_score,
        'severity_indicators': severity_indicators,
        'detected_keywords': detected_keywords,
        'message': message,
        'recommended_actions': get_recommended_actions(severity_indicators, is_crisis)
    }

def get_perspective_api_score(content: str) -> float:
    """
    Get toxicity score from Google's Perspective API
    Returns None if API is not configured or fails
    """
    api_key = current_app.config.get('PERSPECTIVE_API_KEY')
    
    if not api_key:
        return None
    
    try:
        url = f'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key={api_key}'
        
        data = {
            'requestedAttributes': {'TOXICITY': {}},
            'comment': {'text': content}
        }
        
        response = requests.post(url, json=data, timeout=5)
        
        if response.status_code == 200:
            result = response.json()
            toxicity_score = result['attributeScores']['TOXICITY']['summaryScore']['value']
            return float(toxicity_score)
        else:
            current_app.logger.warning(f"Perspective API error: {response.status_code}")
            return None
            
    except Exception as e:
        current_app.logger.error(f"Perspective API request failed: {str(e)}")
        return None

def get_recommended_actions(severity_indicators: List[str], is_crisis: bool) -> List[str]:
    """Get recommended actions based on crisis assessment"""
    actions = []
    
    if is_crisis:
        actions.extend([
            'immediate_professional_help',
            'crisis_hotline_contact',
            'emergency_contact_notification'
        ])
        
        if 'suicide_ideation' in severity_indicators:
            actions.extend([
                'suicide_prevention_resources',
                'emergency_services_consideration'
            ])
        
        if 'self_harm' in severity_indicators:
            actions.append('self_harm_resources')
    else:
        actions.extend([
            'peer_support_connection',
            'mental_health_resources',
            'self_care_suggestions'
        ])
    
    return actions

def get_crisis_resources(user_location: str = 'US') -> Dict:
    """Get crisis resources based on user location"""
    resources = {
        'US': {
            'crisis_hotline': '988',
            'crisis_text': 'Text HOME to 741741',
            'emergency': '911',
            'websites': [
                'https://suicidepreventionlifeline.org',
                'https://www.crisistextline.org'
            ]
        },
        'UK': {
            'crisis_hotline': '116 123',
            'emergency': '999',
            'websites': [
                'https://www.samaritans.org',
                'https://www.mind.org.uk'
            ]
        },
        'IN': {
            'crisis_hotline': '+91 9152987821',
            'emergency': '112',
            'websites': [
                'https://www.vandrevalafoundation.com',
                'https://www.aasra.info'
            ]
        }
    }
    
    return resources.get(user_location, resources['US'])