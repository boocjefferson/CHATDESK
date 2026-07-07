# ChatDesk API Contract — v0.1 (Sprint 1 Baseline)

Covers: Authentication, the unified dynamic User model, FAQ Knowledge Base management, Inquiry Logging (AI chat history), and the Core Ticketing Escalation workflow. Advanced OpenAI intent context injection, analytics aggregation, and SUS evaluation reporting are NOT in this version — they will be handled in Sprint 2.

This is the agreed shape that the Django backend developer will build against, and the React Native (mobile) and ReactJS (web) developers will consume. Changing a field name or endpoint path after the sprint starts requires updating this file and notifying the other devs — don't silently drift.

--

## Conventions
- Base URL: /api/v1/
- All request/response bodies: JSON
- Auth header: Authorization: Bearer <access_token>
- Timestamps: ISO 8601 UTC (2026-06-17T10:00:00Z)
- List endpoints are paginated:

{
  "count": 128,
  "next": "/api/v1/tickets/?page=2",
  "previous": null,
  "results": [ ... ]
}

- Error shape (consistent across all endpoints):

{
  "error": "validation_error",
  "message": "Invalid request parameters.",
  "details": { "email": ["This field must be a valid email address."] }
}

## Authentication

### POST /api/v1/auth/register/
Public. Creates a student account. admin accounts are created manually via the Django superuser terminal by the system administrator. Note: Students can register using ANY valid email address (Gmail, Yahoo, etc.); it is not restricted to the USTP domain.

Request:
{
  "email": "student@gmail.com",
  "password": "securepassword123",
  "first_name": "Jefferson",
  "last_name": "Booc",
  "course": "BSIT"
}
Response 201:
{
  "user": { 
    "user_id": 1, 
    "email": "student@gmail.com", 
    "first_name": "Jefferson",
    "last_name": "Booc",
    "role": "student", 
    "course": "BSIT" 
  },
  "access": "jwt_access_token_string",
  "refresh": "jwt_refresh_token_string"
}

### POST /api/v1/auth/login/
Public.
Request: { "email": "string", "password": "string" }
Response 200: Same shape as the register response.

### POST /api/v1/auth/token/refresh/
Public (requires valid refresh token).
Request: { "refresh": "jwt_refresh_token_string" } → Response 200: { "access": "new_jwt_access_string" }

### POST /api/v1/auth/logout/
Auth required. Blacklists the refresh token.
Request: { "refresh": "jwt_refresh_token_string" } → Response 205.

### GET /api/v1/auth/me/
Auth required. Returns the current authenticated user's profile.

## User Profile (Referenced by other endpoints)
{
  "user_id": 1,
  "email": "student@gmail.com",
  "first_name": "Jefferson",
  "last_name": "Booc",
  "role": "student",
  "course": "BSIT",
  "created_at": "2026-06-15T08:00:00Z"
}
# Note: course is nullable for admin accounts.

## FAQ (Knowledge Base)
{
  "faq_id": 105,
  "user_id": 2, 
  "intent_keyword": "scholarship_requirements",
  "question_text": "What are the requirements for the academic scholarship?",
  "answer_content": "To apply for the academic scholarship, you must submit your Certificate of Registration, a 2x2 ID picture, and your previous semester's grades to the OSA office.",
  "category": "Scholarship",
  "created_at": "2026-06-10T09:00:00Z",
  "updated_at": "2026-06-15T14:30:00Z",
  "updated_by": 2
}
category enum: Enrollment, Scholarship, Clearance, Discipline, General.

Method,Path,Roles,Notes
GET,/api/v1/faqs/,all,"List FAQs, supports ?category= filter."
POST,/api/v1/faqs/,admin,Create a new FAQ entry.
GET,/api/v1/faqs/{faq_id}/,all,Detail view.
PATCH,/api/v1/faqs/{faq_id}/,admin,Edit FAQ (automatically updates updated_at and updated_by).
DELETE,/api/v1/faqs/{faq_id}/,admin,Remove obsolete FAQ.

## Chat Interaction & Inquiry Logging
This handles the core AI interaction. The frontend posts a message, the backend hits the OpenAI API, logs the interaction in tbl_inquiry_logs, and returns the response.

## POST /api/v1/chat/ask/
Auth required (Student).

Request:
{
  "message": "Pano mag apply ng scholarship?"
}
Response 200 (Successful AI Resolution):
{
  "log_id": 5042,
  "detected_intent": "scholarship_requirements",
  "reply": "To apply for the academic scholarship, you must submit your Certificate of Registration...",
  "is_escalated": false
}
Response 201 (AI Failed, Ticket Escalation Triggered):
{
  "log_id": 5043,
  "detected_intent": "unresolved_complex_query",
  "reply": "I'm sorry, I couldn't find the exact procedure for that. I have automatically created a support ticket for you. An OSA staff member will review your concern shortly.",
  "is_escalated": true,
  "ticket_id": 890
}
# GET /api/v1/inquiry-logs/
Admin only. Returns raw logs for system analytics.
{
  "log_id": 5042,
  "user_id": 1,
  "user_message": "Pano mag apply ng scholarship?",
  "detected_intent": "scholarship_requirements",
  "chatbot_response": "To apply for the academic scholarship...",
  "is_escalated": false,
  "timestamp": "2026-06-15T10:15:00Z"
}
## Ticket Escalation
{
  "ticket_id": 890,
  "user_id": 1,
  "resolved_by": null,
  "log_id": 5043,
  "subject_category": "Unresolved Inquiry",
  "issue_description": "Student asked: 'Paano ko ma-waive ang late enrollment fee ko dahil sa medical emergency?' - AI could not resolve.",
  "status": "pending",
  "created_at": "2026-06-15T10:16:00Z",
  "resolved_at": null
}

Method,Path,Roles,Notes
GET,/api/v1/tickets/,admin,"List all tickets, supports ?status= and ?category= filters."
GET,/api/v1/tickets/?creator=me,student,Student's own escalated tickets.
POST,/api/v1/tickets/,student,Manual ticket creation (if student bypasses AI).
GET,/api/v1/tickets/{ticket_id}/,all,Detail view (students can only view their own).
PATCH,/api/v1/tickets/{ticket_id}/,admin,"Update ticket status, assign resolved_by, or add resolution notes."

## Out of scope for this version (tracked for later contract revisions)
- Analytics aggregation endpoints for the admin dashboard — Sprint 2
- OpenAI API prompt engineering and system instructions injection — Sprint 2
- System Usability Scale (SUS) survey data endpoints — Sprint 3 