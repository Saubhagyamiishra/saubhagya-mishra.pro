import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        self.smtp_username = os.environ.get('SMTP_USERNAME', '')
        self.smtp_password = os.environ.get('SMTP_PASSWORD', '')
        self.from_email = os.environ.get('FROM_EMAIL', self.smtp_username)
        self.to_email = os.environ.get('TO_EMAIL', 'saubhagyamiishra@gmail.com')
        
    def send_contact_email(self, name: str, email: str, message: str) -> bool:
        """Send contact form submission via email"""
        
        # Check if email is configured
        if not self.smtp_username or not self.smtp_password:
            logger.warning("Email not configured. Skipping email send.")
            return False
            
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f'New Contact Form Submission from {name}'
            msg['From'] = self.from_email
            msg['To'] = self.to_email
            msg['Reply-To'] = email
            
            # Create HTML content
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
                        <h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px;">
                            New Contact Form Submission
                        </h2>
                        
                        <div style="background-color: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
                            <p style="margin: 10px 0;">
                                <strong style="color: #6366f1;">Name:</strong> {name}
                            </p>
                            <p style="margin: 10px 0;">
                                <strong style="color: #6366f1;">Email:</strong> 
                                <a href="mailto:{email}" style="color: #06b6d4;">{email}</a>
                            </p>
                            <p style="margin: 10px 0;">
                                <strong style="color: #6366f1;">Message:</strong>
                            </p>
                            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; border-left: 4px solid #8b5cf6; margin-top: 10px;">
                                <p style="margin: 0; white-space: pre-wrap;">{message}</p>
                            </div>
                        </div>
                        
                        <div style="margin-top: 20px; padding: 15px; background-color: #e0e7ff; border-radius: 8px;">
                            <p style="margin: 0; font-size: 14px; color: #4f46e5;">
                                💡 <strong>Quick Reply:</strong> Simply reply to this email to respond directly to {name}.
                            </p>
                        </div>
                        
                        <div style="margin-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                            <p>Sent from your portfolio contact form</p>
                        </div>
                    </div>
                </body>
            </html>
            """
            
            # Attach HTML content
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
                
            logger.info(f"Contact email sent successfully from {email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            return False

email_service = EmailService()