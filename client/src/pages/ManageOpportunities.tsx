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
import OpportunityForm from "../components/OpportunityForm";
import OpportunityCardItem from "../components/OpportunityCardItem";
import { useNavigate } from "react-router-dom";

/* unified change event type */
type FormChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>
  | React.ChangeEvent<HTMLSelectElement>;

export default function ManageOpportunities() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleEdit = (opportunity: Opportunity) => {
    setFormData({
      title: opportunity.title,
      description: opportunity.description,
      location: opportunity.location || "",
      date: opportunity.date
        ? new Date(opportunity.date).toISOString().slice(0, 16)
        : "",
      categoryId: opportunity.category?.categoryId,
    });

    setEditingOpportunity(opportunity);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this opportunity?")) return;

    try {
      await deleteOpportunity(id, token!);
      setSuccessMessage("Opportunity deleted successfully!");
      await loadOpportunities();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete opportunity");
    }
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="max-w-5xl mx-auto mt-28 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Manage Opportunities</h1>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl font-semibold shadow"
          >
            + New Opportunity
          </button>
        )}
      </div>

      {/* FEEDBACK */}
      {successMessage && (
        <div className="mb-6 bg-green-100 text-green-800 px-4 py-3 rounded-xl border">
          {successMessage}
        </div>
      )}

      {error && !showForm && (
        <div className="mb-6 bg-red-100 text-red-800 px-4 py-3 rounded-xl border">
          {error}
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <OpportunityForm
          formData={formData}
          categories={categories}
          isEditing={!!editingOpportunity}
          isSubmitting={isSubmitting}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      {/* LIST */}
      <h2 className="text-2xl font-semibold mb-6">My Opportunities</h2>

      {isLoading ? (
        <p className="text-center text-gray-600 py-10">
          Loading opportunities...
        </p>
      ) : opportunities.length === 0 ? (
        <p className="text-center text-gray-600 py-10">No opportunities yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((opp) => (
            <OpportunityCardItem
              key={opp.opportunityId}
              opportunity={opp}
              onView={() => {
                if (opp.status === "suspended") {
                  alert(
                    "This opportunity is suspended and cannot be viewed. If you believe this is a mistake, contact support@yoursite.com."
                  );
                  return;
                }
                navigate(`/opportunities/${opp.opportunityId}`);
              }}
              onEdit={() => handleEdit(opp)}
              onDelete={() => handleDelete(opp.opportunityId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
