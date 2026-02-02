# Backlog Planning (Final – MoSCoW Prioritization)

| Nr | Type | Description | Priority Category | Status |
|:--:|:----:|-------------|------------------|:------:|
| 1 | Authentication | Implement volunteer sign-up form with input validation | **Must-have** | Done |
| 2 | Authentication | Implement organization sign-up form | **Must-have** | Done |
| 3 | Authentication | Implement user login | **Must-have** | Done |
| 4 | Authorization | Implement role-based authorization middleware (volunteer / organization / admin) | **Must-have** | Done |
| 5 | Profile | Implement volunteer profile editing | **Should-have** | Done |
| 6 | Profile | Implement organization profile editing | **Should-have** | Done |
| 7 | Opportunity | Implement opportunity creation form (organization) | **Must-have** | Done |
| 8 | Opportunity | Implement opportunity editing | **Must-have** | Done |
| 9 | Opportunity | Implement opportunity deletion with confirmation | **Must-have** | Done |
|10 | Opportunity | Display list of available opportunities | **Must-have** | Done |
|11 | Opportunity | Display opportunity details page | **Must-have** | Done |
|12 | Opportunity | Implement filtering by location, category, and date | **Should-have** | Done |
|13 | Application | Implement “Apply to Opportunity” functionality | **Must-have** | Done |
|14 | Application | Prevent duplicate applications | **Must-have** | Done |
|15 | Application | Store application with status “Pending” | **Must-have** | Done |
|16 | Application | Display volunteer applications in “My Applications” | **Must-have** | Done |
|17 | Application | Allow volunteer to cancel an application | **Should-have** | Done |
|19 | Application | Display applications to organization owners | **Must-have** | Done |
|20 | Application | Allow organizations to accept or reject applications | **Must-have** | Done |
|21 | Notification | Notify organization when a new application is submitted | **Should-have** | Done |
|22 | Notification | Notify volunteer when application status changes | **Should-have** | Done |
|23 | Admin | Allow admin to review and verify organizations | **Must-have** | Done |
|24 | Moderation | Allow volunteers to report opportunities | **Could-have** | Done |
|25 | Moderation | Display reported listings for admin review | **Could-have** | Done |
|26 | Moderation | Allow admin to suspend, remove, or restore listings | **Could-have** | Done |
|27 | Admin | Allow admin to manage user roles and access | **Won’t-have (this time)** | Partial (status only) |
|28 | Security | Enforce HTTPS and secure client–server communication | **Must-have** | Not verifiable (infra) |
|29 | Security | Implement secure password hashing and storage | **Must-have** | Done |
|30 | Architecture | Modularize backend (auth, users, opportunities, applications) | **Must-have** | Done |
|31 | Performance | Ensure page load time < 2.5 seconds under normal load | **Should-have** | Not verifiable |
|32 | Monitoring | Log critical user and admin actions | **Could-have** | Done |

---

## Priority Category Definitions

- **Must-have**  
  Critical for system operation. Without these, the system fails to meet its core objectives.

- **Should-have**  
  Important features that significantly improve usability or quality, but temporary workarounds exist.

- **Could-have**  
  Nice-to-have improvements with low priority or added value, implemented if time permits.

- **Won’t-have (this time)**  
  Explicitly deferred to prevent scope creep and focus on core functionality.
