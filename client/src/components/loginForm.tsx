import { useState } from "react"; 
import { login } from '../api/authentication.api.ts';


export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // You are tracking this error, but not displaying it yet!

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear previous errors on new submission
    
    try {
      const data = await login(email, password);
      console.log("Logged in:", data);
      localStorage.setItem("token", data.token);
      // Optional: Add a redirect or success state here
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* 🔴 FIX: Add value and onChange to capture Email input */}
      <input
        type="email"
        placeholder="Email"
        className="px-3 py-2 border border-gray-300 rounded-md"
        value={email} // <-- Added
        onChange={(e) => setEmail(e.target.value)} // <-- Added
      />

      {/* 🔴 FIX: Add value and onChange to capture Password input */}
      <input
        type="password"
        placeholder="Password"
        className="px-3 py-2 border border-gray-300 rounded-md"
        value={password} // <-- Added
        onChange={(e) => setPassword(e.target.value)} // <-- Added
      />

      <button
        type="submit"
        className="py-2 rounded-md bg-blue-500 text-white font-bold hover:bg-blue-600"
      >
        Login
      </button>

      {/* 💡 Improvement: Display the error message to the user */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>} 
    </form>
  );
}