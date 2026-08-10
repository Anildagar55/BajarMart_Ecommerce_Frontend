import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, Package, PlusCircle, LogOut, Store, ClipboardList } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SellerProvider, useSeller } from "../../context/SellerContext";

const navItems = [
  { to: "/seller/dashboard", label: "Overview", icon: LayoutGrid },
  { to: "/seller/orders", label: "Orders", icon: ClipboardList },
  { to: "/seller/products", label: "Products", icon: Package },
  { to: "/seller/products/new", label: "List an item", icon: PlusCircle },
];

function SellerLayoutInner() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { seller, loading } = useSeller();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ledger-paper font-sora text-ledger-slate flex">
      <aside className="w-64 bg-ledger-slate text-ledger-paper flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-white/10 flex items-center gap-2">
          <Store size={20} className="text-ledger-copper" />
          <span className="font-semibold tracking-tight">Merchant Ledger</span>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${
                  active ? "bg-ledger-copper text-white" : "text-ledger-paper/70 hover:bg-white/5 hover:text-ledger-paper"
                }`}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-6 py-5 border-t border-white/10 text-xs text-ledger-paper/50">
          <p className="mb-2">{user?.name}</p>
          <button onClick={() => { logout("SELLER"); navigate("/seller/login",{replace:true}); }} className="flex items-center gap-1.5 hover:text-ledger-copper">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-ledger-slate/10 px-8 py-4 flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-ledger-slate/40">Seller Console</span>
          {!loading && (
            seller ? (
              <span className={`font-mono text-xs px-2.5 py-1 rounded-sm ${
                seller.status === "APPROVED" ? "bg-ledger-sage/10 text-ledger-sage" : "bg-amber-100 text-amber-700"
              }`}>
                {seller.status === "APPROVED" ? "Account active" : `Account ${seller.status}`}
              </span>
            ) : (
              <span className="font-mono text-xs px-2.5 py-1 bg-red-100 text-red-600 rounded-sm">No seller profile found</span>
            )
          )}
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function SellerLayout() {
  return (
    <SellerProvider>
      <SellerLayoutInner />
    </SellerProvider>
  );
}