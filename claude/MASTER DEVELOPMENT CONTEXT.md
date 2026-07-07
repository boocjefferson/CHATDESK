CHATDESK – MASTER DEVELOPMENT CONTEXT
Project Overview
Project Name: ChatDesk  
ChatDesk is an AI-powered chatbot application designed specifically to automate and streamline Student Affairs services at the University of Science and Technology of Southern Philippines (USTP).
The system aims to provide instant, 24/7 answers to student inquiries, log interactions, and seamlessly escalate complex, unresolved issues to human administrators through a centralized digital platform.

Estimated Users:
- USTP Students
- Office of Student Affairs (OSA) Administrators


The system consists of:
- Mobile Application
    - Student
- Web Application
    - OSA Admin
- Backend API
    - Django REST Framework
    - PostgreSQL
- AI Component
    - OpenAI API Integration
    - Intent Classification and Taglish Processing 


Project Objectives
The system will:  
- Digitize and automate standard Student Affairs inquiries.
- Provide instant natural language responses using a dynamic FAQ Knowledge Base.
- Log all AI and user interactions for system analytics.
- Automatically generate support tickets for inquiries the AI cannot resolve.
- Provide an intuitive web dashboard for administrators to manage tickets, update FAQs, and view system reports.

Technology Stack
Backend: 
Python  
Django  
Django REST Framework  
PostgreSQL  
JWT Authentication

Web Frontend:
ReactJS
Tailwind CSS  
Axios

Mobile Frontend:
React Native  
Expo  
Axios

Artificial Intelligence:
OpenAI API
Prompt Engineering (Context Injection)

Evaluation Integration:
Google Forms (System Usability Scale)

Deployment & Version Control
DigitalOcean  
GitHub

Repository Structure
chatdesk/
├── backend/
├── web/
├── mobile/
└── docs/

Authentication
Authentication is handled entirely by Django REST Framework.  
Authentication Features:
Login
Register
Logout 
JWT Access Token
JWT Refresh Token
Role-Based Access Control is required 
Roles: 
Student
Admin
Note: Students may register using any valid email address; it is not restricted to the USTP domain.

User Roles
Student
Mobile App Only.
Student Features:
Login
Register
Chat Interface (Direct interaction with AI)
Ticket History (View status of their own escalated tickets)
Provide System Feedback

Students cannot:
Access the web dashboard.
Manage FAQs.
View other students' tickets or inquiry logs.

OSA Admin
Admin uses Web Application only.
Admin Features:
Dashboard  
FAQ Knowledge Base Management
Ticket Management (View, assign resolved_by, update status)
Inquiry Logs Monitoring
Analytics  
Reports

Admin Responsibilities:
Create, Edit, and Delete FAQs to improve AI accuracy.
Resolve escalated student tickets.
View system analytics.  

Core Workflows
Chat Interaction & Inquiry Logging
The core AI interaction is fully automated.
Workflow:
1. Student submits a message (Taglish supported).
2. Backend sends the message and system instructions to the OpenAI API.
3. OpenAI attempts to classify the intent against the tbl_faqs knowledge base.
4. Backend logs the exact interaction in tbl_inquiry_logs (user_message, detected_intent, chatbot_response, is_escalated).
5. Response is returned to the student.

Ticket Escalation System
Purpose: Ensure no student query goes unanswered.
Workflow:
1. If OpenAI returns a detected_intent of unresolved_complex_query, escalation triggers automatically.
2. The backend creates a new entry in tbl_ticket, permanently linking it to the specific log_id.
3. The AI informs the student that a ticket has been created.
4. An OSA Admin claims the ticket on the web dashboard (updating resolved_by).
5. The Admin resolves the issue, updating the ticket status.

System Usability Scale (SUS) Evaluation
The SUS survey is offloaded entirely to Google Forms.
The React Native mobile app simply provides a button that opens the external URL. No custom survey screens or API endpoints are to be built for this feature.

Database Rules
The database schema must strictly adhere to the approved Entity Relationship Diagram (ERD).
Core Tables: tbl_user, tbl_inquiry_logs, tbl_ticket, tbl_faqs.

UI Development Rules
Approved UI prototypes already exist.  
Do NOT redesign the UI.  
Do NOT invent new screens.  
Do NOT replace workflows.  
Implement screens according to:  
UI Prototype  
API_CONTRACT.md
ERD  
Follow the approved design closely.  

Requirement Priority
When conflicts occur, follow this strict Priority Order:  
1. API_CONTRACT.md
2. ERD (Entity Relationship Diagram)  
3. Use Case Diagram  
4. Final Paper Manuscript
5. UI Prototype Screens  
6. Always follow project documentation first.  

Git Workflow
Permanent Branches:
main
develop
Feature branches are created only when development begins.  
Workflow
feature/* -> develop -> main
Never commit directly to main.  

Claude's Role
Claude acts as:  
Lead Software Engineer  
Solution Architect  
Backend Architect  
Frontend Architect

Claude must:  
Follow project documents strictly.  
Follow approved UI designs.  
Follow use cases exactly.  
Maintain clean 3-Tier architecture.  
Write scalable code.  
Add validation and error handling.  
Maintain RESTful APIs.
Do not invent features.  
Do not modify workflows.  
Build exactly what is defined by the project's approved documentation.