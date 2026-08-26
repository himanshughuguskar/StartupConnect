# StartupConnect REST API

Base URL:

http://localhost:3000/api

Authentication:

Protected APIs will use:

Authorization: Bearer <Firebase ID Token>

---

# User APIs

## Get User Profile

GET /api/users/:uid

Response:

{
  "uid": "uid123",
  "email": "user@gmail.com",
  "displayName": "User",
  "role": "startup",
  "companyName": "Example Startup",
  "bio": "Building innovative solutions"
}

---

## Create User Profile

POST /api/users

Request:

{
  "role": "startup",
  "companyName": "Example Startup",
  "bio": "Building innovative solutions",
  "industry": "Technology",
  "location": "India",
  "website": "https://example.com"
}

---

## Update User Profile

PUT /api/users/:uid

---

# Matchmaking APIs

## Find Random Match

POST /api/matches/find

Request:

{
  "role": "startup"
}

Response:

{
  "success": true,
  "matchId": "match123",
  "userId": "uid456"
}

---

## End Match

POST /api/matches/:matchId/end

Response:

{
  "success": true
}

---

# Contact APIs

## Request Contact Exchange

POST /api/contacts/request

Request:

{
  "matchId": "match123",
  "receiverId": "uid456"
}

---

## Accept Contact Request

POST /api/contacts/:contactId/accept

---

## Reject Contact Request

POST /api/contacts/:contactId/reject

---

# Session History

## Get Session History

GET /api/matches/history/:uid