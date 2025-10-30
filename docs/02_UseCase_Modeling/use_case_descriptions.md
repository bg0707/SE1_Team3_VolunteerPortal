# Use Case Descriptions

---

## UC-02 — Apply for Opportunity

**Actors:** Volunteer (primary), Non-profit Organization (Secondary)

**Preconditions**
 - Volunteer is authenitcated
 - The oppurinity exists and is open for applications

**Main Success Scenario**

 1. Volunteer explores the wished to apply opportunity details page
 2. System displays opportunity information
 3. Volunteer clicks Apply
 4. System checks that the volunteer has already applied 
 5. System checks that the oppurtinity has available capactiy
 6. System stores the new application with the status as 'Pending'
 7. System gives off a notification to the organization about the new application
 8. System confirms the application to the volunteer


**Extensions (Alternate Flows)**
- **Duplicate Application:** System displays the following message "You have already applied to this opportunity."
- **Opportunity closed:** System displays the following message "Applications are closed. Check in later."
- **Opportunity full:**  System displays the following message "Applications is full."

**Postconditions**
- First, the volunteer's application is stored in the system, waiting for approval/rejection.
- Organization receveis an notifcation regarding the new application. 
- Volunteer is able to see the application status in their profile under "My Aplications" section. 



## UC-03 — Filter/Search Opportunities

**Actors:** Volunteer (primary)

**Preconditions**
 - Volunteer is authenitcated
 - There exists at least one published opportunity 

**Main Success Scenario**

 1. Volunteer opens the Opportunities page. 
 2. System displays all available opportunities. 
 3. Volunteer enters keywords or selects filters (e.g. location, data, category, etc.)
 4. System applies the filters to the search query and fitlers the opportunities. 
 5. System displays the filtered list of opportunities matching the criteria. 
 6. Volunteer clicks an opportunitiy to observe the detailed information of the opportunity. 


**Extensions (Alternate Flows)**
- **No results found:** System displays the following message "No opportunities match your criteria."
- **Invalid Filter Input:** System resets all the filters and displays the default list of opportunities. 


**Postconditions**
- A filtered list of opportunities is displayed. 
- Volunteer is now able to go into the different displayed opportunities. 

## UC-04 — Manage Opportunities

**Actors:** Organization (primary), Volunteer (secondary)

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
