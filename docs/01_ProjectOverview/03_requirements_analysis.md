# 3. Requirements Specification

## 3.1 Functional Requirements

| ID | Description |
|----|-------------|
| **FR1** | The system must allow organizations to create an account. |
| **FR2** | The system must allow organizations to edit their organization profile information. |
| **FR3** | The system must allow volunteers to create an account. |
| **FR4** | The system must allow volunteers to edit their volunteer profile information. |
| **FR5** | The system must allow organizations to create, edit, and delete volunteering opportunities. |
| **FR6** | The system must allow volunteers to browse and filter available volunteering opportunities. |
| **FR7** | The system must allow volunteers to apply to volunteering opportunities. |
| **FR8** | The system must notify organizations when a volunteer applies to an opportunity. |
| **FR9** | The system must allow organizations to accept or reject volunteer applications. |
| **FR10** | The system must notify volunteers of changes in their application status. |
| **FR11** | The system must allow volunteers to report inappropriate or suspicious opportunities. |
| **FR12** | The system must allow administrators to review and verify nonprofit organization accounts. |


## 3.2. Non-Functional Requirememts 

| ID | Description |
|----|-------------|
| **NFR1** | The system must support at least 100 concurrent authenticated users while maintaining functional availability. |
| **NFR2** | The system must ensure that the Largest Contentful Paint (LCP) occurs within 2.5 seconds for at least 75% of user sessions under normal load. * |
| **NFR3** | All client–server communications must be encrypted using HTTPS with TLS 1.2 or higher. |
| **NFR4** | The system must be responsive and usable on desktop and mobile devices, and comply with WCAG 2.1 AA accessibility guidelines. |
| **NFR5** | Access to system functionalities must be restricted based on user roles (volunteer, organization, administrator) using server-side authorization checks. |
| **NFR6** | The backend must be structured into independent modules for authentication, user management, opportunity management, and application management, with no direct database access outside each module’s data layer. |
| **NFR7** | User-triggered navigation or state updates must provide visible feedback within 200 ms in at least 90% of interactions. * |

\* Performance targets are based on Google Core Web Vitals guidelines.


\* These values are according to the Google Core Web Vitals performance guidelines. See [here](https://developers.google.com/search/docs/appearance/core-web-vitals) 

