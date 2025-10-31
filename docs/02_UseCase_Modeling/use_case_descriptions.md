# UCO3
---

## Name
Review Applicants

## Actors
Organization

## Goal
View, review, and decide whether to accept volunteer applications to ensure appropriate event attendance and quality standards.

## Preconditions
1. Organization administrator has logged into the system.
2. Applications have already been submitted by volunteers under this organization.

## Postconditions
1. Volunteer application status updated to “Approved” or “Rejected”.
2. The system notifies volunteers of the review results.

## Workflow
1. The administrator navigates to the “Manage Opportunities” module and selects an event.
2. The system displays the volunteer application list for that event (including names, contact information, application time, etc.).
3. The administrator clicks on an application to view details.
4. The administrator selects **Approve** or **Reject**.
5. The system saves the review result and updates the application status.
6. The system automatically sends a notification email or internal message to the volunteer, informing them of the review outcome.


# UCA3
---

## Name
Manage User Access

## Actors
Platform Administrator

## Goal
Deactivate accounts, assign/revoke roles and permissions to ensure platform security and implement least privilege control.

## Preconditions
1. The administrator has been authenticated.

## Postconditions

**If succeeded:**
1. User account status and roles have been updated based on the operation.
2. Audit logs have been generated.
3. Notifications are sent to the user.

**If failed:**
1. No changes, provide the administrator with understandable error messages.

## Workflow
1. Administrators navigate to the “User Access” module.
2. Administrators select the target user.
3. The system displays the user's basic information (email, name, etc.), current status (Active / Deactivated), and role list (Volunteer, Org Admin, Admin, etc.).
4. Administrators perform required actions:
   - Change roles
   - Change status
5. The system performs permission and constraint checks (e.g., cannot delete the last remaining platform administrator).
6. The system persists changes and writes audit logs (who did what to whom, when, and the resulting differences).
7. The system sends notifications to affected users and enforces reauthentication upon next login if necessary.
8. The system displays a “Success” confirmation and updated information to the administrator.

## Exception Flows
1. Permission and constraint check failed.


# UCV3
---

## Name
Manage Applications

## Actors
Volunteer

## Goal
View submitted applications, check status, cancel or modify applications, and review upcoming event details.

## Preconditions
1. The volunteer has logged in.
2. The volunteer has submitted at least one application.

## Postconditions

**If succeeded:**
1. Changes made (cancellations/updated preferences/selected time slots, etc.) have been saved.
2. The list and status have been synchronized.
3. Required notifications have been sent.

**If failed:**
1. No changes, provide the volunteer with understandable error messages.

## Workflow
1. Volunteers open the “My Applications” module.
2. The system displays the application list by time/status (event name, organization, date, location, current status: Pending/Approved/Rejected, etc.).
3. Volunteers click any application to view details (event time, meeting point, contact person, application fields/preferences).
4. Volunteers can perform one of the following actions:
   - **Cancel Registration:** Select reason (optional), confirm cancellation.
   - **Update Information:** Adjust permitted fields like available time slots/notes/preferences.
   - **View Schedule**
5. The system validates the legitimacy of the operation (whether the event is locked, etc.).
6. The system saves changes and refreshes the list and detail statuses.
7. The system sends a confirmation notification to the volunteer and (if required) notifies the event's organizing administrator.

## Exception Flows
1. The operation is illegal.