import { useState } from "react"; 
import {login} from '../api/authentication.api.ts';


export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent page reload
    try {
      // api call to verify login credentials
      const data = await login(email, password);
      console.log("Logged in:", data);
      localStorage.setItem("token", data.token);
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
    />

    <input
      type="password"
      placeholder="Password"
      className="px-3 py-2 border border-gray-300 rounded-md"
    />

    <button
      type="submit"
      className="py-2 rounded-md bg-blue-500 text-white font-bold hover:bg-blue-600"
    >
      Login
    </button>
</form>

  );
}
