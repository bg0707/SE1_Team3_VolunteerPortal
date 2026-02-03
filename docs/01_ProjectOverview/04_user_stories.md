
# 4.User Stories and Scenarios

## 4.1. User Stories 

We follow the following format:  `As a <user role>, I want <goal> so that <reason>`

**Volunteer**

1. As a volunteer, I want to filter through the listings by location so that I can select the listings that are nearby. 

2. As a volunteer, I want to browse through the listings so that I can check and find one that fits my preferences. 

3. As a volunteer, I want to apply to listings so that I can participate in the cause that I want to contribute to. 

4. As a volunteer, I want to view and manage my applications so that I can stay organized. 

5. As a volunteer, I want to report false opportunities so that the website can remove these.  

6. As a volunteer, I want to receive notifications when my application status changes so that I stay updated. 

7. As a volunteer, I want edit my profile information so that I can keep my details up to date.


**Website Admins**

1. As an admin, I want to handle the verification of the organization so that only legitimate organizations get picked. 

2. As an admin, I want to be able to remove listings so that the website stays legitimate and trustworthy.

3. As an admin, I want to manage user accounts, so the website can be safe and functional. 

4. As an admin, I want to review organization verification requests so that only verified organizations can be on the website. 

**Nonprofit organizations**

1. As a nonprofit organization, I want to be able to post the listings so I can get applications. 

2. As a nonprofit organization, I want to be able to manage the application of volunteers, so I can get recruiters. 

3. As a nonprofit organization, I want to create an account, so I can post opportunities.
 
4. As a nonprofit organization, I want to manage opportunities (create/edit/delete) so that listings stay accurate. 

5. As a nonprofit organization, I want receive notifications when a new volunteer applies so that I can review applications promptly.

6. As a nonprofit organization, I want edit my profile information so that I can keep my organizations's details up to date.

## 4.2. User Scenarios

`Scenario 1 - Volunteer Browsing and Applying `

**Author:** Volunteer (Tyrion)

**Context:** Tyrion wants to volunteer at a local non profit organization during the weekends 

**Scenario:**

Tyrion logs into the website and checks the opportunities page. He then filters the listings though location and type of volunteering. He chooses the location as Luxembourg and the type of volunteering as Food distribution. He then scrolls down and checks some of the opportunities and selects one. He then can read the details of the opportunity and apply to it. He receives an on screen confirmation of the successful sending of his application and awaits for the response. He then can check on his profile, his ongoing applications as well rejected and accepted. 

**Outcome:**
Tyrion’s application is sent and the non profit organization receives a notification.  

`Scenario 2 - Organization creating a new opportunity`

**Author:** Nonprofit Representative (John Snow)

**Context:** Representative wants to post an opportunity to recruit some volunteers for an upcoming event about tree planting 

**Scenario:** 

John logs into his organization account, clicks the “Add New Opportunity" button, and fills out the form with title, location, description, date, and category. The system validates the inputs and publishes the opportunity.  

**Outcome:**
The opportunity appears on the volunteers listings, ready for applications

`Scenario 3 - Admin verifies a new organization`

**Author:** Alfred (Admin of the web app)

**Context:** A new organization called “Plant Trees" has just register

**Scenario:**

Alfred logs into his admin account and goes to the dashboard to check pending verification requests. He reviews the organization details and clicks approve. 

**Outcome:**
“Plant Tree” becomes a verified and active organization on the platform. 
