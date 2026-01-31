import * as React from 'react';
import { Link } from "react-router-dom";
import {BadgeCheck} from "lucide-react";

export interface Opportunity {
  opportunityId: number;
  title: string;
  description: string;
  location: string;
  date: string;
  imageUrl?: string | null;
  status?: "active" | "suspended";
  category?: { name: string };
  organization?: { name: string, isVerified: boolean, description?: string };
  createdAt: string;

  category?: {
    categoryId: number;
    name: string;
  };

  organization?: {
    name: string;
    userId: number;
    description?: string;
  };
}


interface OpportunityCardProps {
  opportunity: Opportunity;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  const baseUrl = "http://localhost:3001";
  const imageSrc = opportunity.imageUrl
    ? opportunity.imageUrl.startsWith("http")
      ? opportunity.imageUrl
      : `${baseUrl}${opportunity.imageUrl}`
    : "";

  return (
    <Link
      to={`/opportunities/${opportunity.opportunityId}`}
      className="block border border-default rounded-base p-4 bg-neutral-primary shadow-sm hover:shadow-lg transition hover:-translate-y-1"
    >
      {/* Image */}
      <div className="w-full h-40 bg-neutral-secondary-soft rounded-base mb-4 overflow-hidden flex items-center justify-center text-body">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={opportunity.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          "Image Placeholder"
        )}
      </div>

      {/* Title */}
      <h3 className="text-heading text-lg font-semibold mb-1">
        {opportunity.title}
      </h3>

      {/* Organization */}
      <p className="text-body text-sm mb-2">
        <span className="font-medium">Organization:</span>{" "}
        {opportunity.organization?.name}

        {opportunity.organization?.isVerified && (
          <span title="Verified Organization">
            <BadgeCheck className="inline-block ml-1 text-blue-500" size={16} />
          </span>
        )}
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
