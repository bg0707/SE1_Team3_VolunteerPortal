import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  createOpportunity,
  fetchMyOpportunities,
  updateOpportunity,
  deleteOpportunity,
  type CreateOpportunity,
} from "../api/opportunity.api";
import { fetchCategories, type Category } from "../api/category.api";
import type { Opportunity } from "../components/OpportunityCard";
import { useNavigate } from "react-router-dom";

/* Unified change event */
type FormChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>
  | React.ChangeEvent<HTMLSelectElement>;

export default function ManageOpportunities() {
  const { token } = useAuth();
  const navigate = useNavigate();

  /* ---------- DATA ---------- */
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------- FORM ---------- */
  const [showForm, setShowForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] =
    useState<Opportunity | null>(null);

  const [formData, setFormData] = useState<CreateOpportunity>({
    title: "",
    description: "",
    location: "",
    date: "",
    categoryId: undefined,
  });

  /* ---------- UX ---------- */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /* ---------- LOAD ---------- */
  useEffect(() => {
    if (!token) return;
    loadOpportunities();
  }, [token]);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setError("Failed to load categories"));
  }, []);

  const loadOpportunities = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const data = await fetchMyOpportunities(token);
      setOpportunities(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load opportunities");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- HANDLERS ---------- */
  const handleInputChange = (e: FormChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!formData.title?.trim() || !formData.description?.trim()) {
        setError("Title and description are required");
        return;
      }

      const payload: CreateOpportunity = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location?.trim() || undefined,
        date: formData.date || undefined,
        categoryId: formData.categoryId,
      };

      if (editingOpportunity) {
        await updateOpportunity(
          editingOpportunity.opportunityId,
          payload,
          token!
        );
        setSuccessMessage("Opportunity updated successfully!");
      } else {
        await createOpportunity(payload, token!);
        setSuccessMessage("Opportunity created successfully!");
      }

      resetForm();
      await loadOpportunities();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save opportunity");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      date: "",
      categoryId: undefined,
    });
    setEditingOpportunity(null);
    setShowForm(false);
    setError(null);
  };

  const handleEdit = (opp: Opportunity) => {
    setFormData({
      title: opp.title,
      description: opp.description,
      location: opp.location || "",
      date: opp.date
        ? new Date(opp.date).toISOString().slice(0, 16)
        : "",
      categoryId: opp.category?.categoryId,
    });
    setEditingOpportunity(opp);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this opportunity?")) return;

    try {
      await deleteOpportunity(id, token!);
      await loadOpportunities();
    } catch (err: any) {
      setError(err.message || "Failed to delete opportunity");
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="max-w-5xl mx-auto mt-28 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Manage Opportunities</h1>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl font-semibold"
          >
            + New Opportunity
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 bg-red-100 text-red-800 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 bg-green-100 text-green-800 px-4 py-3 rounded-xl">
          {successMessage}
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow border mb-10 space-y-4"
        >
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
            rows={4}
            required
          />

          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
          />

          <select
            name="categoryId"
            value={formData.categoryId ?? ""}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              {editingOpportunity ? "Update" : "Create"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="border px-6 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* LIST */}
      {isLoading ? (
        <p className="text-center py-10">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {opportunities.map((opp) => (
            <div
              key={opp.opportunityId}
              className="bg-white p-5 rounded-xl shadow border"
            >
              <h3 className="text-xl font-semibold">{opp.title}</h3>
              <p className="text-gray-600 mt-2">{opp.description}</p>

              <div className="flex gap-4 mt-4 text-sm">
                <button
                  onClick={() =>
                    navigate(`/opportunities/${opp.opportunityId}`)
                  }
                  className="text-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(opp)}
                  className="text-gray-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(opp.opportunityId)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
