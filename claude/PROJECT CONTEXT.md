# CHATDESK - PROJECT CONTEXT
## Overview
ChatDesk is an AI-powered chatbot application designed specifically to automate and streamline Student Affairs services at the University of Science and Technology of Southern Philippines (USTP).

The platform serves USTP students and the Office of Student Affairs (OSA) by providing instant, 24/7 natural language responses to standard inquiries, automatically logging interactions, and seamlessly escalating complex issues to human administrators.

## Technology Stack

Backend:
- Python
- Django
- Django REST Framework
- PostgreSQL
- JWT Authentication

Frontend Web (Admin):
- ReactJS
- Tailwind CSS
- Axios

Frontend Mobile (Student):
- React Native
- Expo
- Axios

Artificial Intelligence:
- OpenAI API (Intent Classification & Taglish Processing)

Deployment:
- DigitalOcean
- GitHub

User Roles
Student
Platform:

Mobile App Only

Capabilities:
- Register & Login (using any valid email address)
- Chat with the AI assistant using Taglish or English
- Automatically generate support tickets when the AI cannot resolve an issue
- View the status of their own escalated tickets
- Access the System Usability Scale (SUS) survey via an external Google Forms link

Restrictions:
- Cannot access the web dashboard
- Cannot view other students' inquiry logs or tickets
- Cannot manage the FAQ Knowledge Base

OSA Admin
Platform:

Web Dashboard Only

Capabilities:
- Monitor overall system analytics and AI performance
- Manage the FAQ Knowledge Base (Create, Edit, Delete entries)
- View real-time Student Chat Inquiry Logs
- Manage Escalated Tickets (Claim via resolved_by, update status, resolve)
- Generate system reports

Core Workflows
AI Chat & Inquiry Logging
1. Student sends a message via the mobile app.
2. The backend securely forwards the message with specific system prompts to the OpenAI API.
3. OpenAI classifies the student's intent against the tbl_faqs database.
4. The backend logs the interaction perfectly in tbl_inquiry_logs (user_message, detected_intent, chatbot_response).
5. The response is displayed on the student's screen.

Ticket Escalation System
1. If the AI detects an unresolved_complex_query, the escalation protocol triggers.
2. The backend creates a new entry in tbl_ticket and strictly links it to the original log_id via a 1-to-1 relationship.
3. The student is informed that a ticket has been created.
4. An OSA Admin claims the ticket on the web dashboard (updating the resolved_by field).
5. The Admin resolves the query manually.

Artificial Intelligence Scope
The system acts strictly as an intent classifier and natural language router, not an open-ended conversational AI.

The development team is responsible for:
1. Writing strict prompt engineering instructions to prevent hallucinations.
2. Ensuring the LLM seamlessly processes Taglish (Tagalog-English).
3. Injecting the dynamic tbl_faqs database into the AI's context window securely.

UI Rules
Approved UI prototypes already exist.

Do not redesign screens.
Do not invent screens.
Follow the provided UI exactly as designed by the frontend team.

Development Rules
When documentation conflicts, follow this strict Priority Order:

1. API_CONTRACT.md
2. ERD (Entity Relationship Diagram)
3. Use Case Diagram
4. Final Paper Manuscript
5. UI Prototype Screens
Always follow project documentation first. Code must fit the database schema and API contract, not the other way around.