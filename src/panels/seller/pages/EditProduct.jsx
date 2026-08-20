import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../../../api/axios";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      const p = res.data;
      setForm({
        title: p.title || "",
        description: p.description || "",
        basePrice: p.basePrice ?? "",
        mrp: p.mrp ?? "",
        categoryId: p.categoryId ?? "",
        sellerId: p.sellerId,
        imageUrl: p.imageUrl || "",
      });
    }).catch(() => setStatus("Couldn't load this product."));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const discountPreview = (() => {
    if (!form) return null;
    const price = Number(form.basePrice);
    const mrp = Number(form.mrp);
    if (!price || !mrp || mrp <= price) return null;
    return Math.round(((mrp - price) / mrp) * 100);
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await api.put(`/products/${id}`, {
        title: form.title,
        description: form.description,
        basePrice: Number(form.basePrice),
        mrp: form.mrp ? Number(form.mrp) : undefined,
        category_id: Number(form.categoryId),
        sellerId: form.sellerId,
        imageUrl: form.imageUrl || undefined,
      });
      setStatus("success");
      setTimeout(() => navigate("/seller/products"), 1000);
    } catch (err) {
      setStatus(err.response?.data?.error || "Couldn't save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <p className="text-ledger-slate/40 text-sm">{status || "Loading…"}</p>;

  return (
    <div className="max-w-xl">
      <Link to="/seller/products" className="flex items-center gap-1.5 text-sm text-ledger-slate/50 hover:text-ledger-copper mb-5">
        <ArrowLeft size={14} /> Back to products
      </Link>
      <h1 className="text-2xl text-ledger-slate mb-1">Edit listing</h1>
      <p className="text-ledger-slate/50 text-sm mb-8">Change price or MRP anytime — the discount shown to buyers updates automatically.</p>

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
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-ledger-slate/50 mb-1.5">Selling Price (₹)</label>
            <input name="basePrice" type="number" value={form.basePrice} onChange={handleChange} required
              className="w-full border border-ledger-slate/15 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-ledger-copper font-mono" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-ledger-slate/50 mb-1.5">MRP (₹)</label>
            <input name="mrp" type="number" value={form.mrp} onChange={handleChange}
              className="w-full border border-ledger-slate/15 px-3.5 py-2.5 text-sm rounded-sm outline-none focus:border-ledger-copper font-mono" />
          </div>
        </div>
        {discountPreview !== null ? (
          <p className="text-xs text-ledger-sage -mt-3">
            Buyers will see <strong>{discountPreview}% OFF</strong> (₹{form.mrp} → ₹{form.basePrice})
          </p>
        ) : (
          <p className="text-xs text-ledger-slate/40 -mt-3">Set MRP higher than the selling price to show a discount badge.</p>
        )}

        {status === "success" && <p className="text-ledger-sage text-sm">Saved ✓</p>}
        {status && status !== "success" && <p className="text-red-600 text-sm">{status}</p>}

        <button type="submit" disabled={saving} className="w-full py-3 bg-ledger-copper text-white text-sm rounded-sm hover:bg-ledger-coppersoft transition-colors disabled:opacity-50">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}