## UC-05 View Opportunity Details:

**Actors:** 
- Volunteer (primary)
- Opportunity DB (secondary)

**Preconditions:** 
- Volunteers have an account on our Website.

**Main Success Scenario:** Volunteer wants to see opportunity details
1. Volunteer selects the Opportunity Tab
2. System shows the list of available Opportunities
3. Volunteer choses an Opportunity
4. System shows the details to said Opportunity


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
1. Organization Admin creates an account for Organizations
2. Admin receives registration form 
3. Admin evaluates the application
4. Admin accepts application
5. Organization is added to the website

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
1. User creates an account
2. User sends information proving their identity
3. Admin processes information 
4. Admin accepts their request
5. User is authenticated

**Postconditions:** The user has now verified their identity and can navigate the website freely.
