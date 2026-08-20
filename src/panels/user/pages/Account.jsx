import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, MapPin, Package, LogOut, ChevronDown, ChevronUp, Mail, Phone, Check } from "lucide-react";
import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { useDelivery } from "../../../context/DeliveryContext";

export default function Account() {
  const { user, logout } = useAuth();
  const { setPincode } = useDelivery();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settingDefault, setSettingDefault] = useState(null);

  const loadAddresses = () => {
    if (!user) return;
    api.get(`/address/userId/${user.userId}`)
      .then((res) => setAddresses(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    loadAddresses();
    // Login response me phone nahi aata — "My Profile" ke liye poora record alag se fetch karna padta hai
    api.get(`/users/${user.userId}`).then((res) => setProfile(res.data)).catch(() => setProfile(null));
  }, [user]);

  const makeDefault = async (address) => {
    setSettingDefault(address.id);
    try {
      await api.patch(`/address/${address.id}/default`);
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === address.id })));
      setPincode(address.pinCode); // delivery pincode bhi sync kar do
      showToast("Default address updated");
    } catch (err) {
      showToast(err.response?.data?.error || "Couldn't update default address", "error");
    } finally {
      setSettingDefault(null);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <p className="text-bazaar-sub mb-3">Sign in to view your account.</p>
        <Link to="/login" className="text-bazaar-primary underline font-medium">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-3 md:px-6 py-6 md:py-8">
      <h1 className="font-bazaar font-bold text-xl md:text-2xl text-bazaar-ink mb-6">My Account</h1>

      {/* Addresses */}
      <div className="bg-white rounded-lg border border-bazaar-border p-5 mb-4">
        <h2 className="flex items-center gap-2 text-xs font-bold text-bazaar-ink uppercase tracking-wide mb-3">
          <MapPin size={14} className="text-bazaar-primary" /> Your Addresses
        </h2>

        {loading ? (
          <p className="text-sm text-bazaar-sub">Loading…</p>
        ) : addresses.length === 0 ? (
          <p className="text-sm text-bazaar-sub/60 italic">No address saved yet — one gets added at checkout.</p>
        ) : (
          <div className="space-y-2.5">
            {addresses.map((a) => (
              <div key={a.id} className={`flex items-start justify-between gap-3 border rounded-md p-3 ${a.isDefault ? "border-bazaar-primary bg-bazaar-primary/5" : "border-bazaar-border"}`}>
                <div className="text-sm">
                  <p className="text-bazaar-ink">{a.addressLine}, {a.city} — {a.pinCode}</p>
                  {a.isDefault && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-bazaar-success mt-1">
                      <Check size={11} /> DEFAULT
                    </span>
                  )}
                </div>
                {!a.isDefault && (
                  <button
                    onClick={() => makeDefault(a)}
                    disabled={settingDefault === a.id}
                    className="text-xs font-semibold text-bazaar-primary hover:underline shrink-0 disabled:opacity-40"
                  >
                    {settingDefault === a.id ? "Setting…" : "Set as default"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Profile — tap to reveal */}
      <div className="bg-white rounded-lg border border-bazaar-border mb-4 overflow-hidden">
        <button onClick={() => setProfileOpen(!profileOpen)} className="w-full flex items-center justify-between p-5 text-left">
          <span className="flex items-center gap-2 text-sm font-semibold text-bazaar-ink">
            <User size={16} className="text-bazaar-primary" /> My Profile
          </span>
          {profileOpen ? <ChevronUp size={16} className="text-bazaar-sub" /> : <ChevronDown size={16} className="text-bazaar-sub" />}
        </button>
        {profileOpen && (
          <div className="px-5 pb-5 space-y-3 border-t border-bazaar-border pt-4">
            <div className="flex items-center gap-2.5 text-sm">
              <User size={14} className="text-bazaar-sub shrink-0" />
              <span className="text-bazaar-ink">{profile?.name || user.name}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Mail size={14} className="text-bazaar-sub shrink-0" />
              <span className="text-bazaar-ink">{profile?.email || user.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <Phone size={14} className="text-bazaar-sub shrink-0" />
              <span className="text-bazaar-ink">{profile?.phone || "Not added"}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-lg border border-bazaar-border divide-y divide-bazaar-border overflow-hidden mb-5">
        <Link to="/orders" className="flex items-center gap-2.5 p-4 text-sm text-bazaar-ink hover:bg-bazaar-bg transition-colors">
          <Package size={16} className="text-bazaar-primary" /> My Orders
        </Link>
      </div>

      <button onClick={() => { logout("USER");
          navigate("/login", { replace: true }); }} className="flex items-center gap-2 text-sm text-bazaar-accent font-medium">
        <LogOut size={15} /> Sign out
      </button>
    </div>
  );
}