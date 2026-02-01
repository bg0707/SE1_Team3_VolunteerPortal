import React, { useState } from "react";
import { registerVolunteer } from '../api/authentication.api.ts';

interface VolunteerData {
  fullName: string;
  email: string;
  password: string;
  age: number | undefined;
}

const initialData: VolunteerData = {
  fullName: "",
  email: "",
  password: "",
  age: undefined
};

// Add switchToLogin prop
interface Props {
  switchToLogin: () => void;
}

const VolunteerRegistrationForm: React.FC<Props> = ({ switchToLogin }) => {
  const [formData, setFormData] = useState<VolunteerData>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'number' ? (value ? parseInt(value, 10) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.email || !formData.password || !formData.fullName) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const { email, password, fullName, age } = formData;
      const registrationAge = age && !isNaN(age) ? age : undefined;

      const data = await registerVolunteer(email, password, fullName, registrationAge);

      localStorage.setItem("token", data.token);
      setSuccess(`Welcome, ${data.user.email}! Registration successful.`);

      // Automatically switch to login view after success
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
      <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="px-3 py-2 border border-gray-300 rounded-md" />

      <input type="number" name="age" placeholder="Age" value={formData.age ?? ""} onChange={handleChange} className="px-3 py-2 border border-gray-300 rounded-md" />

      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="px-3 py-2 border border-gray-300 rounded-md" />

      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="px-3 py-2 border border-gray-300 rounded-md" />

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}
      <button
        type="submit"
        disabled={loading}
        className="py-2 rounded-md bg-blue-500 text-white font-bold hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default VolunteerRegistrationForm;
