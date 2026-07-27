import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ustpLogo from "../assets/ustp-logo.png";
import loginBg from "../assets/image.png";

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
    <div
      className="relative flex min-h-screen flex-col items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="absolute inset-0 bg-navy-dark/50" />

      <img src={ustpLogo} alt="USTP logo" className="relative z-10 mb-4 h-28 w-auto" />
      <h1 className="relative z-10 mb-6 font-plus-jakarta text-3xl font-bold [text-shadow:0_1px_6px_rgba(0,0,0,0.35)]">
        <span className="text-white">Chat</span>
        <span className="text-gold">Desk</span>
        <span className="text-white"> Admin</span>
      </h1>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-gray-200 bg-white/95 p-6 shadow-lg"
      >
        <div className="relative mb-4">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
              <path
                d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        <div className="relative mb-4">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gold">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        {errorMessage && <p className="mb-4 text-sm text-red-600">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-gold py-2.5 font-bold text-white hover:brightness-95 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
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
