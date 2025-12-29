import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app
import logging

def send_email(to_email, subject, body, is_html=False):
    """Send email using SMTP configuration from app config"""
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = current_app.config['MAIL_USERNAME']
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Create the body of the message
        if is_html:
            msg.attach(MIMEText(body, 'html'))
        else:
            msg.attach(MIMEText(body, 'plain'))
        
        # Create SMTP session
        server = smtplib.SMTP(current_app.config['MAIL_SERVER'], current_app.config['MAIL_PORT'])
        server.starttls()  # Enable TLS encryption
        server.login(current_app.config['MAIL_USERNAME'], current_app.config['MAIL_PASSWORD'])
        
        # Send email
        text = msg.as_string()
        server.sendmail(current_app.config['MAIL_USERNAME'], to_email, text)
        server.quit()
        
        current_app.logger.info(f"Email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        current_app.logger.error(f"Email sending failed: {str(e)}")
        return False

def send_verification_email(email, user_id):
    """Send email verification link"""
    verification_link = f"https://heartout.com/verify-email?token={user_id}"
    
    subject = "Welcome to HeartOut - Verify Your Email"
    body = f"""
    Welcome to HeartOut!
    
    Thank you for joining our supportive community. To complete your registration, 
    please verify your email address by clicking the link below:
    
    {verification_link}
    
    If you didn't create an account with us, please ignore this email.
    
    Best regards,
    The HeartOut Team
    """
    
    return send_email(email, subject, body)

def send_crisis_notification_email(email, user_name, message):
    """Send crisis notification to emergency contacts"""
    subject = "HeartOut Crisis Alert - Immediate Attention Required"
    body = f"""
    CRISIS ALERT - IMMEDIATE ATTENTION REQUIRED
    
    This is an automated alert from HeartOut. Someone you know ({user_name}) has 
    posted content that indicates they may be in crisis and need immediate support.
    
    Message indicators suggest: {message}
    
    Please reach out to them immediately or contact local emergency services if necessary.
    
    Crisis Hotlines:
    - National Suicide Prevention Lifeline: 988
    - Crisis Text Line: Text HOME to 741741
    
    This alert was generated automatically based on content analysis.
    
    HeartOut Team
    """
    
    return send_email(email, subject, body)