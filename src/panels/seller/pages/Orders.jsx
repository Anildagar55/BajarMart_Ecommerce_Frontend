import { useEffect, useState } from "react";
import { ArrowRight, Clock, PackageCheck, Truck } from "lucide-react";
import api from "../../../api/axios";
import { useSeller } from "../../../context/SellerContext";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
}

// Seller ke control me sirf ye 3 phase hain — aage ka lifecycle (Out for Delivery,
// Delivered, Cancelled, Returned) sirf Admin control karta hai (backend isko enforce karta hai)
const PHASES = [
  { status: "PLACED", label: "Pending", icon: Clock, next: "CONFIRMED", nextLabel: "Mark Ready to Ship" },
  { status: "CONFIRMED", label: "Ready to Ship", icon: PackageCheck, next: "SHIPPED", nextLabel: "Mark as Shipped" },
  { status: "SHIPPED", label: "Shipped", icon: Truck, next: null, nextLabel: null },
];

const STATUS_STYLE = {
  PLACED: "bg-ledger-slate/10 text-ledger-slate/70",
  CONFIRMED: "bg-amber-100 text-amber-700",
  SHIPPED: "bg-ledger-copper/10 text-ledger-copper",
  OUT_FOR_DELIVERY: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-ledger-sage/10 text-ledger-sage",
  CANCELLED: "bg-red-100 text-red-600",
  RETURNED: "bg-gray-200 text-gray-600",
};

const FALLBACK_ORDERS = [
  { id: 1, OrderNumber: "OD202608010001", status: "PLACED", totalAmount: 2400, createdAt: "2026-08-05T10:00:00", buyerName: "Ananya Rao", items: [{ id: 1, productTitle: "Ceramic Vase", quantity: 1 }] },
  { id: 2, OrderNumber: "OD202608010002", status: "CONFIRMED", totalAmount: 5200, createdAt: "2026-08-04T14:30:00", buyerName: "Vikram Shah", items: [{ id: 2, productTitle: "Brass Lamp", quantity: 1 }] },
];

export default function SellerOrders() {
  const { sellerId, loading: sellerLoading } = useSeller();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    if (!sellerId) return;
    api.get(`/order/sellers/${sellerId}`)
      .then((res) => setOrders(res.data?.length ? res.data : FALLBACK_ORDERS))
      .catch(() => setOrders(FALLBACK_ORDERS))
      .finally(() => setLoading(false));
  };

  useEffect(load, [sellerId]);

  const advance = async (order, nextStatus) => {
    setUpdating(order.id);
    setError("");
    try {
      await api.put(`/order/advance/${order.id}`, null, { params: { status: nextStatus } });
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: nextStatus } : o)));
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't update order status.");
    } finally {
      setUpdating(null);
    }
  };

  if (sellerLoading || loading) return <p className="text-ledger-slate/40 text-sm">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl text-ledger-slate mb-1">Orders</h1>
      <p className="text-ledger-slate/50 text-sm mb-2">Move orders through your fulfillment pipeline.</p>
      <p className="text-xs text-ledger-slate/40 mb-8">
        You control <strong>Pending → Ready to Ship → Shipped</strong>. Once shipped, delivery tracking is managed by the platform.
      </p>

      {error && <div className="bg-red-50 text-red-600 text-sm rounded-sm p-3 mb-4">{error}</div>}

      {orders.length === 0 ? (
        <div className="bg-white border border-ledger-slate/10 rounded-sm p-10 text-center text-ledger-slate/40">
          No orders yet.
        </div>
      ) : (
        <div className="bg-white border border-ledger-slate/10 rounded-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-ledger-slate/40 border-b border-ledger-slate/10">
                <th className="px-6 py-3 font-normal">Order</th>
                <th className="px-6 py-3 font-normal">Customer</th>
                <th className="px-6 py-3 font-normal">Items</th>
                <th className="px-6 py-3 font-normal">Date</th>
                <th className="px-6 py-3 font-normal">Status</th>
                <th className="px-6 py-3 font-normal text-right">Amount</th>
                <th className="px-6 py-3 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const phase = PHASES.find((p) => p.status === o.status);
                return (
                  <tr key={o.id} className="ledger-row border-b border-ledger-slate/5 last:border-0 align-top">
                    <td className="px-6 py-4 font-mono text-ledger-slate">{o.OrderNumber || `#${String(o.id).padStart(5, "0")}`}</td>
                    <td className="px-6 py-4 text-ledger-slate/70">{o.buyerName || "—"}</td>
                    <td className="px-6 py-4 text-ledger-slate/60 max-w-[220px]">
                      {(o.items || []).map((i) => `${i.productTitle} ×${i.quantity}`).join(", ")}
                    </td>
                    <td className="px-6 py-4 text-ledger-slate/60">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-sm inline-block ${STATUS_STYLE[o.status] || "bg-ledger-slate/10 text-ledger-slate/60"}`}>
                        {phase ? phase.label : o.status?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono">{formatINR(o.totalAmount)}</td>
                    <td className="px-6 py-4 text-right">
                      {phase?.next ? (
                        <button
                          onClick={() => advance(o, phase.next)}
                          disabled={updating === o.id}
                          className="flex items-center gap-1.5 ml-auto bg-ledger-copper text-white text-xs font-medium px-3 py-1.5 rounded-sm hover:bg-ledger-coppersoft disabled:opacity-40"
                        >
                          {updating === o.id ? "…" : phase.nextLabel} {updating !== o.id && <ArrowRight size={12} />}
                        </button>
                      ) : (
                        <span className="text-xs text-ledger-slate/40">
                          {o.status === "SHIPPED" ? "With courier" : "—"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}