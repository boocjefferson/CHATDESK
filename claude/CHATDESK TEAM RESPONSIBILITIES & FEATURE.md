CHATDESK TEAM RESPONSIBILITIES & FEATURE BRANCHES
Jefferson (Lead Full-Stack / Backend Developer)
Responsibilities:
System Architecture & ERD Management
OpenAI API Integration & Prompt Engineering
Database Schema Management (PostgreSQL)
Pull Request Reviews & System Integration
Server Deployment (DigitalOcean)
Example Feature Branches:
feature/project-setup
feature/database-schema
feature/openai-intent-classification
feature/taglish-prompt-engineering
feature/deployment-config

Veejay (Full-Stack / Backend Developer)
Responsibilities:
JWT Authentication Logic
FAQ Knowledge Base APIs
Ticket Escalation Workflow Logic
Inquiry Logging APIs
System Analytics APIs
Example Feature Branches:
feature/jwt-authentication
feature/faq-api-endpoints
feature/ticket-escalation-logic
feature/inquiry-logging
feature/analytics-aggregation

Keith (Frontend Developer - React Native)
Responsibilities:
Student Mobile App UI/UX
Mobile Authentication Integration
AI Chat Interface
Ticket History Views
Google Forms SUS Integration
Example Feature Branches:
feature/mobile-auth-ui
feature/mobile-chat-screen
feature/mobile-ticket-history
feature/mobile-sus-survey-link
feature/mobile-navigation

Zaki (Frontend Developer - ReactJS)
Responsibilities:
OSA Admin Web Dashboard UI/UX
Web Authentication Integration
Ticket Management Kanban/Table UI
FAQ Management UI
System Reports & Analytics Dashboard
Example Feature Branches:
feature/web-auth-ui
feature/web-admin-layout
feature/web-ticket-board
feature/web-faq-manager
feature/web-analytics-dashboard


Example Sprint Workflow
Sprint 1: Baseline & Auth
Jefferson: feature/project-setup
Veejay: feature/jwt-authentication
Keith: feature/mobile-auth-ui
Zaki: feature/web-auth-ui
All branches
↓
develop

Sprint 2: AI & Ticketing Core
Jefferson: feature/openai-intent-classification
Veejay: feature/ticket-escalation-logic
Keith: feature/mobile-chat-screen
Zaki: feature/web-ticket-board
All branches
↓
develop

Sprint 3: Evaluation & Polish
Jefferson: feature/deployment-config
Veejay: feature/analytics-aggregation
Keith: feature/mobile-sus-survey-link
Zaki: feature/web-analytics-dashboard
All branches
↓
develop
↓
main

IMPORTANT RULES
These are example branches only.
Create a feature branch only when work begins.
Do not pre-create all feature branches.  Feature branch lifecycle:

Create
↓
Develop
↓
Commit
↓
Push
↓
Pull Request
↓
Merge into develop
↓
Delete branch