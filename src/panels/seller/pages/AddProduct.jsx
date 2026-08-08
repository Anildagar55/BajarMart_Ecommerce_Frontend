import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { useSeller } from "../../../context/SellerContext";

export default function AddProduct() {
  const { sellerId, seller, loading: sellerLoading } = useSeller();
  const [form, setForm] = useState({ title: "", description: "", basePrice: "", categoryId: "", imageUrl: "", initialStock: "10" });
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      await api.post("/products/create", {
        title: form.title,
        description: form.description,
        basePrice: Number(form.basePrice),
        category_id: Number(form.categoryId),
        sellerId,
        imageUrl: form.imageUrl || undefined,
        initialStock: form.initialStock ? Number(form.initialStock) : undefined,
      });
      setStatus("success");
      setTimeout(() => navigate("/seller/products"), 1200);
    } catch (err) {
      setStatus(err.response?.data?.error || "Couldn't create the listing.");
    }
  };

  if (sellerLoading) return <p className="text-ledger-slate/40 text-sm">Loading…</p>;

  if (!seller) {
    return (
      <div className="bg-white border border-ledger-slate/10 rounded-sm p-8 text-center text-ledger-slate/50">
        No seller profile linked to this account — can't list products.
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl text-ledger-slate mb-1">List a new item</h1>
      <p className="text-ledger-slate/50 text-sm mb-1">Fill in the details buyers will see on the listing.</p>
      <p className="text-xs text-ledger-slate/40 mb-8">Listing as <span className="font-medium text-ledger-copper">{seller.business_name}</span></p>

      {seller.status !== "APPROVED" && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-sm p-3 mb-6">
          Your seller account is <strong>{seller.status}</strong> — listings will be rejected until an admin approves your account.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-ledger-slate/10 rounded-sm p-6 space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-wider text-ledger-slate/50 mb-1.5">Title</label>
          <input name="title" value={form.title} onChange={handleChange} required
            className="w-full border border-ledger-slate/15 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-ledger-copper" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-ledger-slate/50 mb-1.5">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4}
            className="w-full border border-ledger-slate/15 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-ledger-copper" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-ledger-slate/50 mb-1.5">Image URL</label>
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://…"
            className="w-full border border-ledger-slate/15 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-ledger-copper" />
          <p className="text-xs text-ledger-slate/40 mt-1">Leave blank and a themed placeholder will show instead.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-ledger-slate/50 mb-1.5">Price (₹)</label>
            <input name="basePrice" type="number" value={form.basePrice} onChange={handleChange} required
              className="w-full border border-ledger-slate/15 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-ledger-copper font-mono" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-ledger-slate/50 mb-1.5">Category ID</label>
            <input name="categoryId" type="number" value={form.categoryId} onChange={handleChange} required
              className="w-full border border-ledger-slate/15 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-ledger-copper font-mono" />
          </div>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-ledger-slate/50 mb-1.5">Starting stock</label>
          <input name="initialStock" type="number" min="0" value={form.initialStock} onChange={handleChange}
            className="w-full border border-ledger-slate/15 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-ledger-copper font-mono" />
          <p className="text-xs text-ledger-slate/40 mt-1">Creates a default listing variant with this much stock — buyers can purchase immediately.</p>
        </div>

        {status === "success" && <p className="text-ledger-sage text-sm">Listing created ✓</p>}
        {status && status !== "success" && <p className="text-red-600 text-sm">{status}</p>}

        <button type="submit" className="w-full py-3 bg-ledger-copper text-white text-sm rounded-sm hover:bg-ledger-coppersoft transition-colors">
          Publish listing
        </button>
      </form>
    </div>
  );
}