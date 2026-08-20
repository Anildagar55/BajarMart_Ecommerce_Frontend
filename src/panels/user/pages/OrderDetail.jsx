import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, MapPin, Package, XCircle, RotateCcw, CreditCard, Star } from "lucide-react";
import api from "../../../api/axios";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

const STAGES = [
  { key: "PLACED", label: "Order Placed" },
  { key: "CONFIRMED", label: "Ready to Ship" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/order/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    api.get(`/payment/id/${id}`).then((res) => setPayment(res.data)).catch(() => setPayment(null));
  }, [id]);

  if (loading) return <div className="max-w-3xl mx-auto px-6 py-24 text-center text-bazaar-sub">Loading…</div>;

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-bazaar-sub mb-3">Couldn't find that order.</p>
        <Link to="/orders" className="text-bazaar-primary underline font-medium">Back to your orders</Link>
      </div>
    );
  }

  const isCancelled = order.status === "CANCELLED";
  const isReturned = order.status === "RETURNED";
  const isException = isCancelled || isReturned;
  const currentStageIdx = STAGES.findIndex((s) => s.key === order.status);

  const hasAddress = order.deliveryAddressLine || order.deliveryCity || order.deliveryPincode;

  return (
    <div className="max-w-3xl mx-auto px-3 md:px-6 py-6 md:py-8">
      <Link to="/orders" className="flex items-center gap-1.5 text-sm text-bazaar-sub hover:text-bazaar-primary mb-5 font-medium">
        <ArrowLeft size={15} /> Back to orders
      </Link>

      <div className="bg-white rounded-lg border border-bazaar-border p-5 md:p-7 mb-5">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
          <h1 className="font-mono font-bold text-lg text-bazaar-ink">
            {order.OrderNumber || `#${String(order.id).padStart(5, "0")}`}
          </h1>
          {order.sellerName && <span className="text-xs text-bazaar-sub">Sold by {order.sellerName}</span>}
        </div>
        <p className="text-xs text-bazaar-sub">
          Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        {/* Tracking timeline */}
        <div className="mt-7">
          {isException ? (
            <div className={`flex items-center gap-3 p-4 rounded-md ${isCancelled ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-700"}`}>
              {isCancelled ? <XCircle size={20} /> : <RotateCcw size={20} />}
              <div>
                <p className="font-semibold text-sm">{isCancelled ? "Order Cancelled" : "Order Returned"}</p>
                <p className="text-xs opacity-70">{isCancelled ? "This order was cancelled and will not be delivered." : "This order was returned after delivery."}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start">
              {STAGES.map((stage, i) => {
                const done = i <= currentStageIdx;
                const isLast = i === STAGES.length - 1;
                return (
                  <div key={stage.key} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        done ? "bg-bazaar-success text-white" : "bg-bazaar-border text-bazaar-sub"
                      }`}>
                        {done ? <Check size={15} /> : i + 1}
                      </div>
                      <p className={`text-[10px] md:text-xs mt-1.5 text-center w-16 md:w-20 leading-tight ${done ? "text-bazaar-ink font-medium" : "text-bazaar-sub"}`}>
                        {stage.label}
                      </p>
                    </div>
                    {!isLast && (
                      <div className={`flex-1 h-0.5 mb-5 ${i < currentStageIdx ? "bg-bazaar-success" : "bg-bazaar-border"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delivery address + Payment */}
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-lg border border-bazaar-border p-5 md:p-6">
          <h2 className="flex items-center gap-2 font-bazaar font-bold text-sm text-bazaar-ink uppercase tracking-wide mb-3">
            <MapPin size={15} className="text-bazaar-primary" /> Delivery Address
          </h2>
          {hasAddress ? (
            <p className="text-sm text-bazaar-sub">
              {order.deliveryAddressLine}{order.deliveryAddressLine && ", "}
              {order.deliveryCity}{order.deliveryCity && " — "}
              {order.deliveryPincode}
            </p>
          ) : (
            <p className="text-sm text-bazaar-sub/60 italic">No address on file for this order.</p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-bazaar-border p-5 md:p-6">
          <h2 className="flex items-center gap-2 font-bazaar font-bold text-sm text-bazaar-ink uppercase tracking-wide mb-3">
            <CreditCard size={15} className="text-bazaar-primary" /> Payment
          </h2>
          {payment ? (
            <div className="text-sm">
              <p className="text-bazaar-ink">{payment.method?.replace(/_/g, " ")}</p>
              <span className={`inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                payment.status === "SUCCESS" ? "bg-green-100 text-green-700" :
                payment.status === "FAILED" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"
              }`}>{payment.status}</span>
            </div>
          ) : (
            <p className="text-sm text-bazaar-sub/60 italic">No payment record found.</p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-lg border border-bazaar-border p-5 md:p-7">
        <h2 className="flex items-center gap-2 font-bazaar font-bold text-sm text-bazaar-ink uppercase tracking-wide mb-3">
          <Package size={15} className="text-bazaar-primary" /> Items
        </h2>
        <div className="divide-y divide-bazaar-border">
          {(order.items || []).map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 text-sm gap-3">
              <div className="min-w-0">
                <p className="text-bazaar-ink">{item.productTitle}</p>
                <p className="text-xs text-bazaar-sub mt-0.5">
                  {[item.size, item.color].filter(Boolean).join(" / ")}
                  {(item.size || item.color) && " · "}
                  Qty: {item.quantity} · SKU: {item.sku}
                </p>
                {order.status === "DELIVERED" && (
                  <Link to={`/products/${item.productId}`} className="inline-flex items-center gap-1 text-xs font-semibold text-bazaar-primary hover:underline mt-1.5">
                    <Star size={12} /> Rate this product
                  </Link>
                )}
              </div>
              <span className="font-mono text-bazaar-ink shrink-0">{formatINR(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-baseline mt-4 pt-4 border-t border-bazaar-border">
          <span className="font-bazaar font-bold text-bazaar-ink">Total</span>
          <span className="font-bazaar font-extrabold text-lg text-bazaar-ink">{formatINR(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { ArrowLeft, Check, MapPin, Package, XCircle, RotateCcw, CreditCard } from "lucide-react";
// import api from "../../../api/axios";
//
// function formatINR(n) {
//   return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
// }
//
// const STAGES = [
//   { key: "PLACED", label: "Order Placed" },
//   { key: "CONFIRMED", label: "Ready to Ship" },
//   { key: "SHIPPED", label: "Shipped" },
//   { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
//   { key: "DELIVERED", label: "Delivered" },
// ];
//
// export default function OrderDetail() {
//   const { id } = useParams();
//   const [order, setOrder] = useState(null);
//   const [payment, setPayment] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//
//   useEffect(() => {
//     api.get(`/order/${id}`)
//       .then((res) => setOrder(res.data))
//       .catch(() => setError(true))
//       .finally(() => setLoading(false));
//     api.get(`/payment/id/${id}`).then((res) => setPayment(res.data)).catch(() => setPayment(null));
//   }, [id]);
//
//   if (loading) return <div className="max-w-3xl mx-auto px-6 py-24 text-center text-bazaar-sub">Loading…</div>;
//
//   if (error || !order) {
//     return (
//       <div className="max-w-3xl mx-auto px-6 py-24 text-center">
//         <p className="text-bazaar-sub mb-3">Couldn't find that order.</p>
//         <Link to="/orders" className="text-bazaar-primary underline font-medium">Back to your orders</Link>
//       </div>
//     );
//   }
//
//   const isCancelled = order.status === "CANCELLED";
//   const isReturned = order.status === "RETURNED";
//   const isException = isCancelled || isReturned;
//   const currentStageIdx = STAGES.findIndex((s) => s.key === order.status);
//
//   const hasAddress = order.deliveryAddressLine || order.deliveryCity || order.deliveryPincode;
//
//   return (
//     <div className="max-w-3xl mx-auto px-3 md:px-6 py-6 md:py-8">
//       <Link to="/orders" className="flex items-center gap-1.5 text-sm text-bazaar-sub hover:text-bazaar-primary mb-5 font-medium">
//         <ArrowLeft size={15} /> Back to orders
//       </Link>
//
//       <div className="bg-white rounded-lg border border-bazaar-border p-5 md:p-7 mb-5">
//         <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
//           <h1 className="font-mono font-bold text-lg text-bazaar-ink">
//             {order.OrderNumber || `#${String(order.id).padStart(5, "0")}`}
//           </h1>
//           {order.sellerName && <span className="text-xs text-bazaar-sub">Sold by {order.sellerName}</span>}
//         </div>
//         <p className="text-xs text-bazaar-sub">
//           Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
//         </p>
//
//         {/* Tracking timeline */}
//         <div className="mt-7">
//           {isException ? (
//             <div className={`flex items-center gap-3 p-4 rounded-md ${isCancelled ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-700"}`}>
//               {isCancelled ? <XCircle size={20} /> : <RotateCcw size={20} />}
//               <div>
//                 <p className="font-semibold text-sm">{isCancelled ? "Order Cancelled" : "Order Returned"}</p>
//                 <p className="text-xs opacity-70">{isCancelled ? "This order was cancelled and will not be delivered." : "This order was returned after delivery."}</p>
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-start">
//               {STAGES.map((stage, i) => {
//                 const done = i <= currentStageIdx;
//                 const isLast = i === STAGES.length - 1;
//                 return (
//                   <div key={stage.key} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
//                     <div className="flex flex-col items-center shrink-0">
//                       <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
//                         done ? "bg-bazaar-success text-white" : "bg-bazaar-border text-bazaar-sub"
//                       }`}>
//                         {done ? <Check size={15} /> : i + 1}
//                       </div>
//                       <p className={`text-[10px] md:text-xs mt-1.5 text-center w-16 md:w-20 leading-tight ${done ? "text-bazaar-ink font-medium" : "text-bazaar-sub"}`}>
//                         {stage.label}
//                       </p>
//                     </div>
//                     {!isLast && (
//                       <div className={`flex-1 h-0.5 mb-5 ${i < currentStageIdx ? "bg-bazaar-success" : "bg-bazaar-border"}`} />
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//
//       {/* Delivery address + Payment */}
//       <div className="grid md:grid-cols-2 gap-5 mb-5">
//         <div className="bg-white rounded-lg border border-bazaar-border p-5 md:p-6">
//           <h2 className="flex items-center gap-2 font-bazaar font-bold text-sm text-bazaar-ink uppercase tracking-wide mb-3">
//             <MapPin size={15} className="text-bazaar-primary" /> Delivery Address
//           </h2>
//           {hasAddress ? (
//             <p className="text-sm text-bazaar-sub">
//               {order.deliveryAddressLine}{order.deliveryAddressLine && ", "}
//               {order.deliveryCity}{order.deliveryCity && " — "}
//               {order.deliveryPincode}
//             </p>
//           ) : (
//             <p className="text-sm text-bazaar-sub/60 italic">No address on file for this order.</p>
//           )}
//         </div>
//
//         <div className="bg-white rounded-lg border border-bazaar-border p-5 md:p-6">
//           <h2 className="flex items-center gap-2 font-bazaar font-bold text-sm text-bazaar-ink uppercase tracking-wide mb-3">
//             <CreditCard size={15} className="text-bazaar-primary" /> Payment
//           </h2>
//           {payment ? (
//             <div className="text-sm">
//               <p className="text-bazaar-ink">{payment.method?.replace(/_/g, " ")}</p>
//               <span className={`inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
//                 payment.status === "SUCCESS" ? "bg-green-100 text-green-700" :
//                 payment.status === "FAILED" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"
//               }`}>{payment.status}</span>
//             </div>
//           ) : (
//             <p className="text-sm text-bazaar-sub/60 italic">No payment record found.</p>
//           )}
//         </div>
//       </div>
//
//       {/* Items */}
//       <div className="bg-white rounded-lg border border-bazaar-border p-5 md:p-7">
//         <h2 className="flex items-center gap-2 font-bazaar font-bold text-sm text-bazaar-ink uppercase tracking-wide mb-3">
//           <Package size={15} className="text-bazaar-primary" /> Items
//         </h2>
//         <div className="divide-y divide-bazaar-border">
//           {(order.items || []).map((item) => (
//             <div key={item.id} className="flex items-center justify-between py-3 text-sm">
//               <div>
//                 <p className="text-bazaar-ink">{item.productTitle}</p>
//                 <p className="text-xs text-bazaar-sub mt-0.5">
//                   {[item.size, item.color].filter(Boolean).join(" / ")}
//                   {(item.size || item.color) && " · "}
//                   Qty: {item.quantity} · SKU: {item.sku}
//                 </p>
//               </div>
//               <span className="font-mono text-bazaar-ink">{formatINR(item.price * item.quantity)}</span>
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-between items-baseline mt-4 pt-4 border-t border-bazaar-border">
//           <span className="font-bazaar font-bold text-bazaar-ink">Total</span>
//           <span className="font-bazaar font-extrabold text-lg text-bazaar-ink">{formatINR(order.totalAmount)}</span>
//         </div>
//       </div>
//     </div>
//   );
// }