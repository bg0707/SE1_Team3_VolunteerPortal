
# 4.User Stories and Scenarios

## 4.1. User Stories 

We follow the following format:  `As a <user role>, I want <goal> so that <reason>`

**Volunteer**

1. As a volunteer, I want to filter through the listings by location so that I can select the listings that are nearby. 

2. As a volunteer, I want to browse through the listings so that I can check and find one that fits my preferences. 

3. As a volunteer, I want to apply to listings so that I can participate in the cause that I want to contribute to. 

4. As a volunteer, I want to view and manage my upcoming volunteer activities so that I can stay organized. 

5. As a volunteer, I want to report false opportunities so that the website can remove these.  

6. As a volunteer, I want to receive notifications when my application status changes so that I stay updated. 

7. As a volunteer, I want edit my profile information so that I can keep my details up to date.


**Website Admins**

1. As an admin, I want to handle the verification of the organization so that only legitimate organizations get picked. 

2. As an admin, I want to be able to remove listings so that the website stays legitimate and trustworthy.

3. As an admin, I want to manage user accounts, so the website can be safe and functional. 

4. As an admin, I want to check organizations against an external register so that only verified organizations can be in our website. 

**Nonprofit organizations**

1. As a nonprofit organization, I want to be able to post the listings so I can get applications. 

2. As a nonprofit organization, I want to be able to manage the application of volunteers, so I can get recruiters. 

3. As a nonprofit organization, I want to create an account, so I can post opportunities.
 
4. As a nonprofit organization, I want to mark an opportunity as fulfilled so that new applicants cannot apply. 

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

`Scenario 2 - Admin verifying a new organization`

**Author:** Nonprofit Representative (John Snow)

**Context:** Representative wants to post an opportunity to recruit some volunteers for an upcoming event about tree planting 

**Scenario:** 

John logs into his account that as a representative of a nonprofit organization, he clicks the “Add New Opportunity" Button and he fills out the form asking the title, location, description, date and number of volunteers needed and in case some needed qualifications. The system then validates the inputs and puts the opportunity online.  

**Outcome:**
The opportunity appears on the volunteers listings, ready for applications

`Scenario 3 - Admin verifies a new organization`

**Author:** Alfred (Admin of the web app)

**Context:** A new organization called “Plant Trees" has just register

**Scenario:**

Alred logs into his admin account and goes to the dashboard and checks for requests pending. Alfred then opens the request of “Plant Tree” and verifies their legitimacy by cross checking their register number. She clicks approve. 

**Outcome:**
“Plant Tree” becomes a verified and active organization on the platform. 
