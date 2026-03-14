from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class ContactSubmission(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=5000)
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="new")  # new, read, replied
    
class ContactSubmissionResponse(BaseModel):
    success: bool
    message: str
    submission_id: Optional[str] = None