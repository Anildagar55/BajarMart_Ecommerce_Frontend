import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Store, ChevronDown } from "lucide-react";
import api from "../../../api/axios";

const FALLBACK_TREE = [
  { id: "f", name: "Fashion", children: [{ id: "f1", name: "Men" }, { id: "f2", name: "Women" }] },
  { id: "h", name: "Home & Living", children: [{ id: "h1", name: "Home Decor" }, { id: "h2", name: "Kitchen & Dining" }] },
  { id: "b", name: "Beauty", children: [{ id: "b1", name: "Skincare" }, { id: "b2", name: "Makeup" }] },
  { id: "e", name: "Electronics", children: [{ id: "e1", name: "Accessories" }] },
];

export default function CategoryMegaMenu() {
  const [tree, setTree] = useState(FALLBACK_TREE);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    api.get("/category").then((res) => {
      const all = res.data || [];
      if (all.length === 0) return;
      const parents = all.filter((c) => !c.parentId);
      const withChildren = parents.map((p) => ({
        ...p,
        children: all.filter((c) => c.parentId === p.id),
      }));
      if (withChildren.length > 0) setTree(withChildren);
    }).catch(() => {});
  }, []);

  return (
    <div className="hidden lg:block bg-bazaar-primary2/40 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 flex gap-7 text-xs font-medium text-white/90">
        {tree.map((cat) => (
          <div
            key={cat.id}
            className="relative"
            onMouseEnter={() => setOpenId(cat.id)}
            onMouseLeave={() => setOpenId(null)}
          >
            <Link
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="py-2.5 flex items-center gap-1 hover:text-bazaar-gold transition-colors"
            >
              {cat.name}
              {cat.children?.length > 0 && <ChevronDown size={11} />}
            </Link>

            {openId === cat.id && cat.children?.length > 0 && (
              <div className="absolute top-full left-0 bg-white text-bazaar-ink rounded-b-md shadow-xl py-2 w-52 z-50">
                {cat.children.map((child) => (
                  <Link
                    key={child.id}
                    to={`/products?category=${encodeURIComponent(child.name)}`}
                    className="block px-4 py-2 text-sm hover:bg-bazaar-bg hover:text-bazaar-primary transition-colors"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        <Link to="/products" className="py-2.5 hover:text-bazaar-gold transition-colors">Deals</Link>

        <Link to="/seller/login" className="py-2.5 ml-auto flex items-center gap-1.5 text-white/70 hover:text-bazaar-gold">
          <Store size={13} /> Become a Seller
        </Link>
      </div>
    </div>
  );
}