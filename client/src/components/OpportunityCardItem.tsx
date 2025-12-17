import type { Opportunity } from "./OpportunityCard";

interface Props {
  opportunity: Opportunity;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function OpportunityCardItem({
  opportunity,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="bg-white p-5 rounded-xl shadow border">
      <h3 className="text-xl font-semibold mb-2">{opportunity.title}</h3>

      <p className="text-gray-700 mb-4 line-clamp-3">
        {opportunity.description}
      </p>

      <div className="flex flex-wrap gap-4 text-gray-600 text-sm mb-4">
        <span>📍 {opportunity.location ?? "No location"}</span>

        {opportunity.date && (
          <span>
            📅 {new Date(opportunity.date).toLocaleDateString()}
          </span>
        )}

        {opportunity.category?.name && (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
            {opportunity.category.name}
          </span>
        )}
      </div>

      <div className="flex gap-4 text-sm font-medium">
        <button onClick={onView} className="text-blue-600 hover:underline">
          View
        </button>
        <button onClick={onEdit} className="text-gray-700 hover:underline">
          Edit
        </button>
        <button onClick={onDelete} className="text-red-600 hover:underline">
          Delete
        </button>
      </div>
    </div>
  );
}
