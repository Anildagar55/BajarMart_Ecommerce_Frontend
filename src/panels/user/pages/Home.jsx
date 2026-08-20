import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Shirt, Home as HomeIcon, Sparkles, Footprints, Gem, Watch, ShoppingBag, Gift, Truck, RotateCcw, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../../api/axios";
import ProductCard from "../components/ProductCard";
import PincodeControl from "../components/PincodeControl";

const FALLBACK_PRODUCTS = [
  { id: 1, title: "Hand-thrown Ceramic Vase", basePrice: 2400, categoryName: "Home & Living", imageUrl: "https://picsum.photos/seed/vase01/500/650" },
  { id: 2, title: "Merino Wool Wrap Coat", basePrice: 8900, categoryName: "Fashion", imageUrl: "https://picsum.photos/seed/coat02/500/650" },
  { id: 3, title: "Cold-pressed Argan Serum", basePrice: 1650, categoryName: "Beauty", imageUrl: "https://picsum.photos/seed/serum03/500/650" },
  { id: 4, title: "Brass Table Lamp, Hand-cast", basePrice: 5200, categoryName: "Home & Living", imageUrl: "https://picsum.photos/seed/lamp04/500/650" },
  { id: 5, title: "Silk Scarf — Block Printed", basePrice: 3100, categoryName: "Fashion", imageUrl: "https://picsum.photos/seed/scarf05/500/650" },
  { id: 6, title: "Sandalwood Candle Trio", basePrice: 1890, categoryName: "Home & Living", imageUrl: "https://picsum.photos/seed/candle06/500/650" },
  { id: 7, title: "Leather Tote, Full Grain", basePrice: 6700, categoryName: "Fashion", imageUrl: "https://picsum.photos/seed/tote07/500/650" },
  { id: 8, title: "Rose Clay Face Mask", basePrice: 990, categoryName: "Beauty", imageUrl: "https://picsum.photos/seed/mask08/500/650" },
  { id: 9, title: "Woven Jute Rug", basePrice: 4200, categoryName: "Home & Living", imageUrl: "https://picsum.photos/seed/rug09/500/650" },
  { id: 10, title: "Linen Shirt, Sun-bleached", basePrice: 3400, categoryName: "Fashion", imageUrl: "https://picsum.photos/seed/shirt10/500/650" },
  { id: 11, title: "Vitamin C Face Oil", basePrice: 2100, categoryName: "Beauty", imageUrl: "https://picsum.photos/seed/oil11/500/650" },
  { id: 12, title: "Hand-carved Wooden Bowl", basePrice: 1750, categoryName: "Home & Living", imageUrl: "https://picsum.photos/seed/bowl12/500/650" },
];

const BANNERS = [
  { title: "BIG SUMMER SALE", sub: "Up to 70% off across fashion & home", cta: "Shop Now", from: "from-bazaar-primary", to: "to-bazaar-primary2" },
  { title: "NEW ARRIVALS WEEK", sub: "Fresh drops from independent makers", cta: "Explore", from: "from-bazaar-accent", to: "to-[#C7401A]" },
  { title: "FLAT ₹200 OFF", sub: "On your first order — use code WELCOME200", cta: "Claim Offer", from: "from-[#1F1B4D]", to: "to-bazaar-primary" },
];

const CATEGORY_ICONS = [
  { label: "Fashion", icon: Shirt, bg: "bg-pink-100 text-pink-600" },
  { label: "Home & Living", icon: HomeIcon, bg: "bg-orange-100 text-orange-600" },
  { label: "Beauty", icon: Sparkles, bg: "bg-purple-100 text-purple-600" },
  { label: "Footwear", icon: Footprints, bg: "bg-blue-100 text-blue-600" },
  { label: "Jewellery", icon: Gem, bg: "bg-rose-100 text-rose-600" },
  { label: "Watches", icon: Watch, bg: "bg-amber-100 text-amber-700" },
  { label: "Bags", icon: ShoppingBag, bg: "bg-teal-100 text-teal-600" },
  { label: "Gifting", icon: Gift, bg: "bg-green-100 text-green-600" },
];

