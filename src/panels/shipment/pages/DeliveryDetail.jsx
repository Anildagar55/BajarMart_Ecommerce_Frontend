import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import api from "../../../api/axios";

const STAGES = ["PENDING", "SHIPPED", "IN_TRANSIT", "DELIVERED"];

export default function DeliveryDetail() {
  const { id } = useParams();
  const [shipment, setShipment] = useState(null);
  const [updating, setUpdating] = useState(false);

  const load = () => {
    api.get(`/shipment/id/${id}`).then((res) => setShipment(res.data)).catch(() =>
      setShipment({ id, trackingId: "TRK-88421", courierPartner: "Self Fleet", status: "SHIPPED", orderId: 101 })
    );
  };

  useEffect(load, [id]);

  const advance = async () => {
    const currentIdx = STAGES.indexOf(shipment.status);
    const next = STAGES[Math.min(currentIdx + 1, STAGES.length - 1)];
    setUpdating(true);
    try {
      await api.put(`/shipment/update/${id}`, null, { params: { status: next } });
      setShipment({ ...shipment, status: next });
    } catch {
      alert("Couldn't update status — check you're signed in as a delivery partner.");
    } finally {
      setUpdating(false);
    }
  };

  if (!shipment) return <p className="text-transit-navy/40">Loading…</p>;

  const currentIdx = STAGES.indexOf(shipment.status);

  return (
    <div className="max-w-2xl">
      <Link to="/shipment/deliveries" className="flex items-center gap-1.5 text-sm text-transit-navy/50 hover:text-transit-teal mb-6">
        <ArrowLeft size={15} /> Back to manifest
      </Link>

      <div className="bg-white rounded-sm p-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-mono text-transit-navy">{shipment.trackingId}</h1>
          <span className="text-xs uppercase text-transit-navy/40">Order #{shipment.orderId}</span>
        </div>
        <p className="text-sm text-transit-navy/50 mb-8">Carrier: {shipment.courierPartner}</p>

        {/* Transit timeline */}
        <div className="space-y-0">
          {STAGES.map((stage, i) => (
            <div key={stage} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  i <= currentIdx ? "bg-transit-teal text-white" : "bg-transit-navy/10 text-transit-navy/30"
                }`}>
                  {i <= currentIdx ? <Check size={13} /> : i + 1}
                </div>
                {i < STAGES.length - 1 && (
                  <div className={`w-0.5 h-10 ${i < currentIdx ? "bg-transit-teal" : "bg-transit-navy/10"}`} />
                )}
              </div>
              <div className="pb-8">
                <p className={`text-sm ${i <= currentIdx ? "text-transit-navy" : "text-transit-navy/30"}`}>{stage.replace("_", " ")}</p>
              </div>
            </div>
          ))}
        </div>

        {shipment.status !== "DELIVERED" && (
          <button
            onClick={advance}
            disabled={updating}
            className="w-full py-3 bg-transit-teal text-white uppercase tracking-wide text-sm rounded-sm hover:bg-transit-tealsoft transition-colors disabled:opacity-50"
          >
            {updating ? "Updating…" : `Mark as ${STAGES[currentIdx + 1]?.replace("_", " ")}`}
          </button>
        )}
      </div>
    </div>
  );
}
