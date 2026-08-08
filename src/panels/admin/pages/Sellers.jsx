import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import api from "../../../api/axios";

const FALLBACK = [
  { id: 1, business_name: "Kāya Pottery Studio", gst_number: "22AAAAA0000A1Z5", status: "PENDING", rating: 0 },
  { id: 2, business_name: "Northline Woodwork", gst_number: "22BBBBB0000B1Z5", status: "APPROVED", rating: 4.6 },
  { id: 3, business_name: "Terra & Co.", gst_number: "22CCCCC0000C1Z5", status: "PENDING", rating: 0 },
];

export default function AdminSellers() {
  const [sellers, setSellers] = useState(FALLBACK);

  useEffect(() => {
    api.get("/seller/all").then((res) => setSellers(res.data)).catch(() => {});
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/seller/${id}/${status}`);
      setSellers(sellers.map((s) => (s.id === id ? { ...s, status } : s)));
    } catch {
      alert("Couldn't update — make sure you're signed in as an admin.");
    }
  };

  return (
    <div>
      <h1 className="text-xl text-white mb-1">Seller directory</h1>
      <p className="text-console-mist/50 text-sm mb-8">Approve new sellers or suspend existing ones.</p>

      <div className="bg-console-panel border border-white/5 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-console-mist/40 border-b border-white/5">
              <th className="px-6 py-3 font-normal">Business</th>
              <th className="px-6 py-3 font-normal">GST</th>
              <th className="px-6 py-3 font-normal">Rating</th>
              <th className="px-6 py-3 font-normal">Status</th>
              <th className="px-6 py-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((s) => (
              <tr key={s.id} className="border-b border-white/5 last:border-0">
                <td className="px-6 py-3.5 text-white">{s.business_name}</td>
                <td className="px-6 py-3.5 font-mono text-console-mist/60 text-xs">{s.gst_number}</td>
                <td className="px-6 py-3.5 font-mono text-console-amber">{s.rating || "—"}</td>
                <td className="px-6 py-3.5">
                  <span className={`text-xs px-2 py-1 rounded ${
                    s.status === "APPROVED" ? "bg-console-emerald/10 text-console-emerald" :
                    s.status === "SUSPENDED" ? "bg-console-crimson/10 text-console-crimson" :
                    "bg-console-amber/10 text-console-amber"
                  }`}>{s.status}</span>
                </td>
                <td className="px-6 py-3.5 text-right space-x-2">
                  <button onClick={() => updateStatus(s.id, "APPROVED")} className="inline-flex p-1.5 rounded bg-console-emerald/10 text-console-emerald hover:bg-console-emerald/20">
                    <Check size={14} />
                  </button>
                  <button onClick={() => updateStatus(s.id, "SUSPENDED")} className="inline-flex p-1.5 rounded bg-console-crimson/10 text-console-crimson hover:bg-console-crimson/20">
                    <X size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