export default function Home() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    api.get("/products", { params: { page: 0, size: 12 } })
      .then((res) => {
        const content = res.data?.content;
        if (content && content.length > 0) setProducts(content);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % BANNERS.length), 4500);
    return () => clearInterval(t);
  }, []);

  const banner = BANNERS[slide];
  const trending = [...products].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-6 py-4">
      <PincodeControl variant="home" />

      {/* Hero banner carousel */}
      <div className={`relative rounded-lg overflow-hidden bg-gradient-to-r ${banner.from} ${banner.to} h-48 md:h-64 flex items-center px-6 md:px-14 mb-4`}>
        <div>
          <p className="text-white/70 text-xs md:text-sm uppercase tracking-wider mb-1">Limited time</p>
          <h1 className="font-bazaar font-extrabold text-2xl md:text-4xl text-white leading-tight">{banner.title}</h1>
          <p className="text-white/85 text-sm md:text-base mt-2">{banner.sub}</p>
          <Link to="/products" className="inline-block mt-4 bg-white text-bazaar-primary font-bold text-sm px-6 py-2.5 rounded-md hover:bg-bazaar-gold hover:text-white transition-colors">
            {banner.cta}
          </Link>
        </div>
        <button onClick={() => setSlide((s) => (s - 1 + BANNERS.length) % BANNERS.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-1.5">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => setSlide((s) => (s + 1) % BANNERS.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-1.5">
          <ChevronRight size={18} />
        </button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {BANNERS.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className={`w-1.5 h-1.5 rounded-full ${i === slide ? "bg-white" : "bg-white/40"}`} />
          ))}
        </div>
      </div>

      {/* Trust strip */}
      <div className="bg-white rounded-lg border border-bazaar-border flex flex-wrap justify-around gap-3 py-3 mb-6 text-xs text-bazaar-sub">
        <span className="flex items-center gap-1.5"><Truck size={14} className="text-bazaar-primary" /> Free delivery over ₹499</span>
        <span className="flex items-center gap-1.5"><RotateCcw size={14} className="text-bazaar-primary" /> 7-day easy returns</span>
        <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-bazaar-primary" /> 100% secure payments</span>
      </div>

      {/* Category icons */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 mb-8">
        {CATEGORY_ICONS.map(({ label, icon: Icon, bg }) => (
          <Link key={label} to={`/products?category=${encodeURIComponent(label)}`} className="flex flex-col items-center gap-1.5 group">
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center ${bg} group-hover:scale-105 transition-transform`}>
              <Icon size={20} />
            </div>
            <span className="text-[10px] md:text-xs text-bazaar-ink text-center leading-tight">{label}</span>
          </Link>
        ))}
      </div>

      {/* Secondary promo strip */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#1F1B4D] to-bazaar-primary rounded-lg p-6 flex items-center justify-between">
          <div>
            <p className="text-bazaar-gold text-xs uppercase tracking-wider mb-1">Members only</p>
            <h3 className="font-bazaar font-bold text-white text-xl">Extra 10% off</h3>
            <p className="text-white/60 text-xs mt-1">On orders above ₹2,000</p>
          </div>
          <Link to="/products" className="bg-bazaar-gold text-bazaar-ink text-xs font-bold px-4 py-2 rounded-md shrink-0">Shop</Link>
        </div>
        <div className="bg-gradient-to-br from-bazaar-accent to-[#C7401A] rounded-lg p-6 flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Trending</p>
            <h3 className="font-bazaar font-bold text-white text-xl">Home Decor Edit</h3>
            <p className="text-white/70 text-xs mt-1">Curated picks under ₹3,000</p>
          </div>
          <Link to="/products?category=Home%20%26%20Living" className="bg-white text-bazaar-accent text-xs font-bold px-4 py-2 rounded-md shrink-0">Shop</Link>
        </div>
      </div>

      {/* Deals grid */}
      <SectionHeader title="Today's Deals" subtitle="Prices drop, stock doesn't wait" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 mb-10">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      {/* Trending grid */}
      <SectionHeader title="Trending Now" subtitle="What everyone's adding to their bag" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 mb-10">
        {trending.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex items-baseline justify-between mb-3">
      <div>
        <h2 className="font-bazaar font-bold text-lg md:text-xl text-bazaar-ink">{title}</h2>
        <p className="text-xs text-bazaar-sub">{subtitle}</p>
      </div>
      <Link to="/products" className="text-xs font-semibold text-bazaar-primary hover:underline shrink-0">View all</Link>
    </div>
  );
}
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { Shirt, Home as HomeIcon, Sparkles, Footprints, Gem, Watch, ShoppingBag, Gift, Truck, RotateCcw, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
// import api from "../../../api/axios";
// import ProductCard from "../components/ProductCard";
//
// const FALLBACK_PRODUCTS = [
//   { id: 1, title: "Hand-thrown Ceramic Vase", basePrice: 2400, categoryName: "Home & Living", imageUrl: "https://picsum.photos/seed/vase01/500/650" },
//   { id: 2, title: "Merino Wool Wrap Coat", basePrice: 8900, categoryName: "Fashion", imageUrl: "https://picsum.photos/seed/coat02/500/650" },
//   { id: 3, title: "Cold-pressed Argan Serum", basePrice: 1650, categoryName: "Beauty", imageUrl: "https://picsum.photos/seed/serum03/500/650" },
//   { id: 4, title: "Brass Table Lamp, Hand-cast", basePrice: 5200, categoryName: "Home & Living", imageUrl: "https://picsum.photos/seed/lamp04/500/650" },
//   { id: 5, title: "Silk Scarf — Block Printed", basePrice: 3100, categoryName: "Fashion", imageUrl: "https://picsum.photos/seed/scarf05/500/650" },
//   { id: 6, title: "Sandalwood Candle Trio", basePrice: 1890, categoryName: "Home & Living", imageUrl: "https://picsum.photos/seed/candle06/500/650" },
//   { id: 7, title: "Leather Tote, Full Grain", basePrice: 6700, categoryName: "Fashion", imageUrl: "https://picsum.photos/seed/tote07/500/650" },
//   { id: 8, title: "Rose Clay Face Mask", basePrice: 990, categoryName: "Beauty", imageUrl: "https://picsum.photos/seed/mask08/500/650" },
//   { id: 9, title: "Woven Jute Rug", basePrice: 4200, categoryName: "Home & Living", imageUrl: "https://picsum.photos/seed/rug09/500/650" },
//   { id: 10, title: "Linen Shirt, Sun-bleached", basePrice: 3400, categoryName: "Fashion", imageUrl: "https://picsum.photos/seed/shirt10/500/650" },
//   { id: 11, title: "Vitamin C Face Oil", basePrice: 2100, categoryName: "Beauty", imageUrl: "https://picsum.photos/seed/oil11/500/650" },
//   { id: 12, title: "Hand-carved Wooden Bowl", basePrice: 1750, categoryName: "Home & Living", imageUrl: "https://picsum.photos/seed/bowl12/500/650" },
// ];
//
// const BANNERS = [
//   { title: "BIG SUMMER SALE", sub: "Up to 70% off across fashion & home", cta: "Shop Now", from: "from-bazaar-primary", to: "to-bazaar-primary2" },
//   { title: "NEW ARRIVALS WEEK", sub: "Fresh drops from independent makers", cta: "Explore", from: "from-bazaar-accent", to: "to-[#C7401A]" },
//   { title: "FLAT ₹200 OFF", sub: "On your first order — use code WELCOME200", cta: "Claim Offer", from: "from-[#1F1B4D]", to: "to-bazaar-primary" },
// ];
//
// const CATEGORY_ICONS = [
//   { label: "Fashion", icon: Shirt, bg: "bg-pink-100 text-pink-600" },
//   { label: "Home & Living", icon: HomeIcon, bg: "bg-orange-100 text-orange-600" },
//   { label: "Beauty", icon: Sparkles, bg: "bg-purple-100 text-purple-600" },
//   { label: "Footwear", icon: Footprints, bg: "bg-blue-100 text-blue-600" },
//   { label: "Jewellery", icon: Gem, bg: "bg-rose-100 text-rose-600" },
//   { label: "Watches", icon: Watch, bg: "bg-amber-100 text-amber-700" },
//   { label: "Bags", icon: ShoppingBag, bg: "bg-teal-100 text-teal-600" },
//   { label: "Gifting", icon: Gift, bg: "bg-green-100 text-green-600" },
// ];
//
// export default function Home() {
//   const [products, setProducts] = useState(FALLBACK_PRODUCTS);
//   const [slide, setSlide] = useState(0);
//
//   useEffect(() => {
//     api.get("/products", { params: { page: 0, size: 12 } })
//       .then((res) => {
//         const content = res.data?.content;
//         if (content && content.length > 0) setProducts(content);
//       })
//       .catch(() => {});
//   }, []);
//
//   useEffect(() => {
//     const t = setInterval(() => setSlide((s) => (s + 1) % BANNERS.length), 4500);
//     return () => clearInterval(t);
//   }, []);
//
//   const banner = BANNERS[slide];
//   const trending = [...products].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)).slice(0, 6);
//
//   return (
//     <div className="max-w-7xl mx-auto px-3 md:px-6 py-4">
//       {/* Hero banner carousel */}
//       <div className={`relative rounded-lg overflow-hidden bg-gradient-to-r ${banner.from} ${banner.to} h-48 md:h-64 flex items-center px-6 md:px-14 mb-4`}>
//         <div>
//           <p className="text-white/70 text-xs md:text-sm uppercase tracking-wider mb-1">Limited time</p>
//           <h1 className="font-bazaar font-extrabold text-2xl md:text-4xl text-white leading-tight">{banner.title}</h1>
//           <p className="text-white/85 text-sm md:text-base mt-2">{banner.sub}</p>
//           <Link to="/products" className="inline-block mt-4 bg-white text-bazaar-primary font-bold text-sm px-6 py-2.5 rounded-md hover:bg-bazaar-gold hover:text-white transition-colors">
//             {banner.cta}
//           </Link>
//         </div>
//         <button onClick={() => setSlide((s) => (s - 1 + BANNERS.length) % BANNERS.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-1.5">
//           <ChevronLeft size={18} />
//         </button>
//         <button onClick={() => setSlide((s) => (s + 1) % BANNERS.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-1.5">
//           <ChevronRight size={18} />
//         </button>
//         <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
//           {BANNERS.map((_, i) => (
//             <button key={i} onClick={() => setSlide(i)} className={`w-1.5 h-1.5 rounded-full ${i === slide ? "bg-white" : "bg-white/40"}`} />
//           ))}
//         </div>
//       </div>
//
//       {/* Trust strip */}
//       <div className="bg-white rounded-lg border border-bazaar-border flex flex-wrap justify-around gap-3 py-3 mb-6 text-xs text-bazaar-sub">
//         <span className="flex items-center gap-1.5"><Truck size={14} className="text-bazaar-primary" /> Free delivery over ₹499</span>
//         <span className="flex items-center gap-1.5"><RotateCcw size={14} className="text-bazaar-primary" /> 7-day easy returns</span>
//         <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-bazaar-primary" /> 100% secure payments</span>
//       </div>
//
//       {/* Category icons */}
//       <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 mb-8">
//         {CATEGORY_ICONS.map(({ label, icon: Icon, bg }) => (
//           <Link key={label} to={`/products?category=${encodeURIComponent(label)}`} className="flex flex-col items-center gap-1.5 group">
//             <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center ${bg} group-hover:scale-105 transition-transform`}>
//               <Icon size={20} />
//             </div>
//             <span className="text-[10px] md:text-xs text-bazaar-ink text-center leading-tight">{label}</span>
//           </Link>
//         ))}
//       </div>
//
//       {/* Secondary promo strip */}
//       <div className="grid md:grid-cols-2 gap-4 mb-8">
//         <div className="bg-gradient-to-br from-[#1F1B4D] to-bazaar-primary rounded-lg p-6 flex items-center justify-between">
//           <div>
//             <p className="text-bazaar-gold text-xs uppercase tracking-wider mb-1">Members only</p>
//             <h3 className="font-bazaar font-bold text-white text-xl">Extra 10% off</h3>
//             <p className="text-white/60 text-xs mt-1">On orders above ₹2,000</p>
//           </div>
//           <Link to="/products" className="bg-bazaar-gold text-bazaar-ink text-xs font-bold px-4 py-2 rounded-md shrink-0">Shop</Link>
//         </div>
//         <div className="bg-gradient-to-br from-bazaar-accent to-[#C7401A] rounded-lg p-6 flex items-center justify-between">
//           <div>
//             <p className="text-white/70 text-xs uppercase tracking-wider mb-1">Trending</p>
//             <h3 className="font-bazaar font-bold text-white text-xl">Home Decor Edit</h3>
//             <p className="text-white/70 text-xs mt-1">Curated picks under ₹3,000</p>
//           </div>
//           <Link to="/products?category=Home%20%26%20Living" className="bg-white text-bazaar-accent text-xs font-bold px-4 py-2 rounded-md shrink-0">Shop</Link>
//         </div>
//       </div>
//
//       {/* Deals grid */}
//       <SectionHeader title="Today's Deals" subtitle="Prices drop, stock doesn't wait" />
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 mb-10">
//         {products.map((p) => <ProductCard key={p.id} product={p} />)}
//       </div>
//
//       {/* Trending grid */}
//       <SectionHeader title="Trending Now" subtitle="What everyone's adding to their bag" />
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 mb-10">
//         {trending.map((p) => <ProductCard key={p.id} product={p} />)}
//       </div>
//     </div>
//   );
// }
//
// function SectionHeader({ title, subtitle }) {
//   return (
//     <div className="flex items-baseline justify-between mb-3">
//       <div>
//         <h2 className="font-bazaar font-bold text-lg md:text-xl text-bazaar-ink">{title}</h2>
//         <p className="text-xs text-bazaar-sub">{subtitle}</p>
//       </div>
//       <Link to="/products" className="text-xs font-semibold text-bazaar-primary hover:underline shrink-0">View all</Link>
//     </div>
//   );
// }
