# StartupConnect Socket.IO Events

Socket.IO is used for real-time communication.

## Client → Server

### join_match

Purpose:
Join a match room.

Data:

{
  "matchId": "match123",
  "userId": "uid123"
}

---

### send_message

Purpose:
Send a chat message.

Data:

{
  "matchId": "match123",
  "senderId": "uid123",
  "message": "Hello!"
}

---

### typing

Data:

{
  "matchId": "match123",
  "userId": "uid123"
}

---

### stop_typing

Data:

{
  "matchId": "match123",
  "userId": "uid123"
}

---

# Server → Client

### match_found

Data:

{
  "matchId": "match123",
  "otherUserId": "uid456"
}

---

### new_message

Data:

{
  "matchId": "match123",
  "senderId": "uid123",
  "message": "Hello!",
  "sentAt": "timestamp"
}

---

### user_typing

Data:

{
  "userId": "uid123"
}

---

### user_stopped_typing

Data:

{
  "userId": "uid123"
}

---

### match_ended

Data:

{
  "matchId": "match123"
}

---

## Important Rule

Do not rename Socket.IO events without discussing the change with the Project Lead.