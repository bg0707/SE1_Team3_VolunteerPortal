import React from "react";
import { useState } from "react";
import { registerOrganization } from '../api/authentication.api.ts';


// data that is being stored
interface OrganizationData {
  fullName: string;
  email: string;
  password: string;
  description: string;
}

// initial values of the variables
const initialData: OrganizationData = {

  fullName: " ",
  email: " ",
  password: " ",
  description: " "
};

const OrganizationRegistrationForm: React.FC = () => {

  const [formData, setFormData] = useState<OrganizationData>(initialData);
  const [err, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData(prevData => ({
      ...prevData,

      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Basic client-side validation check
    if (!formData.email || !formData.password || !formData.fullName) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const { email, password, fullName, description } = formData;


      const data = await registerOrganization(
        email,
        password,
        fullName,
        description
      );

      // On success: Store token and update UI
      localStorage.setItem("token", data.token);
      setSuccess(`Welcome, ${data.user.email}! Registration successful.`);

    } catch (err: any) {
      // Catch the structured error object { status, message } thrown by the API service
      console.error("Registration failed:", err);
      setError(err.message || "An unexpected registration error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <form onSubmit={handleSubmit} className="flex flex-col gap-3">

      <input
        type="text"
        name="name"
        placeholder="Organization Name"
        className="px-3 py-2 border border-gray-300 rounded-md"
      />

      <textarea
        name="description"
        placeholder="Description"
        className="px-3 py-2 border border-gray-300 rounded-md h-24 resize-none"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="px-3 py-2 border border-gray-300 rounded-md"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        className="px-3 py-2 border border-gray-300 rounded-md"
      />

      <button
        type="submit"
        className="py-2 rounded-md bg-blue-500 text-white font-bold hover:bg-blue-600"
      >
        Register
      </button>

    </form>
  );
};

export default OrganizationRegistrationForm;

