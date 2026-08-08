import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, MapPin, Clock } from "lucide-react";
import api from "../../../api/axios";

const FALLBACK = [
  { id: 1, trackingId: "TRK-88421", courierPartner: "Self Fleet", status: "PENDING", orderId: 101 },
  { id: 2, trackingId: "TRK-88422", courierPartner: "Self Fleet", status: "SHIPPED", orderId: 102 },
  { id: 3, trackingId: "TRK-88423", courierPartner: "Self Fleet", status: "IN_TRANSIT", orderId: 103 },
  { id: 4, trackingId: "TRK-88424", courierPartner: "Self Fleet", status: "DELIVERED", orderId: 104 },
];

const STATUS_STYLES = {
  PENDING: "bg-transit-navy/10 text-transit-navy",
  SHIPPED: "bg-transit-orange/15 text-transit-orange",
  IN_TRANSIT: "bg-transit-teal/15 text-transit-teal",
  DELIVERED: "bg-green-600/15 text-green-700",
};

export default function Deliveries() {
  const [shipments, setShipments] = useState(FALLBACK);

  useEffect(() => {
    api.get("/shipment/all").then((res) => setShipments(res.data)).catch(() => {});
  }, []);

  const grouped = ["PENDING", "SHIPPED", "IN_TRANSIT", "DELIVERED"].map((status) => ({
    status,
    items: shipments.filter((s) => s.status === status),
  }));

  return (
    <div>
      <h1 className="text-2xl uppercase tracking-wide text-transit-navy mb-1">Today's manifest</h1>
      <p className="text-transit-navy/50 mb-8">{shipments.length} shipments assigned to your route</p>

      <div className="grid md:grid-cols-4 gap-4">
        {grouped.map(({ status, items }) => (
          <div key={status} className="bg-white rounded-sm border-t-4 border-transit-teal">
            <div className="px-4 py-3 border-b border-transit-navy/10 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-transit-navy">{status.replace("_", " ")}</span>
              <span className="text-xs font-mono text-transit-navy/40">{items.length}</span>
            </div>
            <div className="divide-y divide-transit-navy/5">
              {items.length === 0 && <p className="text-xs text-transit-navy/30 px-4 py-6 text-center">Nothing here</p>}
              {items.map((s) => (
                <Link to={`/shipment/deliveries/${s.id}`} key={s.id} className="block px-4 py-3 hover:bg-transit-fog transition-colors">
                  <div className="flex items-center gap-2 text-sm text-transit-navy">
                    <Package size={14} className="text-transit-teal" />
                    <span className="font-mono">{s.trackingId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-transit-navy/50 mt-1.5">
                    <MapPin size={12} /> Order #{s.orderId}
                  </div>
                  <span className={`inline-block mt-2 text-[10px] uppercase px-2 py-0.5 rounded-sm ${STATUS_STYLES[s.status]}`}>
                    {s.courierPartner}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
