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

## UC-08 - Send Notification
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
