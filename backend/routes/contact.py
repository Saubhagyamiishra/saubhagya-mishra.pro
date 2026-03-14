from fastapi import APIRouter, HTTPException, status
from models.contact import ContactSubmission, ContactSubmissionResponse
from services.email_service import email_service
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/contact", tags=["contact"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'portfolio')]
contact_collection = db['contact_submissions']

@router.post("", response_model=ContactSubmissionResponse)
async def submit_contact_form(submission: ContactSubmission):
    """
    Handle contact form submission:
    1. Store in database
    2. Send email notification
    """
    try:
        # Store in database
        submission_dict = submission.dict()
        result = await contact_collection.insert_one(submission_dict)
        submission_id = str(result.inserted_id)
        
        logger.info(f"Contact submission stored with ID: {submission_id}")
        
        # Send email notification
        email_sent = email_service.send_contact_email(
            name=submission.name,
            email=submission.email,
            message=submission.message
        )
        
        if email_sent:
            logger.info("Email notification sent successfully")
        else:
            logger.warning("Email notification failed - credentials may not be configured")
        
        return ContactSubmissionResponse(
            success=True,
            message="Thank you for reaching out! I'll get back to you soon.",
            submission_id=submission_id
        )
        
    except Exception as e:
        logger.error(f"Error processing contact submission: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process your submission. Please try again later."
        )

@router.get("/submissions")
async def get_all_submissions(skip: int = 0, limit: int = 50):
    """
    Get all contact submissions (admin endpoint - you may want to add authentication)
    """
    try:
        submissions = await contact_collection.find().skip(skip).limit(limit).to_list(length=limit)
        
        # Convert ObjectId to string for JSON serialization
        for submission in submissions:
            submission['_id'] = str(submission['_id'])
            
        return {
            "success": True,
            "count": len(submissions),
            "submissions": submissions
        }
    except Exception as e:
        logger.error(f"Error fetching submissions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch submissions"
        )