# API Documentation (Human‑Readable)

Base URL (production):
- `https://volunteer-portal-hcccfygngna9eph0.francecentral-01.azurewebsites.net/api`

Base URL (local):
- `http://localhost:3001/api`

Auth:
- Most protected endpoints require `Authorization: Bearer <JWT>`
- Login returns `{ token, user }`

---

## Authentication

### POST /authentication/login
Login and get a JWT.
Request body:
```
{ "email": "user@example.com", "password": "secret" }
```
Response:
```
{ "message": "...", "token": "...", "user": { ... } }
```

### POST /authentication/register/volunteer
Register a volunteer.
Request body:
```
{ "email": "...", "password": "...", "fullName": "...", "age": 22 }
```

### POST /authentication/register/organization
Register an organization.
Request body:
```
{ "email": "...", "password": "...", "organizationName": "...", "description": "..." }
```

### POST /authentication/forgot-password
Request reset token.
Request body:
```
{ "email": "user@example.com" }
```

### POST /authentication/reset-password
Reset password with token.
Request body:
```
{ "token": "...", "newPassword": "..." }
```

---

## Opportunities

### GET /opportunities
List opportunities (public).
Query params:
- `search` (string)
- `categoryId` (number)
- `location` (string)
- `date` (YYYY-MM-DD)

### GET /opportunities/:id
Get opportunity by ID (public).

### GET /opportunities/my-opportunities
Get opportunities for the authenticated organization.
Auth: required (organization)

### POST /opportunities
Create opportunity (organization).
Auth: required (organization)
Accepts multipart with optional `image` file.
Body fields:
```
{ "title": "...", "description": "...", "location": "...", "date": "...", "categoryId": 1 }
```

### PUT /opportunities/:id
Update opportunity (organization).
Auth: required (organization)
Accepts multipart with optional `image` file.

### DELETE /opportunities/:id
Delete opportunity (organization).
Auth: required (organization)

---

## Applications

### POST /applications/apply
Apply to an opportunity.
Request body:
```
{ "volunteerId": <volunteerId>, "opportunityId": <id> }
```

### GET /applications/volunteer/:volunteerId
List applications for a volunteer.

### GET /applications/opportunity/:opportunityId
List applications for an organization’s opportunity.
Auth: required (organization)

### PATCH /applications/:applicationId/status
Accept/reject an application.
Auth: required (organization)
Request body:
```
{ "decision": "accepted" | "rejected" }
```

### PATCH /applications/:applicationId/cancel
Cancel an application (volunteer).
Auth: required

---

## Categories

### GET /categories
List categories.

---

## Reports

### POST /reports
Report an opportunity (volunteer).
Auth: required (volunteer)
Request body:
```
{ "opportunityId": <id>, "content": "..." }
```

---

## Notifications

### GET /notifications
List notifications for current user.
Auth: required

### PATCH /notifications/:notificationId/read
Mark notification as read.
Auth: required

---

## Users

### PUT /users/me
Update current user profile.
Auth: required
Request body (fields are optional by role):
```
{ "fullName": "...", "age": 22, "organizationName": "...", "description": "...", "password": "..." }
```

---

## Password Reset (alternate routes)

These exist in addition to `/authentication/forgot-password` and `/authentication/reset-password`.

### POST /password-reset/request
Request reset token.
Request body:
```
{ "email": "user@example.com" }
```

### POST /password-reset/reset
Reset password with token.
Request body:
```
{ "token": "...", "newPassword": "..." }
```

---

## Admin

All routes require admin token.

### GET /admin/reported-opportunities
List reported opportunities.

### POST /admin/opportunities/:opportunityId/moderate
Moderate an opportunity.
Request body:
```
{ "decision": "keep" | "remove" | "suspend" | "unsuspend", "reason": "..." }
```

### GET /admin/organizations/pending
List pending organizations.

### POST /admin/organizations/:organizationId/review
Approve/reject organization.
Request body:
```
{ "decision": "accept" | "reject" }
```

### GET /admin/organizations
List organizations (with filters).

### GET /admin/organizations/:organizationId
Organization details.

### GET /admin/opportunities
List all opportunities (admin view).

### GET /admin/users
List users (filters: search, role, status, limit, offset).

### GET /admin/users/:userId
User details.

### PATCH /admin/users/:userId/status
Update user status.
Request body:
```
{ "status": "active" | "suspended" | "deactivated" }
```

### GET /admin/activity-logs
List activity logs (filters: action, actorUserId, limit, offset).
