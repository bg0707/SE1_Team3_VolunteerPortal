import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  createOpportunity,
  fetchMyOpportunities,
  updateOpportunity,
  deleteOpportunity,
  type CreateOpportunity
} from "../api/opportunity.api";
import type { Opportunity } from "../components/OpportunityCard";
import { useNavigate } from "react-router-dom";

export default function ManageOpportunities() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // State for opportunities list
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // State for create/edit form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
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

  // Check authentication and permissions
  useEffect(() => {
    // Wait a moment for AuthContext to load from localStorage
    const checkAuth = setTimeout(() => {
      if (!token) {
        navigate("/authentication");
        setAuthChecked(true);
        return;
      }

      // If we have token but user is still null, wait a bit more
      if (token && user === null) {
        // Give AuthContext more time to load
        return;
      }

      // User data loaded
      if (user !== null) {
        setAuthChecked(true);

        if (user.role !== "organization") {
          navigate("/unauthorized");
          return;
        }

        // User is authenticated and is organization - ready to load data
        setIsLoading(false);
      }
    }, 200); // Wait 200ms for AuthContext to initialize

    return () => clearTimeout(checkAuth);
  }, [user, token, navigate]);

  // Load opportunities once authenticated
  useEffect(() => {
    if (authChecked && token && user?.role === "organization" && !isLoading) {
      loadOpportunities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authChecked, token, user?.role]);

  const loadOpportunities = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      // Fetch only opportunities for the authenticated organization
      const data = await fetchMyOpportunities(token);
      setOpportunities(data);
      setError(null);
    } catch (err: any) {
      console.error("Error loading opportunities:", err);
      setError(err.message || "Failed to load opportunities");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      // Validate required fields
      if (!formData.title.trim() || !formData.description.trim()) {
        setError("Title and description are required");
        setIsSubmitting(false);
        return;
      }

      // Clean up form data: remove empty strings and undefined values
      const cleanedData: CreateOpportunity = {
        title: formData.title.trim(),
        description: formData.description.trim(),
      };

      // Only include optional fields if they have values
      if (formData.location && formData.location.trim()) {
        cleanedData.location = formData.location.trim();
      }
      if (formData.date && formData.date.trim()) {
        cleanedData.date = formData.date;
      }
      if (formData.categoryId) {
        cleanedData.categoryId = formData.categoryId;
      }

      if (editingOpportunity) {
        // Update existing opportunity
        await updateOpportunity(editingOpportunity.opportunityId, cleanedData, token!);
        setSuccessMessage("Opportunity updated successfully!");
      } else {
        // Create new opportunity
        await createOpportunity(cleanedData, token!);
        setSuccessMessage("Opportunity created successfully!");
      }

      // Success: Reset form and refresh list
      resetForm();
      await loadOpportunities(); // Reload the list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Error saving opportunity:", err);
      setError(err.message || `Failed to ${editingOpportunity ? 'update' : 'create'} opportunity`);
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
    setShowCreateForm(false);
    setEditingOpportunity(null);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleEdit = (opportunity: Opportunity) => {
    // Convert date to datetime-local format (YYYY-MM-DDTHH:mm)
    const dateValue = opportunity.date 
      ? new Date(opportunity.date).toISOString().slice(0, 16)
      : "";

    setFormData({
      title: opportunity.title,
      description: opportunity.description,
      location: opportunity.location || "",
      date: dateValue,
      categoryId: opportunity.category?.categoryId,
    });
    setEditingOpportunity(opportunity);
    setShowCreateForm(true);
    setError(null);
  };

  const handleDelete = async (opportunityId: number) => {
    if (!window.confirm("Are you sure you want to delete this opportunity?")) {
      return;
    }

    try {
      await deleteOpportunity(opportunityId, token!);
      setSuccessMessage("Opportunity deleted successfully!");
      await loadOpportunities(); // Reload the list
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Error deleting opportunity:", err);
      setError(err.message || "Failed to delete opportunity");
    }
  };

  // Show loading state only while checking authentication (not while loading data)
  if (!authChecked || !user || user.role !== "organization") {
    return (
      <div className="max-w-screen-xl mx-auto mt-28 p-4">
        <div className="flex items-center justify-center py-12">
          <p className="text-neutral-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto mt-28 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Opportunities</h1>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
            type="button"
          >
            + Create New Opportunity
          </button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-base mb-4">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && !showCreateForm && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-base mb-4">
          {error}
        </div>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white border border-default rounded-base p-6 mb-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">
            {editingOpportunity ? "Edit Opportunity" : "Create New Opportunity"}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-base mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-default rounded-base focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter opportunity title"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-default rounded-base focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe the opportunity..."
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-default rounded-base focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., City, Address"
                />
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">
                  Date
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-default rounded-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Category ID (optional, can be enhanced later with dropdown) */}
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium mb-1">
                  Category ID (optional)
                </label>
                <input
                  type="number"
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: e.target.value ? parseInt(e.target.value) : undefined,
                    }))
                  }
                  className="w-full px-4 py-2 border border-default rounded-base focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Category ID"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md"
              >
                {isSubmitting 
                  ? (editingOpportunity ? "Updating..." : "Creating...") 
                  : (editingOpportunity ? "Update Opportunity" : "Create Opportunity")
                }
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="bg-neutral-secondary text-neutral-primary px-6 py-2 rounded-base hover:bg-neutral-secondary-soft transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Opportunities List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">My Opportunities</h2>
        {isLoading ? (
          <div className="text-center py-12 text-neutral-secondary">
            <p>Loading opportunities...</p>
          </div>
        ) : error && !showCreateForm ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-base mb-4">
            {error}
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-12 text-neutral-secondary">
            <p>No opportunities yet. Create your first opportunity!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <div
                key={opp.opportunityId}
                className="border border-default rounded-base p-4 bg-neutral-primary shadow-sm"
              >
                <h3 className="text-xl font-semibold mb-2">{opp.title}</h3>
                <p className="text-neutral-secondary mb-4 line-clamp-3">
                  {opp.description}
                </p>
                {opp.location && (
                  <p className="text-sm text-neutral-secondary mb-2">
                    📍 {opp.location}
                  </p>
                )}
                {opp.date && (
                  <p className="text-sm text-neutral-secondary mb-4">
                    📅 {new Date(opp.date).toLocaleDateString()}
                  </p>
                )}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => navigate(`/opportunities/${opp.opportunityId}`)}
                    className="text-primary hover:underline text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleEdit(opp)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(opp.opportunityId)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

