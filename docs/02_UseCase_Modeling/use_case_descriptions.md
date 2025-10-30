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
