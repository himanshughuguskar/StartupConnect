# StartupConnect Team Contribution Guide

## GitHub Repository

All team members use the same GitHub repository.

Repository:

https://github.com/himanshughuguskar/StartupConnect

---

# Branch Rules

Do not directly code on main.

Each member must create a feature branch.

## Branches

Member 1:
main / integration

Member 2:
feature/frontend-ui

Member 3:
feature/google-auth

Member 4:
feature/profile-firestore

Member 5:
feature/matchmaking

Member 6:
feature/realtime-chat

Member 7:
feature/contact-history

Member 8:
feature/testing-deployment

---

# Standard Workflow

1. Pull latest main.

git pull origin main

2. Create/use your feature branch.

3. Write your code.

4. Test your module.

5. Commit your changes.

6. Push your branch.

7. Create a Pull Request.

8. Project Lead reviews the PR.

9. Project Lead merges the PR.

---

# Commit Format

Use:

feat:
fix:
docs:
test:
chore:

Examples:

feat: add Google authentication

feat: add matchmaking service

feat: implement real-time chat

fix: resolve profile update issue

docs: update API documentation

test: test matchmaking API

---

# Important Rules

Do not directly push to main.

Do not change database field names without informing the Project Lead.

Do not change API endpoint names without informing the Project Lead.

Do not change Socket.IO event names without informing the Project Lead.

Do not add new frameworks or databases.

Do not commit .env.

Do not commit node_modules.

Keep your changes related to your assigned module.