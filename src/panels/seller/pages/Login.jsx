import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const emptyForm = { name: "", email: "", phone: "", password: "", business_name: "", gst_number: "", bank_details: "" };

export default function SellerLogin() {
  const [mode, setMode] = useState("login"); // login | register
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, registerSeller, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(loginForm.email, loginForm.password,"SELLER");

      navigate("/seller/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerSeller(regForm);
      navigate("/seller/dashboard");
    } catch (err) {
        console.log(err)
      setError(err.response?.data?.error || "Couldn't complete registration. Check that the email isn't already in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ledger-slate flex items-center justify-center font-sora px-6 py-12">
      <div className="w-full max-w-md bg-ledger-paper p-10 rounded-sm">
        <div className="flex items-center gap-2 mb-6">
          <Store size={22} className="text-ledger-copper" />
          <span className="font-semibold text-ledger-slate">Merchant Ledger</span>
        </div>

        <div className="flex border-b border-ledger-slate/15 mb-8">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 pb-3 text-sm ${mode === "login" ? "text-ledger-copper border-b-2 border-ledger-copper" : "text-ledger-slate/40"}`}
          >
            Sign in
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 pb-3 text-sm ${mode === "register" ? "text-ledger-copper border-b-2 border-ledger-copper" : "text-ledger-slate/40"}`}
          >
            Register your business
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <p className="text-sm text-ledger-slate/50 mb-2">Manage your catalogue, orders, and stock.</p>
            <input
              type="email" placeholder="Email" value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required
              className="w-full border border-ledger-slate/15 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-ledger-copper bg-white"
            />
            <input
              type="password" placeholder="Password" value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required
              className="w-full border border-ledger-slate/15 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-ledger-copper bg-white"
            />
            {error && <p className="text-red-600 text-xs">{error}</p>}
            <button type="submit" className="w-full py-3 bg-ledger-copper text-white text-sm rounded-sm hover:bg-ledger-coppersoft transition-colors">
              Sign in
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <p className="text-xs uppercase tracking-wider text-ledger-slate/40 pt-1">Your account</p>
            <input placeholder="Full name" value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} required
              className="w-full border border-ledger-slate/15 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-ledger-copper bg-white" />
            <input type="email" placeholder="Email" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} required
              className="w-full border border-ledger-slate/15 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-ledger-copper bg-white" />
            <input placeholder="Phone" value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
              className="w-full border border-ledger-slate/15 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-ledger-copper bg-white" />
            <input type="password" placeholder="Password (min 6 characters)" value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} required
              className="w-full border border-ledger-slate/15 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-ledger-copper bg-white" />

            <p className="text-xs uppercase tracking-wider text-ledger-slate/40 pt-2">Business details</p>
            <input placeholder="Business name" value={regForm.business_name} onChange={(e) => setRegForm({ ...regForm, business_name: e.target.value })} required
              className="w-full border border-ledger-slate/15 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-ledger-copper bg-white" />
            <input placeholder="GST number" value={regForm.gst_number} onChange={(e) => setRegForm({ ...regForm, gst_number: e.target.value })} required
              className="w-full border border-ledger-slate/15 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-ledger-copper bg-white font-mono" />
            <input placeholder="Bank account details" value={regForm.bank_details} onChange={(e) => setRegForm({ ...regForm, bank_details: e.target.value })}
              className="w-full border border-ledger-slate/15 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-ledger-copper bg-white" />

            {error && <p className="text-red-600 text-xs">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-3 bg-ledger-copper text-white text-sm rounded-sm hover:bg-ledger-coppersoft transition-colors disabled:opacity-50">
              {loading ? "Setting up your storefront…" : "Create seller account"}
            </button>
            <p className="text-xs text-ledger-slate/40 text-center">Your account starts in PENDING status — an admin will review it before you can list live products.</p>
          </form>
        )}
      </div>
    </div>
  );
}
