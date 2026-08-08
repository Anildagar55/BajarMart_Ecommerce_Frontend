import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { productImage, withDiscount } from "../../../utils/placeholderImage";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function ProductCard({ product }) {
  const { original, pct } = withDiscount(product.basePrice, product.id ?? 1);
  const rating = (3.6 + ((product.id ?? 1) % 14) / 10).toFixed(1); // deterministic 3.6–5.0, not random-per-render

  return (
    <Link to={`/products/${product.id}`} className="group bg-bazaar-card border border-bazaar-border rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 block">
      <div className="relative aspect-square bg-bazaar-bg overflow-hidden">
        <img
          src={productImage(product)}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-2 left-2 bg-bazaar-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          {pct}% OFF
        </span>
      </div>
      <div className="p-2.5">
        <h3 className="text-xs md:text-sm text-bazaar-ink leading-snug line-clamp-2 min-h-[2.4em]">{product.title}</h3>

        <div className="flex items-center gap-1 mt-1.5">
          <span className="flex items-center gap-0.5 bg-bazaar-success text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
            {rating} <Star size={9} fill="white" />
          </span>
          <span className="text-[10px] text-bazaar-sub">({(20 + ((product.id ?? 1) * 37) % 480)})</span>
        </div>

        <div className="flex items-baseline gap-1.5 mt-1.5 flex-wrap">
          <span className="font-bazaar font-bold text-sm md:text-base text-bazaar-ink">{formatINR(product.basePrice)}</span>
          <span className="text-[11px] text-bazaar-sub line-through">{formatINR(original)}</span>
          <span className="text-[11px] text-bazaar-success font-semibold">{pct}% off</span>
        </div>
        <p className="text-[10px] text-bazaar-sub mt-1">Free Delivery</p>
      </div>
    </Link>
  );
}
