import * as React from 'react';
import { Link } from "react-router-dom";

export interface Opportunity {
  opportunityId: number;
  title: string;
  description: string;
  location: string;
  date: string;
  category?: { categoryId: number; name: string };
  organization?: { name: string };
  createdAt: string;
}

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  return (
    <Link
      to={`/opportunities/${opportunity.opportunityId}`}
      className="block border border-default rounded-base p-4 bg-neutral-primary shadow-sm hover:shadow-lg transition hover:-translate-y-1"
    >
      {/* Placeholder Image */}
      <div className="w-full h-40 bg-neutral-secondary-soft rounded-base mb-4 flex items-center justify-center text-body">
        Image Placeholder
      </div>

      {/* Title */}
      <h3 className="text-heading text-lg font-semibold mb-1">
        {opportunity.title}
      </h3>

      {/* Organization */}
      <p className="text-body text-sm mb-2">
        <span className="font-medium">Organization:</span>{" "}
        {opportunity.organization?.name}
      </p>

      {/* Category */}
      <p className="text-body text-sm mb-2">
        <span className="font-medium">Category:</span>{" "}
        {opportunity.category?.name}
      </p>

      {/* Location */}
      <p className="text-body text-sm mb-2">
        <span className="font-medium">Location:</span>{" "}
        {opportunity.location}
      </p>

      {/* Date */}
      <p className="text-body text-sm mb-3">
        <span className="font-medium">Date:</span>{" "}
        {opportunity.date?.slice(0, 10)}
      </p>

      {/* Description */}
      <p className="text-body text-sm line-clamp-3">
        {opportunity.description}
      </p>
    </Link>
  );
};

export default OpportunityCard;
