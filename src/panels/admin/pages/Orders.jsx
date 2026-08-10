import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import api from "../../../api/axios";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
}

const STATUS_STYLE = {
  PLACED: "bg-console-mist/10 text-console-mist",
  CONFIRMED: "bg-console-amber/10 text-console-amber",
  SHIPPED: "bg-blue-500/10 text-blue-400",
  OUT_FOR_DELIVERY: "bg-console-amber/10 text-console-amber",
  DELIVERED: "bg-console-emerald/10 text-console-emerald",
  CANCELLED: "bg-console-crimson/10 text-console-crimson",
  RETURNED: "bg-console-mist/10 text-console-mist",
};

const FALLBACK = [
  { id: 1, OrderNumber: "OD202608050001", status: "PLACED", totalAmount: 2400, createdAt: "2026-08-05T10:00:00", buyerName: "Ananya Rao", sellerName: "Kāya Pottery Studio" },
  { id: 2, OrderNumber: "OD202608040002", status: "SHIPPED", totalAmount: 5200, createdAt: "2026-08-04T14:30:00", buyerName: "Vikram Shah", sellerName: "Northline Woodwork" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    api.get("/order/all")
      .then((res) => setOrders(res.data?.length ? res.data : FALLBACK))
      .catch(() => setOrders(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);
  const statuses = ["ALL", "PLACED", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "RETURNED"];

  return (
    <div>
      <h1 className="text-xl text-white mb-1">All Orders</h1>
      <p className="text-console-mist/50 text-sm mb-6">Full visibility and override control across the platform.</p>

      <div className="flex gap-2 mb-5 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded font-mono ${
              filter === s ? "bg-console-emerald text-console-void font-semibold" : "bg-console-panel text-console-mist border border-white/10"
            }`}
          >
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-console-mist/40 text-sm">Loading…</p>
      ) : (
        <div className="bg-console-panel border border-white/5 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-console-mist/40 border-b border-white/5">
                <th className="px-6 py-3 font-normal">Order</th>
                <th className="px-6 py-3 font-normal">Customer</th>
                <th className="px-6 py-3 font-normal">Seller</th>
                <th className="px-6 py-3 font-normal">Date</th>
                <th className="px-6 py-3 font-normal">Status</th>
                <th className="px-6 py-3 font-normal text-right">Amount</th>
                <th className="px-6 py-3 font-normal w-8"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-6 py-3.5 font-mono text-white">{o.OrderNumber || `#${String(o.id).padStart(5, "0")}`}</td>
                  <td className="px-6 py-3.5 text-console-mist">{o.buyerName || "—"}</td>
                  <td className="px-6 py-3.5 text-console-mist">{o.sellerName || "—"}</td>
                  <td className="px-6 py-3.5 text-console-mist/60">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-6 py-3.5">
                    <span className={`text-xs px-2 py-1 rounded ${STATUS_STYLE[o.status] || "bg-console-mist/10 text-console-mist"}`}>
                      {o.status?.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right font-mono text-white">{formatINR(o.totalAmount)}</td>
                  <td className="px-6 py-3.5">
                    <Link to={`/admin/orders/${o.id}`} className="text-console-mist hover:text-console-emerald">
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-console-mist/40">No orders match this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}