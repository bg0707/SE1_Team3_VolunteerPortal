import type { CreateOpportunity } from "../api/opportunity.api";
import type { Category } from "../api/category.api";

interface Props {
  formData: CreateOpportunity;
  categories: Category[];
  isEditing: boolean;
  isSubmitting: boolean;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function OpportunityForm({
  formData,
  categories,
  isEditing,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <section className="bg-white p-6 rounded-xl shadow border mb-10">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditing ? "Edit Opportunity" : "Create Opportunity"}
      </h2>

      <form onSubmit={onSubmit} className="space-y-5">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={onChange}
          className="w-full px-4 py-3 border rounded-xl"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={onChange}
          rows={5}
          className="w-full px-4 py-3 border rounded-xl"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location ?? ""}
            onChange={onChange}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            type="datetime-local"
            name="date"
            value={formData.date ?? ""}
            onChange={onChange}
            className="w-full px-4 py-3 border rounded-xl"
          />
        </div>

        <select
          name="categoryId"
          value={formData.categoryId ?? ""}
          onChange={onChange}
          className="w-full px-4 py-3 border rounded-xl bg-white"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-8 rounded-xl font-semibold shadow disabled:opacity-50"
          >
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
              ? "Update"
              : "Create"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-2 rounded-xl border text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
