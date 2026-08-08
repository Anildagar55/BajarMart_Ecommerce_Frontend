import { Outlet, Link, useNavigate } from "react-router-dom";
import { Truck, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ShipmentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-transit-fog font-barlow text-transit-navy">
      <header className="bg-transit-navy text-transit-fog">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/shipment/deliveries" className="flex items-center gap-2.5">
            <div className="bg-transit-orange p-1.5 rounded-sm">
              <Truck size={18} className="text-transit-navy" />
            </div>
            <span className="text-xl tracking-wide font-semibold uppercase">Transit Board</span>
          </Link>
          <div className="flex items-center gap-5 text-sm">
            <span className="text-transit-fog/60">{user?.name}</span>
            <button onClick={() => { logout(); navigate("/shipment/login"); }} className="flex items-center gap-1.5 hover:text-transit-orange">
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
        {/* Transit-style ticker stripe */}
        <div className="h-1.5 bg-gradient-to-r from-transit-teal via-transit-orange to-transit-teal" />
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
