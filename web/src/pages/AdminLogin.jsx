import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ustpLogo from "../assets/ustp-logo.png";

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
    <div className="flex min-h-screen font-plus-jakarta">
      {/* Left panel: sign-in form, sized up for readability */}
      <div className="flex w-full flex-col justify-center px-8 py-12 sm:px-16 lg:w-[42%] lg:px-20">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 flex items-center gap-3">
            <img src={ustpLogo} alt="USTP logo" className="h-11 w-10 shrink-0 object-contain" />
            <span className="text-xl font-bold text-navy">
              Chat<span className="text-gold">Desk</span>
            </span>
          </div>

          <h1 className="mb-2 text-4xl font-bold text-navy">Hello, Admin.</h1>
          <p className="mb-10 text-base text-gray-500">
            Sign in to manage FAQs, tickets, and student inquiries.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">Email</label>
              <input
                type="email"
                placeholder="you@ustp.edu.ph"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full border-b-2 border-gray-200 bg-transparent py-2 text-base text-navy placeholder:text-gray-300 focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full border-b-2 border-gray-200 bg-transparent py-2 text-base text-navy placeholder:text-gray-300 focus:border-gold focus:outline-none"
              />
            </div>

            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-navy py-2.5 text-sm font-bold text-white transition hover:bg-navy-dark disabled:opacity-50"
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </form>
          {/*
            Note: admin_login.png (the original approved prototype) includes a
            "Sign up here" link, but claude/API_CONTRACT.md states admin accounts
            are created manually via `manage.py createsuperuser`, not
            self-registered - omitted on purpose. Same reasoning applies to
            "Login with Google" / "Forgot password" seen in later design
            references: neither has a real backend endpoint, so they're left out
            rather than built as non-functional UI.
          */}
        </div>
      </div>

      {/* Right panel: custom USTP-branded visual (no stock/reference imagery) */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-navy to-navy-dark lg:flex lg:w-[58%] lg:flex-col lg:justify-end lg:p-14">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-10"
          viewBox="0 0 600 800"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line x1="-80" y1="800" x2="520" y2="0" stroke="white" strokeWidth="1" />
          <line x1="0" y1="800" x2="600" y2="0" stroke="white" strokeWidth="1" />
          <line x1="80" y1="800" x2="680" y2="0" stroke="white" strokeWidth="1" />
          <line x1="160" y1="800" x2="760" y2="0" stroke="white" strokeWidth="1" />
          <line x1="240" y1="800" x2="840" y2="0" stroke="white" strokeWidth="1" />
          <line x1="320" y1="800" x2="920" y2="0" stroke="white" strokeWidth="1" />
        </svg>

        <p className="relative z-10 text-sm text-white/50">
          © 2026 ChatDesk — USTP Office of Student Affairs.
        </p>
      </div>
    </div>
  );
}
