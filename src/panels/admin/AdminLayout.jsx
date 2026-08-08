import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Gauge, Store, Users, LogOut, Radar } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin/dashboard", label: "Overview", icon: Gauge },
  { to: "/admin/sellers", label: "Sellers", icon: Store },
  { to: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-console-void font-sora text-console-mist flex">
      <aside className="w-60 bg-console-panel border-r border-white/5 flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-white/5 flex items-center gap-2">
          <Radar size={20} className="text-console-emerald" />
          <span className="font-semibold text-white tracking-tight">Control Tower</span>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                  active ? "bg-console-emerald/10 text-console-emerald border-l-2 border-console-emerald" : "text-console-mist hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-6 py-5 border-t border-white/5 text-xs text-console-mist/60">
          <p className="mb-2 text-white/80">{user?.name}</p>
          <button onClick={() => { logout(); navigate("/admin/login"); }} className="flex items-center gap-1.5 hover:text-console-crimson">
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="bg-console-panel2 border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-console-mist/50">Platform Administration</span>
          <span className="flex items-center gap-1.5 text-xs font-mono text-console-emerald">
            <span className="w-1.5 h-1.5 bg-console-emerald rounded-full animate-pulse" /> All systems normal
          </span>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
