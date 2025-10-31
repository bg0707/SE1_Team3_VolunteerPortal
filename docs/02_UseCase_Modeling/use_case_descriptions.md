# Use Case Descriptions

## UC-08 - Explore Opportunities
**Actors:** Volunteer (primary), System (secondary)

**Description:** Allows volunteers to discover, search, filter and view detailed information about available volunteering opportunities

**Preconditions**
- Volunteer is authenticated and logged in
- System has active volunteering opportunities
- Volunteer has permissions to view opportunities

**Main Succes Scenario**
1. Volunteer navigates to Opportunities section
2. System displays list of available opportunities with basic info (title, organization, date, location)
3. Volunteer browses through opportunities
4. Volunteer can use search or filter options to narrow down results
5. System updates displayed opportunities based on criteria
6. Volunteer selects an opportunity to view details
7. System displays full opportunity details
8. Volunteer can save opportunity

**Extensions**
- **No opportunities available:**
  1. System displays "No opportunities found
  2. System suggest signing up for notification
- **Search returns no results:**
  1. Systems displays “No matches found” message
  2. System suggests alternative search terms
- **Opportunity is full:**
  1. System displays “Fully booked” status
  2. System offers waitlist option if available

**Postconditions**
- Volunteer has viewed opportunity details
- Opportunity view count may be incremented
- Volunteer may have saved opportunity to favorites

## UC-09 - Register Organization
**Actors:** Nonprofit Organization (primary), Admin (secondary)

**Description:** Allows nonprofit organizations to register and create their profile on the platform to start posting volunteering opportunities

**Preconditions**
- Nonprofit representative has valid email address
- Organization is legitimate and meets platform criteria
- System registration feature is enabled

**Main Succes Scenario**
1. Nonprofit representative clicks "Register Organization"
2. System displays registration form
3. Representative enters organization details (name, address, mission, contact info)
4. Representative uploads verification documents
5. System validates required information
6. Representative creates admin account credentials
7. System submits application for review
8. System admin reviews and approves organization
9. System sends approval notification and setup instructions
10. Organization can now post opportunities

**Extensions**
- **Organization name already exists:**
  1. System suggests alternative name or requests verification
  2. Representative provides additional documentation
- **Missing required information:**
  1. System highlights missing fields
  2. Representative completes required information
- **Application rejected:**
  1. System admin provides rejection reason
  2. System notifies representative
  3. Representative can appeal or correct issues

**Postconditions**
- Organization profile is created (pending or approved status)
- Admin account is established
- Notification is sent to representative
- Organization can access appropriate features based on approval status

## UC-10 - Send Notification
**Actors:** Nonprofit organization (primary), Volunteer (secondary)

**Description:** Allows nonprofit administrators to send notifications to volunteers about opportunity updates, changes, or general announcements

**Preconditions**
- Nonprofit admin is authenticated and logged in
- Organization is approved and active
- There are registered volunteers to notify
- Notification system is operational

**Main Succes Scenario**
1. Nonprofit admin navigates to Notification section
2. System displays notification dashboard and templates
3. Admin selects notification type (opportunity update, reminder, announcement)
4. Admin composes message content and subject
5. Admin selects target users (all volunteers, specific group)
6. Admin chooses delivery method (email, in-app, both)
7. Admin schedules delivery (immediate or scheduled)
8. System validates notification parameters
9. System sends notification to selected users
10. System updates delivery status

**Extensions**
- **No user available:**
  1. System warns admin about empty recipient list
  2. Admin adjusts recipient criteria or cancels
- **Notification content violates guidelines:**
  1. System flags inappropriate content
  2. Admin revises content or appeals flag
- **Delivery fails for some users:**
  1. System retries failed deliveries
  2. System logs delivery failures
  3. Admin can view delivery report with failure details

**Postconditions**
- Notification is delivered to selected recipients
- Delivery status is recorded in system
- Volunteers receive the notification through chosen channels

## UC-11 - Report Listing
**Actors:** Volunteer (primary), Nonprofit organization (secondary)

**Description:** Volunteers can report opportunities that appear innapropriate, misleading or outdated

**Preconditions**
- Volunteer is authenticated and logged in
- Opportunity listing exists and is visible
- Reporting feature is enabled in the system
- Volunteer has viewed the opportunity details

**Main Succes Scenario**
1. Volunteer views an opportunity they wish to report
2. Volunteer clicks "Report This Listing" button
3. System displays reporting form with reason categories
4. Volunteer selects report reason from predefined options
5. Volunteer provides additional details and context in description field
6. Volunteer submits the report

**Extensions**
- **Custom reason required:**
  1. Volunteer selects "Other" reason
  2. System shows additional text field for custom explanation
  3. Volunteer provides detailed reasoning
- **Insufficient information provided:**
  1. System prompts volunteer for additional details
  2. Volunteer completes required information
- **Report is invalid or duplicate:**
  1. System admin marks report as resolved
  2. No action taken on opportunity
  3. Volunteer may receive explanation if appropriate

**Postconditions**
- Report is recorded in system database
- Opportunity is flagged for administrative review
- Volunteer receives confirmation of report submission
- System administrators are notified of pending reports

## UC-01 - Moderate Listings
**Actors:** Admin (primary)

**Description:** Review and moderate reported, expired, or suspicious listings to maintain platform integrity and ensure compliance with content guidelines.

**Preconditions**
- The platform administrator has logged into the system.
- At least one listing has been reported, or detected as expired or suspicious.

**Main Succes Scenario**
1. The administrator navigates into the “Moderation” module.
2. The system displays a list of reported/detected listings, including organization name, report reason, date, and current status.
3. The administrator selects a listing to view its details, including description, attachments, and report history.
4. The administrator chooses an appropriate action:
   - Keep: Mark listing as compliant and close report.
   - Suspend: Temporarily remove the listing from public view.
   - Remove: Permanently remove the listing from the platform.
   - Restore: Reinstate a previously suspended or removed listing.
6. The administrator provides or selects a moderation reason (e.g., spam, expired).
7. The system saves the moderation decision, updates the listing’s status, and logs the action.
8. The system automatically notifies the related organization and/or the reporter about the decision.

**Postconditions**
- The listing status is updated to “Active,” “Suspended,” or “Removed.”
- The system records the moderation action in an audit log.
- Relevant parties (organization owner and/or reporter) are notified of the moderation outcome.

# UC13
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


# UC12
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


# UC14
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
