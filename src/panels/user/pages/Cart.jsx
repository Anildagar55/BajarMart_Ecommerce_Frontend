import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, Store, ShoppingBag, MapPin, Plus as PlusIcon, CreditCard } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { useToast } from "../../../context/ToastContext";
import { productImage } from "../../../utils/placeholderImage";
import api from "../../../api/axios";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

const PAYMENT_METHODS = [
  { value: "COD", label: "Cash on Delivery" },
  { value: "UPI", label: "UPI" },
  { value: "CARD", label: "Credit/Debit Card" },
  { value: "NETBANKING", label: "Net Banking" },
  { value: "WALLET", label: "Wallet" },
];

export default function Cart() {
  const { items, updateQty, removeItem, clearCart, total } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ addressLine: "", city: "", pinCode: "" });
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.get(`/address/userId/${user.userId}`)
      .then((res) => {
        const list = res.data || [];
        setAddresses(list);
        const def = list.find((a) => a.isDefault) || list[0];
        if (def) setSelectedAddressId(def.id);
        else setShowAddressForm(true);
      })
      .catch(() => setShowAddressForm(true));
  }, [user]);

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

  const saveAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const res = await api.post("/address/create", { ...newAddress, userId: user.userId, isDefault: addresses.length === 0 });
      setAddresses([...addresses, res.data]);
      setSelectedAddressId(res.data.id);
      setShowAddressForm(false);
      setNewAddress({ addressLine: "", city: "", pinCode: "" });
      showToast("Address saved");
    } catch (err) {
      showToast(err.response?.data?.error || "Couldn't save address", "error");
    } finally {
      setSavingAddress(false);
    }
  };

  const checkout = async () => {
    if (!user) { navigate("/login"); return; }
    if (!selectedAddressId) {
      showToast("Please select or add a delivery address", "error");
      setShowAddressForm(true);
      return;
    }
    setPlacing(true);
    try {
      for (const group of groups) {
        const res = await api.post("/order/create", {
          userId: user.userId,
          sellerId: group.sellerId,
          addressId: selectedAddressId,
          items: group.items.map((i) => ({ variantId: i.variantId, quantity: i.qty })),
        });
        // Order create hote hi payment record bhi bana do — isके bina Admin/Seller
        // order detail page pe "payment type" kabhi dikh hi nahi sakta
        await api.post("/payment/create", { orderId: res.data.id, method: paymentMethod });
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
            {/* Delivery address */}
            {user && (
              <div className="bg-white rounded-lg border border-bazaar-border overflow-hidden">
                <div className="flex items-center justify-between bg-bazaar-bg px-4 py-2.5 border-b border-bazaar-border">
                  <span className="flex items-center gap-2 text-xs font-semibold text-bazaar-ink">
                    <MapPin size={13} className="text-bazaar-primary" /> Deliver to
                  </span>
                  {!showAddressForm && (
                    <button onClick={() => setShowAddressForm(true)} className="flex items-center gap-1 text-[11px] font-semibold text-bazaar-primary hover:underline">
                      <PlusIcon size={11} /> Add new
                    </button>
                  )}
                </div>
                <div className="p-4">
                  {addresses.length > 0 && !showAddressForm && (
                    <div className="space-y-2">
                      {addresses.map((a) => (
                        <label key={a.id} className={`flex items-start gap-2.5 border rounded-md p-3 cursor-pointer text-sm ${selectedAddressId === a.id ? "border-bazaar-primary bg-bazaar-primary/5" : "border-bazaar-border"}`}>
                          <input type="radio" name="address" checked={selectedAddressId === a.id} onChange={() => setSelectedAddressId(a.id)} className="mt-1 accent-bazaar-primary" />
                          <span>
                            <span className="text-bazaar-ink">{a.addressLine}, {a.city} — {a.pinCode}</span>
                            {a.isDefault && <span className="ml-2 text-[10px] font-semibold text-bazaar-success">DEFAULT</span>}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {showAddressForm && (
                    <form onSubmit={saveAddress} className="space-y-2.5">
                      <input required placeholder="Address line" value={newAddress.addressLine}
                        onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                        className="w-full border border-bazaar-border rounded-md px-3 py-2 text-sm outline-none focus:border-bazaar-primary" />
                      <div className="grid grid-cols-2 gap-2.5">
                        <input required placeholder="City" value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full border border-bazaar-border rounded-md px-3 py-2 text-sm outline-none focus:border-bazaar-primary" />
                        <input required placeholder="Pincode" value={newAddress.pinCode}
                          onChange={(e) => setNewAddress({ ...newAddress, pinCode: e.target.value })}
                          className="w-full border border-bazaar-border rounded-md px-3 py-2 text-sm outline-none focus:border-bazaar-primary" />
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" disabled={savingAddress} className="bg-bazaar-primary text-white text-xs font-semibold px-4 py-2 rounded-md disabled:opacity-50">
                          {savingAddress ? "Saving…" : "Save address"}
                        </button>
                        {addresses.length > 0 && (
                          <button type="button" onClick={() => setShowAddressForm(false)} className="text-xs font-semibold text-bazaar-sub px-4 py-2">Cancel</button>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

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

            <div className="mb-4 pb-4 border-b border-bazaar-border">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-bazaar-ink mb-2">
                <CreditCard size={13} className="text-bazaar-primary" /> Payment Method
              </p>
              <div className="space-y-1.5">
                {PAYMENT_METHODS.map((m) => (
                  <label key={m.value} className="flex items-center gap-2 text-xs text-bazaar-sub cursor-pointer hover:text-bazaar-ink">
                    <input type="radio" name="paymentMethod" checked={paymentMethod === m.value} onChange={() => setPaymentMethod(m.value)} className="accent-bazaar-primary" />
                    {m.label}
                  </label>
                ))}
              </div>
            </div>

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