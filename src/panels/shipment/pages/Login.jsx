import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const emptyForm = { name: "", email: "", phone: "", password: "", vehicleType: "BIKE", vehicleNumber: "" };

export default function ShipmentLogin() {
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, registerDelivery, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(loginForm.email, loginForm.password, "DELIVERY_PARTNER");
      if (data.role !== "DELIVERY_PARTNER" && data.role !== "ADMIN") {
        logout();
        setError("This account isn't registered as a delivery partner. Use \"Register\" below.");
        return;
      }
      navigate("/shipment/deliveries");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerDelivery(regForm);
      navigate("/shipment/deliveries");
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't complete registration. Check that the email isn't already in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transit-navy flex items-center justify-center font-barlow px-6 py-12">
      <div className="w-full max-w-md bg-transit-fog p-10 rounded-sm">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="bg-transit-orange p-1.5 rounded-sm"><Truck size={18} className="text-transit-navy" /></div>
          <span className="text-xl uppercase tracking-wide font-semibold text-transit-navy">Transit Board</span>
        </div>

        <div className="flex border-b-2 border-transit-navy/10 mb-8">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 pb-3 text-sm uppercase tracking-wide ${mode === "login" ? "text-transit-teal border-b-2 border-transit-teal -mb-0.5" : "text-transit-navy/40"}`}
          >
            Sign in
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 pb-3 text-sm uppercase tracking-wide ${mode === "register" ? "text-transit-teal border-b-2 border-transit-teal -mb-0.5" : "text-transit-navy/40"}`}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <p className="text-sm text-transit-navy/50 mb-2">Track and update assigned deliveries.</p>
            <input
              type="email" placeholder="Email" value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required
              className="w-full border-2 border-transit-navy/10 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-transit-teal bg-white"
            />
            <input
              type="password" placeholder="Password" value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required
              className="w-full border-2 border-transit-navy/10 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-transit-teal bg-white"
            />
            {error && <p className="text-transit-orange text-xs">{error}</p>}
            <button type="submit" className="w-full py-3 bg-transit-teal text-white uppercase tracking-wide text-sm rounded-sm hover:bg-transit-tealsoft transition-colors">
              Sign in
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <p className="text-xs uppercase tracking-wider text-transit-navy/40 pt-1">Your details</p>
            <input placeholder="Full name" value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} required
              className="w-full border-2 border-transit-navy/10 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-transit-teal bg-white" />
            <input type="email" placeholder="Email" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} required
              className="w-full border-2 border-transit-navy/10 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-transit-teal bg-white" />
            <input placeholder="Phone" value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
              className="w-full border-2 border-transit-navy/10 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-transit-teal bg-white" />
            <input type="password" placeholder="Password (min 6 characters)" value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} required
              className="w-full border-2 border-transit-navy/10 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-transit-teal bg-white" />

            <p className="text-xs uppercase tracking-wider text-transit-navy/40 pt-2">Vehicle details</p>
            <select value={regForm.vehicleType} onChange={(e) => setRegForm({ ...regForm, vehicleType: e.target.value })}
              className="w-full border-2 border-transit-navy/10 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-transit-teal bg-white">
              <option value="BIKE">Bike</option>
              <option value="VAN">Van</option>
              <option value="TRUCK">Truck</option>
            </select>
            <input placeholder="Vehicle number" value={regForm.vehicleNumber} onChange={(e) => setRegForm({ ...regForm, vehicleNumber: e.target.value })} required
              className="w-full border-2 border-transit-navy/10 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-transit-teal bg-white font-mono" />

            {error && <p className="text-transit-orange text-xs">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-3 bg-transit-teal text-white uppercase tracking-wide text-sm rounded-sm hover:bg-transit-tealsoft transition-colors disabled:opacity-50">
              {loading ? "Setting up your account…" : "Register"}
            </button>
            <p className="text-xs text-transit-navy/40 text-center normal-case">Your account starts PENDING until an admin verifies your documents.</p>
          </form>
        )}
      </div>
    </div>
  );
}
