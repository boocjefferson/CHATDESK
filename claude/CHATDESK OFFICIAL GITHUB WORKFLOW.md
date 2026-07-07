CHATDESK OFFICIAL GITHUB WORKFLOW
Repository Branches
main
develop
Feature Branches:
feature/*
Examples:
feature/jwt-authentication
feature/ai-intent-classification
feature/ticket-escalation-api
feature/student-chat-ui
feature/admin-dashboard

Never commit directly to:  
main
develop
Only work on feature branches.  

PHASE 1 — BEFORE CODING
Every developer must do this before starting work.  
Step 1
Switch to develop.
git checkout develop  

Step 2
Pull latest changes.
git pull origin develop
This ensures your local copy is updated.
Do this EVERY DAY before coding.  

Step 3
Create your feature branch.
Example:
git checkout -b feature/jwt-authentication
or
git checkout -b feature/student-chat-ui
The branch name should describe the task.  

Step 4
Push branch to GitHub.
git push -u origin feature/jwt-authentication
Now GitHub can track your branch.  

PHASE 2 — DURING DEVELOPMENT
Work only inside your feature branch.  
Verify branch:
git branch
Current branch should be:
feature/your-feature  
Never code inside:  
main
develop

Commit Frequently
Small commits are better.
Example:
git add .
git commit -m "feat: create chat UI component"
Later:
git add .
git commit -m "feat: link chat UI to OpenAI endpoint"
Avoid huge commits.

Sync With Team Changes
Before continuing work each day:
Update develop.
git checkout develop
git pull origin develop
Return to your branch.
git checkout feature/jwt-authentication
Merge latest develop.
git merge develop
Resolve conflicts if necessary.
This keeps your branch updated.

PHASE 3 — BEFORE PUSHING
Before every push:  
Checklist:
✓ Project runs
✓ No errors  
✓ No secrets committed (e.g., OpenAI API Keys)  
✓ No .env committed  
✓ No unnecessary files  
✓ Code follows project requirements (API_CONTRACT.md)  
✓ UI follows approved prototype  
✓ Use cases followed  

Push Changes
git push origin feature/jwt-authentication

PHASE 4 — PULL REQUEST
When feature is complete:
Go to GitHub.  

Create Pull Request:
feature/jwt-authentication -> develop  

NOT:
feature/jwt-authentication -> main  

Pull Request Template
Title:
Authentication Module
Description:
Completed:  JWT LoginJWT 
Registration
Password Validation  

Tested:  
Login  
Registration  
No known issues. 

PHASE 5 — CODE REVIEW
Reviewer checks:
✓ Feature works  
✓ No bugs  
✓ UI matches prototype  
✓ Use case followed  
✓ No unnecessary code  
✓ No broken functionality  
For ChatDesk:
Jefferson & Veejay should review PRs whenever possible to ensure architectural alignment with the API Contract and ERD.

PHASE 6 — MERGE
After approval:  
feature/* -> develop  

Delete feature branch after merge.
The feature branch has already served its purpose.

PHASE 7 — CONTINUOUS TESTING
Whenever develop receives new code:
All developers should:
git checkout develop
git pull origin develop

Verify:
Project still runs  
No integration issues  
No API conflicts  

PHASE 8 — RELEASE
At the end of a sprint:
Develop branch should contain:
Tested code  
Integrated code  
Working features  

When Sprint is complete:
develop -> main

Only merge to main when:
✓ Sprint objectives completed  
✓ Integration tested  
✓ No critical bugs  
✓ Team approval  

DAILY DEVELOPER ROUTINE

Every Morning
git checkout develop
git pull origin develop
git checkout feature/my-task
git merge develop

Start coding  
Before Lunch
git add .
git commit -m "feat: progress update"

End of Day
git add .
git commit -m "feat: completed [specific task]"
git push origin feature/my-task
Never leave uncommitted work.  

CHATDESK TEAM ROLES
Jefferson 
Full Stack Lead/Backend
Reviews Pull Requests
Handles Integration
Handles Deployment
Handles Database Architecture & OpenAI Integration

Veejay
Full Stack Lead/Backend
Reviews Pull Requests
Handles Integration
Handles Deployment
Handles Database Architecture & OpenAI Integration

Zaki
Keith
Frontend

IMPORTANT RULESNever:
git push origin main  Never:
git push origin develop  Never:
Work directly in main  Never:
Work directly in develop  Always:
develop -> feature/* -> develop -> main  This workflow must be followed throughout the entire development phase. 