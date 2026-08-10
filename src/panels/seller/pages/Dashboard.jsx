import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Package, ClipboardList, IndianRupee } from "lucide-react";
import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import { useSeller } from "../../../context/SellerContext";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
}

const FALLBACK_ORDERS = [
  { id: 1, status: "PLACED", totalAmount: 2400, createdAt: "2026-07-28T10:00:00" },
  { id: 2, status: "SHIPPED", totalAmount: 5200, createdAt: "2026-07-27T14:30:00" },
  { id: 3, status: "DELIVERED", totalAmount: 990, createdAt: "2026-07-25T09:15:00" },
];

export default function SellerDashboard() {
  const { user } = useAuth();
  const { sellerId, seller, loading: sellerLoading } = useSeller();
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [orders, setOrders] = useState(FALLBACK_ORDERS);

  useEffect(() => {
    if (!sellerId) return;
    api.get(`/dashboard/seller/${sellerId}`).then((res) => setStats(res.data)).catch(() => {});
    api.get(`/order/sellers/${sellerId}`).then((res) => setOrders(res.data.slice(0, 5))).catch(() => {});
  }, [sellerId]);
const { logout } = useAuth();

const handleLogout = () => {
    logout("SELLER");
    navigate("/seller/login", { replace: true });
};
  const cards = [
    { label: "Total Products", value: stats.totalProducts, icon: Package },
    { label: "Total Orders", value: stats.totalOrders, icon: ClipboardList },
    { label: "Revenue", value: formatINR(stats.totalRevenue), icon: IndianRupee },
    { label: "Growth (30d)", value: "+12.4%", icon: TrendingUp },
  ];

  if (!sellerLoading && !seller) {
    return (
      <div className="bg-white border border-ledger-slate/10 rounded-sm p-8 text-center">
        <p className="text-ledger-slate mb-2">No seller profile linked to this account.</p>
        <p className="text-sm text-ledger-slate/50">This shouldn't normally happen if you registered through "Register your business" — try signing out and back in.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl text-ledger-slate mb-1">Welcome back, {user?.name?.split(" ")[0] || "Seller"}</h1>
      <p className="text-ledger-slate/50 text-sm mb-8">Here's how your storefront is performing.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-ledger-slate/10 rounded-sm p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-ledger-copper" />
            <Icon size={18} className="text-ledger-copper mb-3" />
            <p className="text-2xl font-mono text-ledger-slate">{value}</p>
            <p className="text-xs text-ledger-slate/50 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-ledger-slate/10 rounded-sm">
        <div className="px-6 py-4 border-b border-ledger-slate/10 flex items-center justify-between">
          <h2 className="text-sm font-medium text-ledger-slate">Recent orders</h2>
          <Link to="/seller/orders" className="text-xs text-ledger-copper hover:underline">View all →</Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-ledger-slate/40 border-b border-ledger-slate/10">
              <th className="px-6 py-3 font-normal">Order</th>
              <th className="px-6 py-3 font-normal">Date</th>
              <th className="px-6 py-3 font-normal">Status</th>
              <th className="px-6 py-3 font-normal text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="ledger-row border-b border-ledger-slate/5 last:border-0">
                <td className="px-6 py-3.5 font-mono text-ledger-slate">{o.OrderNumber || `#${String(o.id).padStart(5, "0")}`}</td>
                <td className="px-6 py-3.5 text-ledger-slate/60">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                <td className="px-6 py-3.5">
                  <span className={`text-xs px-2 py-1 rounded-sm ${
                    o.status === "DELIVERED" ? "bg-ledger-sage/10 text-ledger-sage" :
                    o.status === "SHIPPED" ? "bg-ledger-copper/10 text-ledger-copper" :
                    "bg-ledger-slate/10 text-ledger-slate/60"
                  }`}>{o.status}</span>
                </td>
                <td className="px-6 py-3.5 text-right font-mono">{formatINR(o.totalAmount)}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-ledger-slate/40">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}