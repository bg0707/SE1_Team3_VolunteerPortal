import { useEffect, useState } from "react";
import { fetchOpportunities } from "../api/opportunity.api";
import Filters from "../components/Filters";
import OpportunityCard from "../components/OpportunityCard";
import type { Opportunity } from "../components/OpportunityCard";

interface FiltersType {
  search?: string;
  categoryId?: string;
  location?: string;
}

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filters, setFilters] = useState<FiltersType>({});

  useEffect(() => {
    fetchOpportunities(filters).then((data: Opportunity[]) =>
      setOpportunities(data)
    );
  }, [filters]);

  return (
    <div className="max-w-screen-xl mx-auto mt-28 p-4">
      <Filters filters={filters} onChange={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opp) => (
          <OpportunityCard key={opp.opportunityId} opportunity={opp} />
        ))}
      </div>
    </div>
  );
}
