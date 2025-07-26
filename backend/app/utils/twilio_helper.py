from twilio.rest import Client
from flask import current_app
import logging

def get_twilio_client():
    """Initialize and return Twilio client"""
    try:
        account_sid = current_app.config['TWILIO_ACCOUNT_SID']
        auth_token = current_app.config['TWILIO_AUTH_TOKEN']
        
        if not account_sid or not auth_token:
            current_app.logger.warning("Twilio credentials not configured")
            return None
            
        return Client(account_sid, auth_token)
    except Exception as e:
        current_app.logger.error(f"Twilio client initialization failed: {str(e)}")
        return None

def send_crisis_alert(phone_number, message):
    """Send crisis alert via SMS"""
    client = get_twilio_client()
    
    if not client:
        return False
    
    try:
        alert_message = f"""
HEARTOUT CRISIS ALERT

Someone you know may be in crisis and needs immediate support.

Crisis indicators detected: {message}

Please reach out to them immediately or call emergency services.

Crisis Hotline: 988
Emergency: 911

This is an automated alert.
        """.strip()
        
        message = client.messages.create(
            body=alert_message,
            from_=current_app.config['TWILIO_PHONE_NUMBER'],
            to=phone_number
        )
        
        current_app.logger.info(f"Crisis alert sent successfully. SID: {message.sid}")
        return True
        
    except Exception as e:
        current_app.logger.error(f"Crisis alert SMS failed: {str(e)}")
        return False

def send_verification_sms(phone_number, code):
    """Send SMS verification code"""
    client = get_twilio_client()
    
    if not client:
        return False
    
    try:
        message = client.messages.create(
            body=f"Your HeartOut verification code is: {code}. Valid for 10 minutes.",
            from_=current_app.config['TWILIO_PHONE_NUMBER'],
            to=phone_number
        )
        
        current_app.logger.info(f"Verification SMS sent successfully. SID: {message.sid}")
        return True
        
    except Exception as e:
        current_app.logger.error(f"Verification SMS failed: {str(e)}")
        return False

def send_support_notification(phone_number, supporter_name):
    """Send notification when someone receives support"""
    client = get_twilio_client()
    
    if not client:
        return False
    
    try:
        message = client.messages.create(
            body=f"💙 {supporter_name} sent you support on HeartOut. You're not alone. Check the app to see their message.",
            from_=current_app.config['TWILIO_PHONE_NUMBER'],
            to=phone_number
        )
        
        current_app.logger.info(f"Support notification sent successfully. SID: {message.sid}")
        return True
        
    except Exception as e:
        current_app.logger.error(f"Support notification SMS failed: {str(e)}")
        return False