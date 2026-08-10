import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, MapPin, Package, CreditCard, User, Store, XCircle, RotateCcw } from "lucide-react";
import api from "../../../api/axios";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
}

const STAGES = [
  { key: "PLACED", label: "Placed" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
];
const ALL_STATUSES = [...STAGES.map((s) => s.key), "CANCELLED", "RETURNED"];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingStatus, setPendingStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    api.get(`/order/${id}`)
      .then((res) => { setOrder(res.data); setPendingStatus(res.data.status); })
      .catch(() => {})
      .finally(() => setLoading(false));
    api.get(`/payment/id/${id}`).then((res) => setPayment(res.data)).catch(() => setPayment(null));
  };

  useEffect(load, [id]);

  const updateStatus = async () => {
    if (pendingStatus === order.status) return;
    setUpdating(true);
    setError("");
    try {
      await api.put(`/order/update/${id}`, null, { params: { status: pendingStatus } });
      setOrder({ ...order, status: pendingStatus });
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't update status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-console-mist/40 text-sm">Loading…</p>;
  if (!order) return <p className="text-console-mist/40 text-sm">Order not found.</p>;

  const isException = order.status === "CANCELLED" || order.status === "RETURNED";
  const currentStageIdx = STAGES.findIndex((s) => s.key === order.status);
  const hasAddress = order.deliveryAddressLine || order.deliveryCity || order.deliveryPincode;

  return (
    <div className="max-w-4xl">
      <Link to="/admin/orders" className="flex items-center gap-1.5 text-sm text-console-mist hover:text-console-emerald mb-5">
        <ArrowLeft size={15} /> Back to all orders
      </Link>

      {/* Header + status control */}
      <div className="bg-console-panel border border-white/5 rounded p-6 mb-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h1 className="font-mono text-lg text-white">{order.OrderNumber || `#${String(order.id).padStart(5, "0")}`}</h1>
            <p className="text-xs text-console-mist/50 mt-0.5">
              Placed {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={pendingStatus}
              onChange={(e) => setPendingStatus(e.target.value)}
              className="bg-console-void border border-white/10 text-white text-xs rounded px-3 py-2 outline-none focus:border-console-emerald"
            >
              {ALL_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </select>
            <button
              onClick={updateStatus}
              disabled={updating || pendingStatus === order.status}
              className="bg-console-emerald text-console-void text-xs font-semibold px-4 py-2 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
            >
              {updating ? "Updating…" : "Update Status"}
            </button>
          </div>
        </div>
        {error && <p className="text-console-crimson text-xs mb-3">{error}</p>}

        <div className="flex items-center gap-4 text-xs text-console-mist border-t border-white/5 pt-4">
          <span className="flex items-center gap-1.5"><User size={13} /> {order.buyerName || "—"}</span>
          <span className="flex items-center gap-1.5"><Store size={13} /> {order.sellerName || "—"}</span>
        </div>

        {/* Tracking timeline */}
        <div className="mt-6">
          {isException ? (
            <div className={`flex items-center gap-3 p-4 rounded ${order.status === "CANCELLED" ? "bg-console-crimson/10 text-console-crimson" : "bg-console-mist/10 text-console-mist"}`}>
              {order.status === "CANCELLED" ? <XCircle size={18} /> : <RotateCcw size={18} />}
              <p className="text-sm font-medium">{order.status === "CANCELLED" ? "Order Cancelled" : "Order Returned"}</p>
            </div>
          ) : (
            <div className="flex items-start">
              {STAGES.map((stage, i) => {
                const done = i <= currentStageIdx;
                const isLast = i === STAGES.length - 1;
                return (
                  <div key={stage.key} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${done ? "bg-console-emerald text-console-void" : "bg-white/10 text-console-mist"}`}>
                        {done ? <Check size={13} /> : i + 1}
                      </div>
                      <p className={`text-[10px] mt-1.5 text-center w-16 leading-tight ${done ? "text-white" : "text-console-mist/50"}`}>{stage.label}</p>
                    </div>
                    {!isLast && <div className={`flex-1 h-0.5 mb-5 ${i < currentStageIdx ? "bg-console-emerald" : "bg-white/10"}`} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        {/* Delivery address */}
        <div className="bg-console-panel border border-white/5 rounded p-5">
          <h2 className="flex items-center gap-2 text-xs uppercase tracking-wider text-console-mist mb-3">
            <MapPin size={14} className="text-console-emerald" /> Delivery Address
          </h2>
          {hasAddress ? (
            <p className="text-sm text-white">
              {order.deliveryAddressLine}{order.deliveryAddressLine && ", "}
              {order.deliveryCity}{order.deliveryCity && " — "}
              {order.deliveryPincode}
            </p>
          ) : (
            <p className="text-sm text-console-mist/40 italic">No address on file.</p>
          )}
        </div>

        {/* Payment */}
        <div className="bg-console-panel border border-white/5 rounded p-5">
          <h2 className="flex items-center gap-2 text-xs uppercase tracking-wider text-console-mist mb-3">
            <CreditCard size={14} className="text-console-emerald" /> Payment
          </h2>
          {payment ? (
            <div className="space-y-1.5 text-sm">
              <p className="text-white">{payment.method} <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${payment.status === "SUCCESS" ? "bg-console-emerald/10 text-console-emerald" : payment.status === "FAILED" ? "bg-console-crimson/10 text-console-crimson" : "bg-console-amber/10 text-console-amber"}`}>{payment.status}</span></p>
              {payment.gatewayIxnId && <p className="text-xs text-console-mist/50 font-mono">{payment.gatewayIxnId}</p>}
            </div>
          ) : (
            <p className="text-sm text-console-mist/40 italic">No payment record found.</p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-console-panel border border-white/5 rounded p-5">
        <h2 className="flex items-center gap-2 text-xs uppercase tracking-wider text-console-mist mb-3">
          <Package size={14} className="text-console-emerald" /> Items
        </h2>
        <div className="divide-y divide-white/5">
          {(order.items || []).map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2.5 text-sm">
              <div>
                <p className="text-white">{item.productTitle}</p>
                <p className="text-xs text-console-mist/50">Qty {item.quantity} · {item.sku}</p>
              </div>
              <span className="font-mono text-white">{formatINR(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-baseline mt-3 pt-3 border-t border-white/5">
          <span className="text-white font-medium">Total</span>
          <span className="font-mono font-bold text-console-emerald">{formatINR(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}