# Use Case Descriptions

---

## UC-01 - Moderate Listings
**Actors:** Admin (primary)

**Description:** Review and moderate reported listings to maintain platform integrity and ensure compliance with content guidelines.

**Preconditions**
- The platform administrator has logged into the system.
- At least one listing has been reported.

**Main Succes Scenario**
1. The administrator navigates into the “Moderation” module.
2. The system displays a list of reported listings, including organization name, report reason, date, and current status.
3. The administrator selects a listing to view its details, including description and report history.
4. The administrator chooses an appropriate action:
   - Keep: Mark listing as compliant and close report.
   - Suspend: Temporarily remove the listing from public view.
   - Remove: Permanently remove the listing from the platform.
   - Restore: Reinstate a previously suspended listing.
6. The administrator provides or selects a moderation reason (e.g., spam).
7. The system saves the moderation decision, updates the listing’s status, and logs the action.
8. The system notifies the related organization about the decision (in-app).

**Postconditions**
- The listing status is updated to “Active,” “Suspended,” or “Removed.”
- The system records the moderation action in an audit log.
- Organization owner is notified of the moderation outcome.


## UC-02 — Apply for Opportunity

**Actors:** Volunteer (primary), Non-profit Organization (Secondary)

**Preconditions**
 - Volunteer is on the opportunity details page
 - The opportunity exists

**Main Success Scenario**

 1. Volunteer explores the wished to apply opportunity details page
 2. System displays opportunity information
 3. Volunteer clicks Apply
 4. System checks that the volunteer has already applied 
 6. System stores the new application with the status as 'Pending'
 7. System gives off a notification to the organization about the new application
 8. System confirms the application to the volunteer


**Extensions (Alternate Flows)**
- **Duplicate Application:** System displays the following message "You have already applied to this opportunity."

**Postconditions**
- First, the volunteer's application is stored in the system, waiting for approval/rejection.
- Organization receveis an notifcation regarding the new application. 
- Volunteer is able to see the application status in their profile under "My Aplications" section. 



## UC-03 — Filter/Search Opportunities

**Actors:** Volunteer (primary)

**Preconditions**
 - Volunteer is on the Opportunities page
 - There exists at least one published opportunity 

**Main Success Scenario**

 1. Volunteer opens the Opportunities page. 
 2. System displays all available opportunities. 
3. Volunteer enters keywords or selects filters (e.g. location, date, category, etc.)
 4. System applies the filters to the search query and fitlers the opportunities. 
 5. System displays the filtered list of opportunities matching the criteria. 
 6. Volunteer clicks an opportunitiy to observe the detailed information of the opportunity. 


**Extensions (Alternate Flows)**
- **No results found:** System displays the following message "No opportunities match your criteria."


**Postconditions**
- A filtered list of opportunities is displayed. 
- Volunteer is now able to go into the different displayed opportunities. 

## UC-04 — Manage Opportunities

**Actors:** Organization (primary)

**Preconditions**
 - Organization is authenitcated
 - Organization owns at least one opportunity or has permission to create new ones. 

**Main Success Scenario**

1. Organization accesses the Manage Opportunities dashboard. 
2. System displays all the opprtunities created by the Organization if any. 
3. Organization selects Create New Opportunity. 
4. System presents a form for required details. 
5. Organization submits the form filled. 
6. System checks and validates the inputs and saves the new opportunity. 
7. Organization can also edit or delete existing opportunities from the same dashboard. 
8. System confirms any changes with a success message. 


**Extensions (Alternate Flows)**
- **Delete Confiramtion:** System asks "Are you sure you want to delete this opportunity" before finally removing it. 
- **Invalid Input:** System displays an error message and highlights invalied fields. 

**Postconditions**
- New, edited or deleted opportunities are updated in the database. 
- Changes are made in the volunteer-facing opportunity listings. 



## UC-05 View Opportunity Details:

**Actors:** 
- Volunteer (primary)
- Opportunity DB (secondary)

**Preconditions:** 
- Volunteers can access the Opportunities page.

**Main Success Scenario:** Volunteer wants to see opportunity details
1. Volunteer selects the Opportunity Tab
2. System shows the list of available Opportunities
3. Volunteer choses an Opportunity
4. System shows the details to said Opportunity


**Postconditions:** Volunteer is allowed to view the details about an Opportunity


## UC-06 Verify Organization:

**Actors:**  
- Organization (primary)
- Admin (secondary)
- Organizations DB (secondary )

**Preconditions:**
- Organization has to register through the sign up form

**Extensions:** 

Prerequisite not met:
- Invalid Registration Form
- Admin rejects Organization

**Main Success Scenario:** Organization wants to be accepted into our website
1. Organization Admin creates an account for Organizations
2. Admin receives the organization request in the pending list 
3. Admin evaluates the application
4. Admin accepts application
5. Organization is added to the website

