import { useState } from "react";
import { MapPin, X } from "lucide-react";
import { useDelivery } from "../../../context/DeliveryContext";

export default function PincodeControl({ variant = "header" }) {
  const { pincode, setPincode } = useDelivery();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(pincode);

  const submit = (e) => {
    e.preventDefault();
    if (input.length === 6) {
      setPincode(input);
      setOpen(false);
    }
  };

  const openPopover = () => { setInput(pincode); setOpen(true); };

  if (variant === "header") {
    return (
      <div className="relative hidden md:block">
        <button onClick={openPopover} className="flex items-center gap-1 text-white/80 text-xs shrink-0 pr-2 border-r border-white/20 hover:text-white transition-colors">
          <MapPin size={14} />
          <div className="leading-tight text-left">
            <p className="text-[10px] text-white/60">Deliver to</p>
            <p className="font-medium">{pincode || "Add pincode"}</p>
          </div>
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <div className="absolute top-full left-0 mt-2 bg-white rounded-md shadow-lg p-4 w-64 z-40">
              <form onSubmit={submit}>
                <p className="text-xs font-semibold text-bazaar-ink mb-2">Enter delivery pincode</p>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="e.g. 302001"
                  autoFocus
                  className="w-full border border-bazaar-border rounded px-2.5 py-2 text-sm outline-none focus:border-bazaar-primary text-bazaar-ink"
                />
                <button type="submit" disabled={input.length !== 6} className="w-full mt-2 bg-bazaar-primary text-white text-xs font-semibold py-2 rounded disabled:opacity-40">
                  Apply
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    );
  }

  // Home-page inline card variant
  return (
    <div className="bg-white rounded-lg border border-bazaar-border p-3 flex items-center gap-3 mb-4">
      <MapPin size={16} className="text-bazaar-primary shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-bazaar-sub">Delivering to</p>
        <p className="text-sm font-semibold text-bazaar-ink">{pincode || "Enter your pincode"}</p>
      </div>
      {!open ? (
        <button onClick={openPopover} className="text-xs font-semibold text-bazaar-primary hover:underline shrink-0">
          Change
        </button>
      ) : (
        <form onSubmit={submit} className="flex items-center gap-2 shrink-0">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="6-digit pincode"
            autoFocus
            className="border border-bazaar-border rounded px-2 py-1.5 text-xs outline-none focus:border-bazaar-primary w-28"
          />
          <button type="submit" disabled={input.length !== 6} className="bg-bazaar-primary text-white text-xs font-semibold px-3 py-1.5 rounded disabled:opacity-40">
            Apply
          </button>
          <button type="button" onClick={() => setOpen(false)} className="text-bazaar-sub hover:text-bazaar-ink">
            <X size={14} />
          </button>
        </form>
      )}
    </div>
  );
}