# API Contracts - Portfolio Contact Form

## Backend Implementation

### Contact Form Endpoint

**POST** `/api/contact`

**Request Body:**
```json
{
  "name": "string (1-100 chars, required)",
  "email": "string (valid email, required)",
  "message": "string (1-5000 chars, required)"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Thank you for reaching out! I'll get back to you soon.",
  "submission_id": "mongodb_object_id"
}
```

**Response (Error - 500):**
```json
{
  "detail": "Failed to process your submission. Please try again later."
}
```

### Features Implemented

1. **Database Storage:**
   - All contact submissions are stored in MongoDB
   - Collection: `contact_submissions`
   - Fields: name, email, message, submitted_at, status

2. **Email Notifications:**
   - Sends formatted HTML email to configured recipient
   - Includes sender's name, email, and message
   - Reply-To header set to sender's email for easy response
   - Gracefully handles missing email configuration (logs warning, continues)

3. **Email Configuration:**
   - SMTP_SERVER (default: smtp.gmail.com)
   - SMTP_PORT (default: 587)
   - SMTP_USERNAME (your email)
   - SMTP_PASSWORD (app password for Gmail)
   - FROM_EMAIL (sending email)
   - TO_EMAIL (recipient - default: saubhagyamiishra@gmail.com)

## Frontend Integration

### Contact Component Changes

**File:** `/app/frontend/src/components/Contact.jsx`

**Changes Made:**
- Replaced mock setTimeout with real axios POST request
- Calls `/api/contact` endpoint
- Handles success and error responses
- Shows toast notifications with backend messages
- Clears form on successful submission

**Form Validation:**
- Required fields: name, email, message
- Email validation handled by HTML5 and backend
- Submit button disabled during submission

## Email Setup Instructions

### For Gmail:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Update `/app/backend/.env`:
   ```
   SMTP_USERNAME="your-email@gmail.com"
   SMTP_PASSWORD="generated-app-password"
   FROM_EMAIL="your-email@gmail.com"
   TO_EMAIL="saubhagyamiishra@gmail.com"
   ```
4. Restart backend: `sudo supervisorctl restart backend`

### Email Template

The HTML email includes:
- Professional header with purple branding
- Sender's name and email (with mailto link)
- Message in formatted box
- Quick reply tip
- Mobile-responsive design

## Testing

### Test the Contact Form:

1. Navigate to contact section on portfolio
2. Fill in: Name, Email, Message
3. Click "Send Message"
4. Should see success toast
5. Check MongoDB for stored submission
6. Check email inbox (if configured)

### Backend Test (curl):

```bash
curl -X POST http://localhost:8001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

### View All Submissions (Admin):

**GET** `/api/contact/submissions?skip=0&limit=50`

Returns all contact submissions from database (consider adding authentication for production).

## Notes

- Email sending is optional - form works without email configuration
- All submissions are stored in database regardless of email status
- Email failures are logged but don't prevent submission success
- Frontend shows backend error messages to user
- Backend validates email format using Pydantic EmailStr
