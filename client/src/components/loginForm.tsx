import { useState } from "react"; 
import { login, requestPasswordReset, resetPassword } from '../api/authentication.api.ts';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [message, setMessage] = useState(""); 
  const [resetToken, setResetToken] = useState(""); 
  const [newPassword, setNewPassword] = useState(""); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      onLoginSuccess(data.user);
      window.location.reload();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handlePasswordResetRequest = async () => {
    if (!email) return setError("Please enter your email first");
    setError("");
    setMessage("");
    try {
      const response = await requestPasswordReset(email);
      setResetToken(response.token);
      setMessage(response.message || "Reset token generated. Fill it below to reset your password.");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handlePasswordResetConfirm = async () => {
    if (!resetToken || !newPassword) return setError("Token and new password are required");
    setError("");
    setMessage("");
    try {
      const response = await resetPassword(resetToken, newPassword);
      setMessage(response.message || "Password reset successfully! You can now log in.");
      setResetToken("");
      setNewPassword("");
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

      {/* Forgot password */}
      <button
        type="button"
        onClick={handlePasswordResetRequest}
        className="mt-2 text-sm text-blue-600 hover:underline"
      >
        Forgot password?
      </button>

      {/* Reset password fields */}
      {resetToken && (
        <div className="flex flex-col gap-2 mt-2">
          <input
            type="text"
            placeholder="Reset token"
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
          />
          <input
            type="password"
            placeholder="New password"
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={handlePasswordResetConfirm}
            className="py-2 rounded-md bg-green-500 text-white font-bold hover:bg-green-600"
          >
            Reset Password
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
    </form>
  );
}