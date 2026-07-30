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
  "school_id": "2021-00123",
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
    "course": "BSIT",
    "school_id": "2021-00123"
  },
  "access": "jwt_access_token_string",
  "refresh": "jwt_refresh_token_string"
}
# school_id must be unique - register returns 400 with a school_id validation
# error if it's already taken (same pattern as the email uniqueness check).

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

### POST /api/v1/auth/password-reset/request/
Public. Mobile "Forgot Password" step 1. Emails a 6-digit code (10 min expiry)
to the account if one exists and is active. Always responds the same way
regardless of whether the email is registered - never confirms/denies
account existence.

Request: { "email": "student@gmail.com" }
Response 200: { "message": "If that email is registered, a password reset code has been sent." }
# Dev fallback: until backend/.env's EMAIL_HOST_PASSWORD holds a real Gmail
# App Password (settings.PASSWORD_RESET_EMAIL_ENABLED is False), the response
# also includes "dev_code": "123456" so the flow is testable without real
# email delivery. Remove reliance on dev_code once email sending is live -
# it will stop appearing automatically once the App Password is set.

### POST /api/v1/auth/password-reset/confirm/
Public. Mobile "Forgot Password" step 2. Verifies the emailed code and sets
a new password. Code is single-use; a successful reset invalidates any
other outstanding codes for that user.

Request:
{
  "email": "student@gmail.com",
  "code": "123456",
  "new_password": "newsecurepassword123"
}
Response 200: { "message": "Password has been reset. You can now log in." }
Response 400 (wrong/expired/already-used code, or unknown email):
{ "error": "validation_error", "message": "Invalid request parameters.", "details": { "code": ["Invalid or expired code."] } }
# Not on the original ERD - tbl_password_reset_code added post-Sprint-1-baseline
# to support this flow; flagged for the team to fold into the next ERD revision.

## User Profile (Referenced by other endpoints)
{
  "user_id": 1,
  "email": "student@gmail.com",
  "first_name": "Jefferson",
  "last_name": "Booc",
  "role": "student",
  "course": "BSIT",
  "school_id": "2021-00123",
  "is_active": true,
  "last_login": "2026-07-20T09:12:00Z",
  "created_at": "2026-06-15T08:00:00Z"
}
# Note: course and school_id are nullable for admin accounts. school_id is
# unique per user (added post-Sprint-1-baseline; not on the original ERD -
# flagged for the team to fold into the next ERD revision). is_active and
# last_login are Django's built-in AbstractUser fields, now surfaced for the
# admin User Management screen below - last_login is null until the user's
# first login after this field started being stamped.

## User Management (Admin Dashboard)
Admin only. Manages the same tbl_user accounts students log into on mobile -
deactivating a user here immediately blocks their next login attempt.

Method,Path,Notes
GET,/api/v1/users/,"List users. ?search= (name/email), ?role=student|admin, ?status=active|inactive."
POST,/api/v1/users/,"Create a student or admin account directly (admin picks the role; distinct from public self-registration)."
GET,/api/v1/users/{user_id}/,Detail view.
PATCH,/api/v1/users/{user_id}/,"Edit first_name/last_name/role/course/school_id/is_active. An admin cannot deactivate or demote their own account (403)."
DELETE,/api/v1/users/{user_id}/,"Remove an account. An admin cannot delete their own account (403)."

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
  "resolution": null,
  "created_at": "2026-06-15T10:16:00Z",
  "resolved_at": null
}
# resolution: the admin's written answer, set via PATCH alongside status. Null
# until an admin responds. Not on the original ERD - added post-Sprint-1-
# baseline to fulfill the "add resolution notes" PATCH behavior already
# described below; flagged for the team to fold into the next ERD revision.

Method,Path,Roles,Notes
GET,/api/v1/tickets/,admin,"List all tickets, supports ?status= and ?category= filters."
GET,/api/v1/tickets/?creator=me,student,Student's own escalated tickets.
POST,/api/v1/tickets/,student,Manual ticket creation (if student bypasses AI).
GET,/api/v1/tickets/{ticket_id}/,all,Detail view (students can only view their own).
PATCH,/api/v1/tickets/{ticket_id}/,admin,"Update ticket status, assign resolved_by, or add resolution notes."

## Analytics (Admin Dashboard)

### GET /api/v1/analytics/overview/
Admin only. Optional ?date_from=, ?date_to= (YYYY-MM-DD) to scope the range.
{
  "total_inquiries": 128,
  "total_escalations": 34,
  "resolution_rate": 0.82,
  "intent_frequencies": [
    { "intent": "scholarship_requirements", "count": 45 },
    { "intent": "unresolved_complex_query", "count": 34 }
  ],
  "tickets_by_status": { "pending": 5, "active": 3, "resolved": 26 }
}



## Out of scope for this version (tracked for later contract revisions)
- OpenAI API prompt engineering and system instructions injection — Sprint 2
- System Usability Scale (SUS) survey data endpoints — Sprint 3 