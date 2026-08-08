import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Radar, ShieldAlert } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const emptyForm = { name: "", email: "", phone: "", password: "", inviteCode: "" };

export default function AdminLogin() {
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, registerAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(loginForm.email, loginForm.password);
      if (data.role !== "ADMIN") {
        logout();
        setError("This account doesn't have administrator access.");
        return;
      }
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerAdmin(regForm);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid invite code or this email is already registered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-console-void flex items-center justify-center font-sora px-6 py-12">
      <div className="w-full max-w-sm bg-console-panel border border-white/5 p-10 rounded">
        <div className="flex items-center gap-2 mb-6">
          <Radar size={22} className="text-console-emerald" />
          <span className="font-semibold text-white">Control Tower</span>
        </div>

        <div className="flex border-b border-white/10 mb-8">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 pb-3 text-sm ${mode === "login" ? "text-console-emerald border-b-2 border-console-emerald" : "text-console-mist/50"}`}
          >
            Sign in
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 pb-3 text-sm ${mode === "register" ? "text-console-emerald border-b-2 border-console-emerald" : "text-console-mist/50"}`}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <p className="text-sm text-console-mist/60 mb-2">Restricted — authorized personnel only.</p>
            <input
              type="email" placeholder="Email" value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required
              className="w-full bg-console-void border border-white/10 px-3.5 py-2.5 text-sm rounded outline-none focus:border-console-emerald text-white placeholder:text-console-mist/40"
            />
            <input
              type="password" placeholder="Password" value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required
              className="w-full bg-console-void border border-white/10 px-3.5 py-2.5 text-sm rounded outline-none focus:border-console-emerald text-white placeholder:text-console-mist/40"
            />
            {error && <p className="text-console-crimson text-xs">{error}</p>}
            <button type="submit" className="w-full py-3 bg-console-emerald text-console-void font-medium text-sm rounded hover:brightness-110 transition-all">
              Enter console
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="flex items-start gap-2 bg-console-amber/10 border border-console-amber/30 rounded p-3 mb-2">
              <ShieldAlert size={15} className="text-console-amber shrink-0 mt-0.5" />
              <p className="text-xs text-console-amber/90">Admin accounts require an invite code — ask an existing administrator. This is intentionally not open self-signup.</p>
            </div>
            <input placeholder="Full name" value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} required
              className="w-full bg-console-void border border-white/10 px-3.5 py-2.5 text-sm rounded outline-none focus:border-console-emerald text-white placeholder:text-console-mist/40" />
            <input type="email" placeholder="Email" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} required
              className="w-full bg-console-void border border-white/10 px-3.5 py-2.5 text-sm rounded outline-none focus:border-console-emerald text-white placeholder:text-console-mist/40" />
            <input placeholder="Phone" value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
              className="w-full bg-console-void border border-white/10 px-3.5 py-2.5 text-sm rounded outline-none focus:border-console-emerald text-white placeholder:text-console-mist/40" />
            <input type="password" placeholder="Password (min 6 characters)" value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} required
              className="w-full bg-console-void border border-white/10 px-3.5 py-2.5 text-sm rounded outline-none focus:border-console-emerald text-white placeholder:text-console-mist/40" />
            <input placeholder="Invite code" value={regForm.inviteCode} onChange={(e) => setRegForm({ ...regForm, inviteCode: e.target.value })} required
              className="w-full bg-console-void border border-console-amber/30 px-3.5 py-2.5 text-sm rounded outline-none focus:border-console-amber text-white placeholder:text-console-mist/40 font-mono" />

            {error && <p className="text-console-crimson text-xs">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-3 bg-console-emerald text-console-void font-medium text-sm rounded hover:brightness-110 transition-all disabled:opacity-50">
              {loading ? "Creating account…" : "Register as administrator"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
