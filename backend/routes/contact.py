from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse
from models.contact import ContactSubmission, ContactSubmissionResponse, FileUploadResponse
from services.email_service import email_service
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional
import os
import logging
import shutil
from pathlib import Path
import uuid

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/contact", tags=["contact"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'portfolio')]
contact_collection = db['contact_submissions']

# File upload directory
UPLOAD_DIR = Path("/app/backend/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/upload", response_model=FileUploadResponse)
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a file for project collaboration
    """
    try:
        # Generate unique filename
        file_ext = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logger.info(f"File uploaded: {unique_filename}")
        
        return FileUploadResponse(
            success=True,
            filename=file.filename,
            file_path=str(unique_filename)
        )
        
    except Exception as e:
        logger.error(f"File upload failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload file"
        )

@router.post("", response_model=ContactSubmissionResponse)
async def submit_contact_form(
    name: str = Form(...),
    email: str = Form(...),
    message: str = Form(...),
    project_type: Optional[str] = Form(None),
    complexity: Optional[str] = Form(None),
    technologies: Optional[str] = Form(None),  # JSON string
    timeline: Optional[str] = Form(None),
    files: Optional[str] = Form(None),  # JSON string of file paths
):
    """
    Handle enhanced contact form submission with AI suggestions
    """
    try:
        # Parse JSON fields
        import json
        tech_list = json.loads(technologies) if technologies else []
        files_list = json.loads(files) if files else []
        
        # Create submission
        submission = ContactSubmission(
            name=name,
            email=email,
            message=message,
            project_type=project_type,
            complexity=complexity,
            technologies=tech_list,
            timeline=timeline,
            files=files_list
        )
        
        # Store in database
        submission_dict = submission.dict()
        result = await contact_collection.insert_one(submission_dict)
        submission_id = str(result.inserted_id)
        
        logger.info(f"Enhanced submission stored with ID: {submission_id}")
        
        # Send email notification
        email_sent = email_service.send_contact_email(
            name=submission.name,
            email=submission.email,
            message=submission.message
        )
        
        if email_sent:
            logger.info("Email notification sent successfully")
        
        return ContactSubmissionResponse(
            success=True,
            message="Thank you! Your project details have been received. I'll review and get back to you soon.",
            submission_id=submission_id
        )
        
    except Exception as e:
        logger.error(f"Error processing submission: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process your submission. Please try again later."
        )

@router.get("/submissions")
async def get_all_submissions(skip: int = 0, limit: int = 50):
    """
    Get all contact submissions (admin endpoint)
    """
    try:
        submissions = await contact_collection.find().sort("submitted_at", -1).skip(skip).limit(limit).to_list(length=limit)
        
        # Convert ObjectId to string
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

@router.get("/files/{filename}")
async def get_file(filename: str):
    """
    Download uploaded file
    """
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)
