import React from "react";
import { useState } from "react";
import { registerVolunteer } from '../api/authentication.api.ts';


// data that is being stored
interface VolunteerData {
  fullName: string;
  email: string;
  password: string;
  age: number | undefined;
}

// initial values of the variables
const initialData: VolunteerData = {

  fullName: " ",
  email: " ",
  password: " ",
  age: undefined
};

const VolunteerRegistrationForm: React.FC = () => {

  const [formData, setFormData] = useState<VolunteerData>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData(prevData => ({
      ...prevData,
      // Conditional logic to handle age (number) vs. other fields (string)
      [name]: type === 'number'
        ? (value ? parseInt(value, 10) : undefined)
        : value,
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
      const { email, password, fullName, age } = formData;

      // Ensure age is passed as a number or undefined/null for the API
      const registrationAge = age && !isNaN(age) ? age : undefined;

      const data = await registerVolunteer(
        email,
        password,
        fullName,
        registrationAge
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
        name="fullName"
        placeholder="Full Name"
        className="px-3 py-2 border border-gray-300 rounded-md"
        value={formData.fullName}
        onChange={handleChange}
      />

      <input
        type="number"
        name="age"
        placeholder="Age"
        className="px-3 py-2 border border-gray-300 rounded-md"
        value={formData.age ?? ""}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="px-3 py-2 border border-gray-300 rounded-md"
        value={formData.email}
        onChange={handleChange}

      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        className="px-3 py-2 border border-gray-300 rounded-md"
        value={formData.password}
        onChange={handleChange}
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

export default VolunteerRegistrationForm;

