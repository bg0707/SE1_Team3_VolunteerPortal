import React, { useState } from "react";
import { registerOrganization } from '../api/authentication.api.ts';

interface OrganizationData {
  organizationName: string;
  email: string;
  password: string;
  description: string;
}

const initialData: OrganizationData = {
  organizationName: "",
  email: "",
  password: "",
  description: ""
};

// Add switchToLogin prop
interface Props {
  switchToLogin: () => void;
}

const OrganizationRegistrationForm: React.FC<Props> = ({ switchToLogin }) => {
  const [formData, setFormData] = useState<OrganizationData>(initialData);
  const [err, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.email || !formData.password || !formData.organizationName) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const data = await registerOrganization(
        formData.email,
        formData.password,
        formData.organizationName,
        formData.description
      );

      localStorage.setItem("token", data.token);
      setSuccess(`Welcome, ${data.user.email}! Registration successful.`);

      // Automatically switch to login view after 1.5s
      setTimeout(() => switchToLogin(), 1500);

    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.message || "An unexpected registration error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input type="text" name="organizationName" placeholder="Organization Name" value={formData.organizationName} onChange={handleChange} className="px-3 py-2 border border-gray-300 rounded-md" />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleTextareaChange} className="px-3 py-2 border border-gray-300 rounded-md h-24 resize-none overflow-y-auto" style={{ lineHeight: "1.5rem" }} />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="px-3 py-2 border border-gray-300 rounded-md" />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="px-3 py-2 border border-gray-300 rounded-md" />
      <button type="submit" className="py-2 rounded-md bg-blue-500 text-white font-bold hover:bg-blue-600">Register</button>
    </form>
  );
};

export default OrganizationRegistrationForm;
