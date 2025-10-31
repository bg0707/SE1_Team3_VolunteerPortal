# Domain Modeling Explanation

> This document serves as explanation of the derivation of the domain model of this project. 
> It follows the same methodology introduced in **Lecture 4 - Domain Modeling**

## 1. Identification of conceptual classes
### Noun-phrase analysis
From our use cases and user stories, we can extract nouns. These nouns can then become potential canditates for the conceptual classes. 

Extracted nouns: `Volunteer, Organization, Opportunity, Application, Catefory, Notification, Report, User, Admin, External Registry`

After filering out the primitive data, we got these conceptual classes: `User (abstract), Volunteer, Organization, Opportunity, Application, Category, Notification, Report, Admin`

- **Volunteer** and **Organization** are specialized classes of **User**. This generalzation helps us prevent duplication of attributes and follow Object Oriented style.
- Opportunity represents the posted by organization volunteering activity. It contains details such as title, description, location, dates, capactiy, and a status(Draft, Published ,Closed)
- Application is an assocaition class between Volunteer and Opportunity because the relationship has data like `status, message, submittedAt`
- Category is a reusable grouping for opportunities. 
- Notification is the message that the system sends to users to inform about something that changed. 
- Report gives the volunteer the power to report a opportunitiy for administrative review. 

### Classes vs. Attributes 
- Exteranl Registry remains an external actor (Governemnet Regulations)


### Attributes and Derived Information 
Each class has its attributes that represent real world data. There are some attributes, as explained in the course, that are computed from other data (derived attribute prefixed with `/`).
Examples:
- /applicantCount in Opporttunity 
- /opportunityCount in Organization

## 2. Key Invariants 
- A Volunteer may have at most one Application per Opportunity (Uniqieness on (volunteeerId, opportunityId)). 
- Opportunity Capacity should larger or equal to the amount of approved applications. 
- Opportunity status follows a specific order: Draft → Published → Closed. 
- The verifcation of an Organization can only be done by the admin after external check. 

## 3. Important Remarks

- Organization Representative is not a seperate class. It is a user role assocaited to the Organization they manage. 

## 4. Diagram
The UML diagram can be found [`here`](domain_modeling.png): 