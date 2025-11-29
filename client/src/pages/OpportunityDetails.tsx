import { useEffect, useState } from "react";
import { fetchOpportunityById } from "../api/opportunity.api";
import type { Opportunity } from "../components/OpportunityCard";
import { useParams } from "react-router-dom";
// OpportunityDetailsPage

// Here, you are going to display the differnt details about a specific Opportunity. 



// 1. Read the ID from the URL

// 2. Fetch teh opportunity using the function in the api (opportunity.api.ts)

// 3. Display information 

export default function OpportunityDetails() {
    const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
    const { id } = useParams<{ id: string }>(); // 1. Read the ID from the URL
    
    useEffect(() => {
        if (id) {
            fetchOpportunityById(parseInt(id)).then(setOpportunity);
        }
    }, [id]); 

     // 3. Display information
    if (!opportunity) return <div>Loading...</div>;

    return (
        <div className="max-w-screen-xl mx-auto mt-28 p-4">
            <h1>{opportunity.title}</h1>
            <p>{opportunity.description}</p>
            <p>Location: {opportunity.location}</p>
            <p>Date: {opportunity.date}</p>
            {/* etc. */}
        </div>
    );
}



// Example of what is returned by the function in the api (opportunity.api.ts)

/*
{
"opportunityId":4,
"organizationId":2,
"categoryId":1,
"title":"Park Cleanup Volunteer",
"description":"Help clean the central park.",
"location":"Luxembourg",
"date":"2025-05-12T00:00:00.000Z",
"createdAt":"2025-11-22T21:03:01.000Z",
"category": {
    "categoryId":1,
    "name":"Environment"
    },
"organization":{
    "organizationId":2,
    "userId":1,
    "name":"Helping Hands",
    "description":"Test organization",
    "createdAt":"2025-11-22T21:01:20.000Z"
    }
}


*/