# StartupConnect Database Structure

Database: Firebase Firestore

## Collection: users

Document ID:
Firebase Authentication UID

Fields:

- uid
- email
- displayName
- photoURL
- role
- bio
- companyName
- industry
- location
- website
- createdAt
- updatedAt
- isOnline

Role values:

- startup
- investor

---

## Collection: matches

Fields:

- matchId
- user1Id
- user2Id
- status
- startedAt
- endedAt

Status values:

- active
- ended

user1Id and user2Id contain Firebase Authentication UIDs.

---

## Collection: messages

Fields:

- messageId
- matchId
- senderId
- receiverId
- message
- sentAt

Every message belongs to a match using matchId.

---

## Collection: contacts

Fields:

- contactId
- matchId
- requesterId
- receiverId
- status
- requesterEmail
- receiverEmail
- createdAt

Status values:

- pending
- accepted
- rejected

Contact information must only be exchanged after the request is accepted.

---

## Important Database Rules

1. Firebase UID is the user identifier.
2. Do not create duplicate user IDs.
3. Match documents reference users using their Firebase UID.
4. Messages reference matches using matchId.
5. Contact requests reference matches using matchId.
6. Timestamps should use Firestore timestamps.