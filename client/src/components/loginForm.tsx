import { useState } from "react"; 
import { login } from '../api/authentication.api.ts';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}


export default function LoginForm({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    try {
      const data = await login(email, password);
      console.log("Logged in:", data);
      localStorage.setItem("token", data.token);
      onLoginSuccess(data.user);

      
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        placeholder="Email"
        className="px-3 py-2 border border-gray-300 rounded-md"
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />

      
      <input
        type="password"
        placeholder="Password"
        className="px-3 py-2 border border-gray-300 rounded-md"
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        className="py-2 rounded-md bg-blue-500 text-white font-bold hover:bg-blue-600"
      >
        Login
      </button>

      
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>} 
    </form>
  );
}