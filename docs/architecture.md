# StartupConnect Architecture

## 1. Project Overview

StartupConnect is a beginner-friendly networking platform that randomly connects startups and investors for real-time networking.

Users authenticate using Google through Firebase Authentication.

Users can:

1. Sign in with Google
2. Select Startup or Investor
3. Create/update their profile
4. Find a random match
5. Chat in real time
6. Request contact exchange
7. Accept/reject contact exchange
8. View previous sessions

---

## 2. Technology Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Real-Time Communication
- Socket.IO

### Authentication
- Firebase Authentication
- Google Login

### Database
- Firebase Firestore

### Testing
- Chrome DevTools
- Postman

### Version Control
- Git
- GitHub

### Deployment
- Render

---

## 3. High-Level Architecture

Browser
↓
Frontend HTML/CSS/JavaScript
↓
Express REST API
↓
Firebase Authentication / Firestore

Browser
↓
Socket.IO
↓
Node.js Server
↓
Real-Time Match/Chat

---

## 4. Application Flow

Google Login
↓
Role Selection
↓
Profile Creation
↓
Find Random Match
↓
Match Found
↓
Real-Time Chat
↓
Contact Exchange
↓
Session Ends
↓
Session History

---

## 5. User Roles

Startup:
- Startup profile
- Company information
- Industry
- Description

Investor:
- Investor profile
- Investment interests
- Industry preferences
- Description

The role values are:

- `startup`
- `investor`

---

## 6. Important Rule

Firebase Authentication UID is the primary identifier for users throughout the application.

Do not create a second user ID system.