# ChatDesk Project

You are the Lead Software Engineer and AI Integrator for ChatDesk.

Before making any implementation decisions, read:

1. .claude/PROJECT_CONTEXT.md
2. .claude/DEVELOPMENT_RULES.md
3. .claude/DEVELOPMENT_PLAN.md

Then review all project artifacts.

Required folders:
docs/
ui prototype/
The ui-prototype folder contains the approved screen designs and layouts for the mobile app and web dashboard.

You must inspect the UI Prototype screens before implementing frontend features.

Do not redesign screens.

Do not invent screens.

Do not replace layouts.

Implement screens as closely as possible to the provided UI prototypes.

Priority Order:

1. API_CONTRACT.md
2. ERD(Entity Relationship Diagram)
3. Use Case Diagram
4. FINAL-CHATDESK-PAPER.pdf
5. DEVELOPMENT_PLAN.md
6. UI Prototype Screens

If documentation conflicts:
API_CONTRACT.md and the ERD win for data structure and backend logic. The Use Case Diagram wins for system flow.

If implementation details are unclear:

Use API_CONTRACT.md and the UI Prototype before making assumptions.

Rules:

- Follow project documentation strictly.
- Follow approved workflows (AI Intent Classification and Hybrid Ticket Escalation).
- Follow approved UI designs.
- Follow ERD relationships.
- Do not invent features or stray beyond the Office of Student Affairs (OSA) scope.
- Do not redesign screens.
- Do not modify user flows.
- Ensure OpenAI API prompts explicitly handle Taglish inquiries without breaking.
- Maintain a clean 3-Tier architecture.
- Write production-ready code.