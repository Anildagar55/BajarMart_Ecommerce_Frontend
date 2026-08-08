import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, Store, ShoppingBag } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { useToast } from "../../../context/ToastContext";
import { productImage } from "../../../utils/placeholderImage";
import api from "../../../api/axios";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function Cart() {
  const { items, updateQty, removeItem, clearCart, total } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const groups = useMemo(() => {
    const map = {};
    for (const item of items) {
      const key = item.sellerId ?? "unknown";
      if (!map[key]) map[key] = { sellerId: item.sellerId, sellerName: item.sellerName || "Seller", items: [] };
      map[key].items.push(item);
    }
    return Object.values(map);
  }, [items]);

  const deliveryFee = total >= 499 || total === 0 ? 0 : 49;
  const grandTotal = total + deliveryFee;

  const checkout = async () => {
    if (!user) { navigate("/login"); return; }
    setPlacing(true);
    try {
      for (const group of groups) {
        await api.post("/order/create", {
          userId: user.userId,
          sellerId: group.sellerId,
          items: group.items.map((i) => ({ variantId: i.variantId, quantity: i.qty })),
        });
      }
      clearCart();
      showToast("Order placed — thank you!");
      navigate("/orders");
    } catch (err) {
      showToast(err.response?.data?.error || "Couldn't place the order. Please try again.", "error");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 md:px-6 py-6 md:py-8">
      <h1 className="font-bazaar font-bold text-xl md:text-2xl text-bazaar-ink mb-5 flex items-center gap-2">
        <ShoppingBag size={22} className="text-bazaar-primary" /> Your Cart
      </h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg border border-bazaar-border text-center py-20 text-bazaar-sub">
          <ShoppingBag size={32} className="mx-auto mb-3 text-bazaar-border" />
          <p>Your cart is empty.</p>
          <Link to="/products" className="text-bazaar-primary underline mt-2 inline-block font-medium">Continue shopping</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            {groups.map((group) => (
              <div key={group.sellerId ?? "unknown"} className="bg-white rounded-lg border border-bazaar-border overflow-hidden">
                <div className="flex items-center gap-2 text-xs font-semibold text-bazaar-ink bg-bazaar-bg px-4 py-2.5 border-b border-bazaar-border">
                  <Store size={13} className="text-bazaar-primary" /> {group.sellerName}
                </div>
                <div className="divide-y divide-bazaar-border">
                  {group.items.map((item) => (
                    <div key={item.variantId} className="flex items-center gap-3 md:gap-4 p-4">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-bazaar-bg shrink-0 overflow-hidden rounded-md">
                        <img src={productImage(item)} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-bazaar-ink text-sm font-medium truncate">{item.title}</h3>
                        {(item.size || item.color) && (
                          <p className="text-xs text-bazaar-sub mt-0.5">{[item.size, item.color].filter(Boolean).join(" / ")}</p>
                        )}
                        <p className="font-bazaar font-bold text-sm text-bazaar-ink mt-1">{formatINR(item.price)}</p>

                        <div className="flex items-center border border-bazaar-border rounded-md w-fit mt-2">
                          <button onClick={() => updateQty(item.variantId, item.qty - 1)} className="p-1.5 hover:bg-bazaar-bg"><Minus size={12} /></button>
                          <span className="px-3 text-xs font-bold">{item.qty}</span>
                          <button onClick={() => updateQty(item.variantId, item.qty + 1)} className="p-1.5 hover:bg-bazaar-bg"><Plus size={12} /></button>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.variantId)} className="text-bazaar-sub hover:text-bazaar-accent shrink-0">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-lg border border-bazaar-border p-5 h-fit lg:sticky lg:top-24">
            <h2 className="font-bazaar font-bold text-sm text-bazaar-ink uppercase tracking-wide mb-4">Order Summary</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-bazaar-sub">
                <span>Subtotal</span>
                <span className="font-mono">{formatINR(total)}</span>
              </div>
              <div className="flex justify-between text-bazaar-sub">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? "text-bazaar-success font-semibold" : "font-mono"}>{deliveryFee === 0 ? "FREE" : formatINR(deliveryFee)}</span>
              </div>
              {deliveryFee > 0 && <p className="text-[11px] text-bazaar-sub">Add {formatINR(499 - total)} more for free delivery</p>}
            </div>
            <div className="flex justify-between items-baseline mt-4 pt-4 border-t border-bazaar-border">
              <span className="font-bazaar font-bold text-bazaar-ink">Total</span>
              <span className="font-bazaar font-extrabold text-lg text-bazaar-ink">{formatINR(grandTotal)}</span>
            </div>

            <button
              onClick={checkout}
              disabled={placing}
              className="mt-5 w-full py-3.5 bg-bazaar-accent text-white font-bold text-sm rounded-md hover:brightness-95 transition-all disabled:opacity-50"
            >
              {placing ? "Placing order…" : user ? "Place Order" : "Sign in to checkout"}
            </button>
            {groups.length > 1 && (
              <p className="text-[11px] text-bazaar-sub text-center mt-3">
                Items from {groups.length} sellers — this will place {groups.length} separate orders.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
