import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ShoppingBag, Search, User, Store, Menu, X, Package, MapPin } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const CATEGORIES = ["Fashion", "Home & Living", "Beauty", "New Arrivals", "Deals"];

export default function UserLayout() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(searchTerm.trim() ? `/products?q=${encodeURIComponent(searchTerm.trim())}` : "/products");
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-bazaar-bg font-bazaar text-bazaar-ink">
      {/* Main header */}
      <header className="bg-bazaar-primary sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-2.5 flex items-center gap-2 md:gap-5">
          <button className="lg:hidden text-white shrink-0" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="font-bazaar font-extrabold text-lg md:text-2xl text-white shrink-0 tracking-tight">
            Bazaar<span className="text-bazaar-gold">Mart</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 text-white/80 text-xs shrink-0 pr-2 border-r border-white/20">
            <MapPin size={14} />
            <div className="leading-tight">
              <p className="text-[10px] text-white/60">Deliver to</p>
              <p className="font-medium">India</p>
            </div>
          </div>

          <form onSubmit={submitSearch} className="flex-1 flex items-center bg-white rounded-md overflow-hidden">
            <Search size={17} className="text-bazaar-sub ml-3 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products, brands and more"
              className="w-full px-2.5 py-2 text-sm outline-none placeholder:text-bazaar-sub/70"
            />
            <button type="submit" className="hidden sm:block bg-bazaar-accent text-white text-xs font-bold px-4 py-2.5 shrink-0">
              Search
            </button>
          </form>

          <nav className="flex items-center gap-3 md:gap-5 text-sm shrink-0 text-white">
            {user ? (
              <>
                <Link to="/orders" className="hidden sm:flex flex-col items-center leading-tight hover:text-bazaar-gold">
                  <Package size={18} />
                  <span className="text-[10px] mt-0.5">Orders</span>
                </Link>
                <button onClick={() => { logout(); navigate("/"); }} className="hidden sm:flex flex-col items-center leading-tight hover:text-bazaar-gold">
                  <User size={18} />
                  <span className="text-[10px] mt-0.5">Sign out</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="flex flex-col items-center leading-tight hover:text-bazaar-gold">
                <User size={18} />
                <span className="text-[10px] mt-0.5 hidden sm:block">Login</span>
              </Link>
            )}
            <Link to="/cart" className="relative flex flex-col items-center leading-tight hover:text-bazaar-gold">
              <ShoppingBag size={18} />
              <span className="text-[10px] mt-0.5 hidden sm:block">Cart</span>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-bazaar-accent text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
          </nav>
        </div>

        {/* Category row */}
        <div className="hidden lg:block bg-bazaar-primary2/40 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 flex gap-7 text-xs font-medium text-white/90">
            {CATEGORIES.map((c) => (
              <Link key={c} to={c === "Deals" || c === "New Arrivals" ? "/products" : `/products?category=${encodeURIComponent(c)}`} className="py-2.5 hover:text-bazaar-gold transition-colors">
                {c}
              </Link>
            ))}
            <Link to="/seller/login" className="py-2.5 ml-auto flex items-center gap-1.5 text-white/70 hover:text-bazaar-gold">
              <Store size={13} /> Become a Seller
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white px-4 py-4 space-y-3 border-t border-bazaar-border">
            <form onSubmit={submitSearch} className="flex items-center bg-bazaar-bg rounded-md overflow-hidden mb-3">
              <Search size={15} className="text-bazaar-sub ml-3" />
              <input
                type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search…" className="w-full px-2.5 py-2 text-sm outline-none bg-transparent"
              />
            </form>
            {CATEGORIES.map((c) => (
              <Link key={c} to={c === "Deals" || c === "New Arrivals" ? "/products" : `/products?category=${encodeURIComponent(c)}`} onClick={() => setMenuOpen(false)} className="block text-sm text-bazaar-ink">
                {c}
              </Link>
            ))}
            <div className="pt-3 border-t border-bazaar-border space-y-3">
              {user ? (
                <>
                  <Link to="/orders" onClick={() => setMenuOpen(false)} className="block text-sm">My orders</Link>
                  <button onClick={() => { logout(); setMenuOpen(false); navigate("/"); }} className="block text-sm text-bazaar-accent">Sign out</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-sm">Sign in</Link>
              )}
              <Link to="/seller/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-1.5 text-sm text-bazaar-sub">
                <Store size={14} /> Become a Seller
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-bazaar-ink text-white/70 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="font-bazaar font-extrabold text-lg text-white mb-3">Bazaar<span className="text-bazaar-gold">Mart</span></div>
            <p className="text-white/40 leading-relaxed text-xs">Great deals, thousands of sellers, delivered to your door.</p>
          </div>
          <div>
            <div className="uppercase text-[11px] tracking-wider text-bazaar-gold mb-3 font-semibold">Customer Care</div>
            <ul className="space-y-2 text-white/50 text-xs">
              <li><Link to="/orders">Track an order</Link></li>
              <li>Returns &amp; refunds</li>
              <li>Shipping info</li>
            </ul>
          </div>
          <div>
            <div className="uppercase text-[11px] tracking-wider text-bazaar-gold mb-3 font-semibold">About</div>
            <ul className="space-y-2 text-white/50 text-xs">
              <li>Our story</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>
          <div>
            <div className="uppercase text-[11px] tracking-wider text-bazaar-gold mb-3 font-semibold">Partner With Us</div>
            <ul className="space-y-2 text-white/50 text-xs">
              <li><Link to="/seller/login">Seller sign in</Link></li>
              <li><Link to="/admin/login">Admin sign in</Link></li>
              <li><Link to="/shipment/login">Delivery partner sign in</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
