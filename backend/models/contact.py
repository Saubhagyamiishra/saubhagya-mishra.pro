from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List

class ContactSubmission(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=5000)
    project_type: Optional[str] = None
    complexity: Optional[str] = None
    technologies: Optional[List[str]] = []
    timeline: Optional[str] = None
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="new")  # new, reviewed, replied
    files: Optional[List[str]] = []  # file URLs/paths
    
class ContactSubmissionResponse(BaseModel):
    success: bool
    message: str
    submission_id: Optional[str] = None
    
class FileUploadResponse(BaseModel):
    success: bool
    filename: str
    file_path: str
