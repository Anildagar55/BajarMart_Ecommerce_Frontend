import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";
import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

const STATUS_STYLES = {
  PLACED: "bg-bazaar-gold/15 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
  RETURNED: "bg-gray-100 text-gray-600",
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    api.get(`/order/users/${user.userId}`)
      .then((res) => setOrders((res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-bazaar-sub mb-3">Sign in to see your orders.</p>
        <Link to="/login" className="text-bazaar-primary underline font-medium">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-3 md:px-6 py-6 md:py-8">
      <h1 className="font-bazaar font-bold text-xl md:text-2xl text-bazaar-ink mb-6">Your Orders</h1>

      {loading ? (
        <p className="text-bazaar-sub text-center py-12">Loading…</p>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-bazaar-border text-center py-20 text-bazaar-sub">
          <Package size={32} className="mx-auto mb-3 text-bazaar-border" />
          <p>No orders yet.</p>
          <Link to="/products" className="text-bazaar-primary underline mt-2 inline-block font-medium">Start shopping</Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-bazaar-border divide-y divide-bazaar-border overflow-hidden">
          {orders.map((o) => (
            <Link
              key={o.id}
              to={`/orders/${o.id}`}
              className="flex items-center gap-4 p-4 hover:bg-bazaar-bg transition-colors"
            >
              <div className="w-12 h-12 rounded-md bg-bazaar-bg flex items-center justify-center shrink-0">
                <Package size={20} className="text-bazaar-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm font-semibold text-bazaar-ink">
                    {o.OrderNumber || `#${String(o.id).padStart(5, "0")}`}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[o.status] || "bg-bazaar-bg text-bazaar-sub"}`}>
                    {o.status?.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-xs text-bazaar-sub mt-1 truncate">
                  {o.items?.map((i) => i.productTitle).join(", ") || "Order"}
                </p>
                <p className="text-[11px] text-bazaar-sub/70 mt-0.5">
                  {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  {" · "}{o.items?.length || 0} item{(o.items?.length || 0) !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="font-bazaar font-bold text-sm text-bazaar-ink">{formatINR(o.totalAmount)}</p>
              </div>
              <ChevronRight size={18} className="text-bazaar-sub shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { Package } from "lucide-react";
// import api from "../../../api/axios";
// import { useAuth } from "../../../context/AuthContext";
//
// function formatINR(n) {
//   return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
// }
//
// const STATUS_STYLES = {
//   PLACED: "bg-bazaar-gold/15 text-amber-700",
//   SHIPPED: "bg-blue-100 text-blue-700",
//   OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
//   DELIVERED: "bg-green-100 text-green-700",
//   CANCELLED: "bg-red-100 text-red-600",
//   RETURNED: "bg-gray-100 text-gray-600",
// };
//
// export default function Orders() {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     if (!user) { setLoading(false); return; }
//     api.get(`/order/users/${user.userId}`)
//       .then((res) => {console.log(res.data); setOrders(res.data || [])})
//       .catch((err) => {console.log(err); setOrders([])})
//       .finally(() => setLoading(false));
//   }, [user]);
//
//   if (!user) {
//     return (
//       <div className="max-w-2xl mx-auto px-6 py-24 text-center">
//         <p className="text-bazaar-sub mb-3">Sign in to see your orders.</p>
//         <Link to="/login" className="text-bazaar-primary underline font-medium">Sign in</Link>
//       </div>
//     );
//   }
//
//   return (
//     <div className="max-w-3xl mx-auto px-3 md:px-6 py-6 md:py-8">
//       <h1 className="font-bazaar font-bold text-xl md:text-2xl text-bazaar-ink mb-6">Your Orders</h1>
//
//       {loading ? (
//         <p className="text-bazaar-sub text-center py-12">Loading…</p>
//       ) : orders.length === 0 ? (
//         <div className="bg-white rounded-lg border border-bazaar-border text-center py-20 text-bazaar-sub">
//           <Package size={32} className="mx-auto mb-3 text-bazaar-border" />
//           <p>No orders yet.</p>
//           <Link to="/products" className="text-bazaar-primary underline mt-2 inline-block font-medium">Start shopping</Link>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {orders.map((o) => (
//             <div key={o.id} className="bg-white rounded-lg border border-bazaar-border p-5">
//               <div className="flex items-center justify-between mb-3">
//                 <div>
//                   <p className="font-mono text-sm font-semibold text-bazaar-ink">Order #{String(o.id).padStart(5, "0")}</p>
//                   <p className="text-xs text-bazaar-sub mt-0.5">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
//                 </div>
//                 <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status] || "bg-bazaar-bg text-bazaar-sub"}`}>
//                   {o.status?.replace(/_/g, " ")}
//                 </span>
//               </div>
//               <div className="divide-y divide-bazaar-border border-t border-bazaar-border">
//                 {(o.items || []).map((item) => (
//                   <div key={item.id} className="flex items-center justify-between py-2 text-sm">
//                     <span className="text-bazaar-sub">{item.productTitle} <span className="text-bazaar-sub/60">× {item.quantity}</span></span>
//                     <span className="font-mono text-bazaar-ink">{formatINR(item.price * item.quantity)}</span>
//                   </div>
//                 ))}
//               </div>
//               <div className="flex justify-end mt-3 pt-3 border-t border-bazaar-border">
//                 <span className="font-bazaar font-bold text-sm text-bazaar-ink">{formatINR(o.totalAmount)}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
