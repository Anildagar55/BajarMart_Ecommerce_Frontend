import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import api from "../../../api/axios";
import { useSeller } from "../../../context/SellerContext";
import { productImage } from "../../../utils/placeholderImage";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

const FALLBACK = [
  { id: 1, title: "Hand-thrown Ceramic Vase", basePrice: 2400, status: "ACTIVE", categoryName: "Home & Living", imageUrl: "https://picsum.photos/seed/vase01/200/200" },
  { id: 2, title: "Brass Table Lamp", basePrice: 5200, status: "ACTIVE", categoryName: "Home & Living", imageUrl: "https://picsum.photos/seed/lamp04/200/200" },
  { id: 3, title: "Sandalwood Candle Trio", basePrice: 1890, status: "OUT_OF_STOCK", categoryName: "Home & Living", imageUrl: "https://picsum.photos/seed/candle06/200/200" },
];

export default function SellerProducts() {
  const { sellerId, loading: sellerLoading } = useSeller();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        console.log("sellerId", sellerId);

    if (!sellerId) return;
    api.get(`/products/seller/${sellerId}`)
      .then((res) =>{  console.log(res.data); setProducts(res.data?.length ? res.data : FALLBACK)})
      .catch(() =>{      console.log(err.response);
  setProducts(FALLBACK)})
      .finally(() => setLoading(false));
  }, [sellerId]);

  const deleteProduct = async (id) => {
    if (!confirm("Remove this listing?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch {
      alert("Couldn't delete — check that you're signed in as the owning seller.");
    }
  };

  if (sellerLoading || loading) return <p className="text-ledger-slate/40 text-sm">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl text-ledger-slate">Your products</h1>
          <p className="text-ledger-slate/50 text-sm">{products.length} listings</p>
        </div>
        <Link to="/seller/products/new" className="flex items-center gap-2 bg-ledger-copper text-white px-4 py-2.5 rounded-sm text-sm hover:bg-ledger-coppersoft">
          <PlusCircle size={16} /> List an item
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-ledger-slate/10 rounded-sm p-10 text-center text-ledger-slate/40">
          <p className="mb-2">No products listed yet.</p>
          <Link to="/seller/products/new" className="text-ledger-copper underline text-sm">List your first item</Link>
        </div>
      ) : (
        <div className="bg-white border border-ledger-slate/10 rounded-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-ledger-slate/40 border-b border-ledger-slate/10">
                <th className="px-6 py-3 font-normal w-16"></th>
                <th className="px-6 py-3 font-normal">Item</th>
                <th className="px-6 py-3 font-normal">Category</th>
                <th className="px-6 py-3 font-normal">Price</th>
                <th className="px-6 py-3 font-normal">Status</th>
                <th className="px-6 py-3 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="ledger-row border-b border-ledger-slate/5 last:border-0">
                  <td className="px-6 py-3.5">
                    <img src={productImage(p, { bg: "1B2430", fg: "B5651D" })} alt={p.title} className="w-10 h-10 object-cover rounded-sm" />
                  </td>
                  <td className="px-6 py-3.5 text-ledger-slate">{p.title}</td>
                  <td className="px-6 py-3.5 text-ledger-slate/60">{p.categoryName}</td>
                  <td className="px-6 py-3.5 font-mono">{formatINR(p.basePrice)}</td>
                  <td className="px-6 py-3.5">
                    <span className={`text-xs px-2 py-1 rounded-sm ${
                      p.status === "ACTIVE" ? "bg-ledger-sage/10 text-ledger-sage" : "bg-red-100 text-red-600"
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button className="text-ledger-slate/40 hover:text-ledger-copper mr-3"><Pencil size={15} /></button>
                    <button onClick={() => deleteProduct(p.id)} className="text-ledger-slate/40 hover:text-red-600"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}