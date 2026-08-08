import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import api from "../../../api/axios";
import ProductCard from "../components/ProductCard";

const FALLBACK_PRODUCTS = [
  { id: 1, title: "Hand-thrown Ceramic Vase", basePrice: 2400, categoryName: "Home & Living" },
  { id: 2, title: "Merino Wool Wrap Coat", basePrice: 8900, categoryName: "Fashion" },
  { id: 3, title: "Cold-pressed Argan Serum", basePrice: 1650, categoryName: "Beauty" },
  { id: 4, title: "Brass Table Lamp, Hand-cast", basePrice: 5200, categoryName: "Home & Living" },
  { id: 5, title: "Silk Scarf — Block Printed", basePrice: 3100, categoryName: "Fashion" },
  { id: 6, title: "Sandalwood Candle Trio", basePrice: 1890, categoryName: "Home & Living" },
  { id: 7, title: "Leather Tote, Full Grain", basePrice: 6700, categoryName: "Fashion" },
  { id: 8, title: "Rose Clay Face Mask", basePrice: 990, categoryName: "Beauty" },
  { id: 9, title: "Woven Jute Rug", basePrice: 4200, categoryName: "Home & Living" },
  { id: 10, title: "Linen Shirt, Sun-bleached", basePrice: 3400, categoryName: "Fashion" },
  { id: 11, title: "Vitamin C Face Oil", basePrice: 2100, categoryName: "Beauty" },
  { id: 12, title: "Hand-carved Wooden Bowl", basePrice: 1750, categoryName: "Home & Living" },
];

const FALLBACK_CATEGORIES = ["Fashion", "Home & Living", "Beauty"];

export default function ProductListing() {
  const [allProducts, setAllProducts] = useState(FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const keyword = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "";
  const minPrice = searchParams.get("min") || "";
  const maxPrice = searchParams.get("max") || "";
  const sort = searchParams.get("sort") || "relevance";

  useEffect(() => {
    api.get("/category").then((res) => {
      const names = (res.data || []).map((c) => c.name).filter(Boolean);
      if (names.length > 0) setCategories(names);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const endpoint = keyword ? "/products/search" : "/products";
    const params = keyword ? { keyword, page: 0, size: 48 } : { page: 0, size: 48 };

    api.get(endpoint, { params })
      .then((res) => {
        const content = res.data?.content;
        if (content && content.length > 0) setAllProducts(content);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [keyword]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setSearchParams(next);
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (keyword) next.set("q", keyword);
    setSearchParams(next);
  };

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (selectedCategory) list = list.filter((p) => p.categoryName === selectedCategory);
    if (minPrice) list = list.filter((p) => p.basePrice >= Number(minPrice));
    if (maxPrice) list = list.filter((p) => p.basePrice <= Number(maxPrice));

    if (sort === "price_asc") list.sort((a, b) => a.basePrice - b.basePrice);
    else if (sort === "price_desc") list.sort((a, b) => b.basePrice - a.basePrice);
    else if (sort === "name_asc") list.sort((a, b) => a.title.localeCompare(b.title));

    return list;
  }, [allProducts, selectedCategory, minPrice, maxPrice, sort]);

  const activeFilterCount = [selectedCategory, minPrice, maxPrice].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-6 py-5 md:py-8">
      <div className="bg-white rounded-lg border border-bazaar-border p-4 mb-5 flex items-center justify-between">
        <div>
          <h1 className="font-bazaar font-bold text-lg md:text-xl text-bazaar-ink">
            {keyword ? `Results for "${keyword}"` : selectedCategory || "All Products"}
          </h1>
          <p className="text-xs text-bazaar-sub mt-0.5">{loading ? "Loading…" : `${filtered.length} products found`}</p>
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="lg:hidden flex items-center gap-1.5 text-xs font-semibold text-bazaar-primary border border-bazaar-primary/30 px-3 py-2 rounded-md shrink-0"
        >
          <SlidersHorizontal size={13} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      <div className="flex gap-4 lg:gap-6">
        {/* Filter rail */}
        <aside className={`${filtersOpen ? "block" : "hidden"} lg:block w-full lg:w-56 shrink-0 mb-5 lg:mb-0`}>
          <div className="bg-white rounded-lg border border-bazaar-border p-4 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-bazaar-ink">Filters</span>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-[11px] text-bazaar-accent font-semibold hover:underline">
                  <X size={12} /> Clear
                </button>
              )}
            </div>

            <div className="border-b border-bazaar-border py-3">
              <p className="text-xs font-bold text-bazaar-ink mb-2.5 uppercase tracking-wide">Category</p>
              <div className="space-y-2">
                {categories.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-xs text-bazaar-sub cursor-pointer hover:text-bazaar-ink">
                    <input
                      type="radio" name="category" checked={selectedCategory === c}
                      onChange={() => updateParam("category", selectedCategory === c ? "" : c)}
                      className="accent-bazaar-primary"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            <div className="border-b border-bazaar-border py-3">
              <p className="text-xs font-bold text-bazaar-ink mb-2.5 uppercase tracking-wide">Price</p>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => updateParam("min", e.target.value)}
                  className="w-full border border-bazaar-border rounded px-2 py-1.5 text-xs outline-none focus:border-bazaar-primary" />
                <span className="text-bazaar-sub text-xs">—</span>
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => updateParam("max", e.target.value)}
                  className="w-full border border-bazaar-border rounded px-2 py-1.5 text-xs outline-none focus:border-bazaar-primary" />
              </div>
            </div>

            <div className="py-3">
              <p className="text-xs font-bold text-bazaar-ink mb-2.5 uppercase tracking-wide">Sort by</p>
              <select
                value={sort} onChange={(e) => updateParam("sort", e.target.value === "relevance" ? "" : e.target.value)}
                className="w-full border border-bazaar-border rounded px-2 py-2 text-xs outline-none focus:border-bazaar-primary bg-white"
              >
                <option value="relevance">Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A–Z</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 flex-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg border border-bazaar-border overflow-hidden">
                <div className="aspect-square bg-bazaar-bg" />
                <div className="p-2.5 space-y-2">
                  <div className="h-2.5 bg-bazaar-bg rounded w-full" />
                  <div className="h-2.5 bg-bazaar-bg rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex-1 text-center py-24 text-bazaar-sub bg-white rounded-lg border border-bazaar-border">
            <p className="mb-2">No products match these filters.</p>
            <button onClick={clearFilters} className="text-bazaar-primary underline text-sm font-semibold">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 flex-1">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