**Postconditions:** Organization is added to the website and can post Opportunities.


## UC-07 Login User:

**Actors:** 
- User (primary)
- Verified Users DB (secondary)

**Preconditions:** 
- User has created an account

**Main Success Scenario:** User logs in
1. User enters email and password
2. System validates credentials
3. System issues a JWT token
4. User is authenticated

**Postconditions:** The user has now verified their identity and can navigate the website freely.

## UC-08 - Explore Opportunities
**Actors:** Volunteer (primary), System (secondary)

**Description:** Allows volunteers to discover, search, filter and view detailed information about available volunteering opportunities

**Preconditions**
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
8. Volunteer can apply to the opportunity

**Extensions**
- **Search returns no results:**
  1. Systems displays “No matches found” message

**Postconditions**
- Volunteer has viewed opportunity details
- Volunteer has viewed opportunity details

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
3. Representative enters organization details (name, description, email)
5. System validates required information
6. Representative creates admin account credentials
7. System submits application for review
8. System admin reviews and approves organization
9. System marks organization as verified (admin decision)
10. Organization can now post opportunities

**Extensions**
- **Organization name already exists:** System rejects duplicate email/organization registration.
- **Missing required information:** System highlights missing fields.

**Postconditions**
- Organization profile is created (pending or approved status)
- Admin account is established
- Organization can access appropriate features based on approval status
- Organization can access appropriate features based on approval status

## UC-10 - Send Notification
**Actors:** System (primary), Volunteer/Organization (secondary)

**Description:** System generates in-app notifications when applications are submitted, reviewed, or cancelled.

**Preconditions**
- User actions trigger notification events (apply/review/cancel).

**Main Succes Scenario**
1. User performs an action (apply/review/cancel).
2. System creates an in-app notification for the affected user.

**Postconditions**
- Notification is stored and visible in the user notification list.

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
3. System displays reporting form with a description field
4. Volunteer provides details and context
5. Volunteer submits the report

**Extensions**
- **Insufficient information provided:**
  1. System prompts volunteer for additional details
  2. Volunteer completes required information

**Postconditions**
- Report is recorded in system database
- Opportunity is flagged for administrative review
- Volunteer receives confirmation of report submission
- System administrators are notified of pending reports

## UC-12 - Manage User Access
**Actors:** Admin (primary)

**Description:** Allow administrators to update user status (active/suspended/deactivated) to ensure platform safety.

**Preconditions**
- The administrator is authenticated.

**Main Succes Scenario**
1. Administrator navigates to the User Access module.
2. System displays the list of users and current status.
3. Administrator selects a user.
4. Administrator updates the user status.
5. System validates the request and persists the change.
6. System records the action in the activity log.
7. System confirms the update to the administrator.

**Extensions (Alternate Flows)**
- **Invalid status:** System displays an error and keeps the previous status.
- **User not found:** System displays a not found message.

**Postconditions**
- User status is updated.
- Activity log contains the update action.


## UC-13 - Review Applicants
**Actors:** Organization (primary)

**Description:** Review volunteer applications and accept or reject them.

**Preconditions**
- Organization administrator is authenticated.
- Applications exist for an opportunity owned by the organization.

**Main Succes Scenario**
1. Organization navigates to Manage Opportunities and selects an opportunity.
2. System displays the list of volunteer applications.
3. Organization selects an application to review.
4. Organization chooses **Accept** or **Reject**.
5. System updates the application status.
6. System sends an in‑app notification to the volunteer.

**Extensions (Alternate Flows)**
- **Unauthorized access:** System denies the request.
- **Application already reviewed:** System displays a conflict message.

**Postconditions**
- Application status is updated.
- Volunteer receives an in‑app notification.


## UC-14 - Manage Applications
**Actors:** Volunteer

**Description:** View submitted applications, check status, and cancel applications.

**Preconditions**
- The volunteer has logged in.
- The volunteer has submitted at least one application.

**Main Succes Scenario**
1. Volunteers open the “My Applications” module.
2. The system displays the application list by time/status (event name, organization, date, location, current status: Pending/Approved/Rejected, etc.).
4. Volunteers can perform the following action:
   - **Cancel Registration:** Confirm cancellation.
5. The system validates the legitimacy of the operation.
6. The system saves changes and refreshes the list and detail statuses.
7. The system sends a confirmation notification to the volunteer and notifies the organization.

**Postconditions**
**If succeeded:**
- Cancellation changes have been saved.
- The list and status have been synchronized.
- Required notifications have been sent.

**If failed:**
- No changes, provide the volunteer with understandable error messages.

**Exception Flows**
- The operation is illegal.
