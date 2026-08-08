import { useEffect, useState } from "react";
import { Users, Store, Package, ShoppingCart, IndianRupee, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../../../api/axios";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
}

const TREND = [
  { day: "Mon", revenue: 42000 }, { day: "Tue", revenue: 38000 }, { day: "Wed", revenue: 51000 },
  { day: "Thu", revenue: 47000 }, { day: "Fri", revenue: 63000 }, { day: "Sat", revenue: 71000 }, { day: "Sun", revenue: 58000 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 1284, totalSellers: 96, pendingSellers: 7, totalProducts: 512, totalOrders: 2043, totalRevenue: 4820000,
  });

  useEffect(() => {
    api.get("/dashboard/admin").then((res) => setStats(res.data)).catch(() => {});
  }, []);

  const cards = [
    { label: "Total Users", value: stats.totalUsers?.toLocaleString("en-IN"), icon: Users, accent: "console-emerald" },
    { label: "Active Sellers", value: stats.totalSellers?.toLocaleString("en-IN"), icon: Store, accent: "console-amber" },
    { label: "Pending Approvals", value: stats.pendingSellers, icon: Clock, accent: "console-crimson" },
    { label: "Live Products", value: stats.totalProducts?.toLocaleString("en-IN"), icon: Package, accent: "console-emerald" },
    { label: "Total Orders", value: stats.totalOrders?.toLocaleString("en-IN"), icon: ShoppingCart, accent: "console-amber" },
    { label: "Gross Revenue", value: formatINR(stats.totalRevenue), icon: IndianRupee, accent: "console-emerald" },
  ];

  return (
    <div>
      <h1 className="text-xl text-white mb-1">Platform overview</h1>
      <p className="text-console-mist/50 text-sm mb-8">Live snapshot across the marketplace.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="bg-console-panel border border-white/5 rounded p-5">
            <div className="flex items-center justify-between mb-4">
              <Icon size={17} className={`text-${accent}`} />
            </div>
            <p className="text-2xl font-mono text-white">{value}</p>
            <p className="text-xs text-console-mist/50 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-console-panel border border-white/5 rounded p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm text-white">Revenue — last 7 days</h2>
          <span className="text-xs font-mono text-console-mist/40">Illustrative trend</span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={TREND}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3FAE7C" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3FAE7C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="day" stroke="#8A94A3" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#8A94A3" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
            <Tooltip
              contentStyle={{ background: "#1D242D", border: "1px solid #ffffff20", borderRadius: 4, fontSize: 12 }}
              labelStyle={{ color: "#8A94A3" }}
              formatter={(v) => formatINR(v)}
            />
            <Area type="monotone" dataKey="revenue" stroke="#3FAE7C" strokeWidth={2} fill="url(#rev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
