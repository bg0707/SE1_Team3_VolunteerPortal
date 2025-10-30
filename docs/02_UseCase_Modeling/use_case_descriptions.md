# Use Case Descriptions

## UC-08 - Explore Opportunities
**Actors:** Volunteer (primary), System (secondary)

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
