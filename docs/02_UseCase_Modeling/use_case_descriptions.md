## UC-05 View Opportunity Details:

**Actors:** 
- Volunteer (primary)
- Opportunity DB (secondary)

**Preconditions:** 
- Volunteers have an account on our Website.

**Main Success Scenario:** Volunteer wants to see opportunity details
- Volunteer selects the Opportunity Tab
- System shows the list of available Opportunities
- Volunteer choses an Opportunity
- System shows the details to said Opportunity


**Postconditions:** Volunteer is allowed to view the details about an Opportunity


## UC-06 Verify Organization:

**Actors:**  
- Admin (primary)
- Organization (secondary)
- Organizations DB (secondary )

**Preconditions:**
- Organization has to register through the sign up form
- Organization has to be legit

**Extensions:** 

Prerequisite not met:
- Invalid Registration Form
- Admin rejects Organization

**Main Success Scenario:** Organization wants to be accepted into our website
- Organization Admin creates an account for Organizations
- Admin receives registration form 
- Admin evaluates the application
- Admin accepts application
- Organization is added to the website

**Postconditions:** Organization is added to the website and can post Opportunities.


## UC-07 Authenticate User:

**Actors:** 
- Admin (primary)
- User (secondary)
- Verified Users DB (secondary)

**Preconditions:** 
- User has to create an account using real information

**Extensions:** 

Prerequisite not met:
- Invalid identity information

Admin override:
- Admin rejects authentication request

**Main Success Scenario:** User gets authenticated
- User creates an account
- User sends information proving their identity
- Admin processes information 
- Admin accepts their request
- User is authenticated

**Postconditions:** The user has now verified their identity and can navigate the website freely.
