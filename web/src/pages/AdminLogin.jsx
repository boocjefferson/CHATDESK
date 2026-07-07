import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role !== "admin") {
        setErrorMessage("This account is not authorized to access the admin dashboard.");
        return;
      }
      navigate("/tickets");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-gray-400">
        <span className="text-xs text-gray-400">Logo</span>
      </div>
      <h1 className="mb-6 text-3xl font-extrabold">ChatDesk Admin</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-gray-300 p-6">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="mb-4 w-full rounded-lg border border-gray-400 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="mb-4 w-full rounded-lg border border-gray-400 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
        />

        {errorMessage && <p className="mb-4 text-sm text-red-600">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg border border-gray-400 py-2 font-medium hover:bg-gray-100 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
      {/*
        Note: admin_login.png includes a "Sign up here" link, but
        claude/API_CONTRACT.md states admin accounts are created manually via
        `manage.py createsuperuser`, not self-registered. Omitted here on
        purpose - flag if this should actually be wired to something.
      */}
    </div>
  );
}
