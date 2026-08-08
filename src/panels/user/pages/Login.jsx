import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        navigate("/");
      } else {
        await signup(form);
        setMode("login");
        setError("Account created — please sign in.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 md:py-20">
      <div className="bg-white rounded-lg border border-bazaar-border p-8">
        <div className="text-center mb-6">
          <span className="font-bazaar font-extrabold text-xl text-bazaar-primary">Bazaar<span className="text-bazaar-gold">Mart</span></span>
        </div>
        <h1 className="font-bazaar font-bold text-xl text-bazaar-ink text-center mb-1">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-bazaar-sub text-center text-sm mb-7">
          {mode === "login" ? "Sign in to view orders and track deliveries." : "Sign up to start shopping thousands of deals."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "signup" && (
            <input
              name="name" placeholder="Full name" value={form.name} onChange={handleChange} required
              className="w-full border border-bazaar-border rounded-md px-3.5 py-2.5 bg-bazaar-bg outline-none focus:border-bazaar-primary text-sm"
            />
          )}
          <input
            name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required
            className="w-full border border-bazaar-border rounded-md px-3.5 py-2.5 bg-bazaar-bg outline-none focus:border-bazaar-primary text-sm"
          />
          {mode === "signup" && (
            <input
              name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange}
              className="w-full border border-bazaar-border rounded-md px-3.5 py-2.5 bg-bazaar-bg outline-none focus:border-bazaar-primary text-sm"
            />
          )}
          <input
            name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required
            className="w-full border border-bazaar-border rounded-md px-3.5 py-2.5 bg-bazaar-bg outline-none focus:border-bazaar-primary text-sm"
          />
<div className="flex justify-end">
  <button
    type="button"
    onClick={() => navigate("/forgot-password")}
    className="text-sm text-bazaar-primary hover:underline"
  >
    Forgot Password?
  </button>
</div>
          {error && <p className="text-bazaar-accent text-xs font-medium">{error}</p>}

          <button type="submit" className="w-full py-3 bg-bazaar-accent text-white font-bold text-sm rounded-md hover:brightness-95 transition-all mt-2">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-bazaar-sub mt-6">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-bazaar-primary font-semibold underline">
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
