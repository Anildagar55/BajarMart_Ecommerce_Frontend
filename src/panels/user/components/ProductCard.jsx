import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { productImage } from "../../../utils/placeholderImage";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function ProductCard({ product }) {
  const hasDiscount = product.discountPercent > 0 && product.mrp > product.basePrice;
  const hasRating = product.reviewCount > 0 && product.averageRating != null;

  return (
    <Link to={`/products/${product.id}`} className="group bg-bazaar-card border border-bazaar-border rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 block">
      <div className="relative aspect-square bg-bazaar-bg overflow-hidden">
        <img
          src={productImage(product)}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-bazaar-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {product.discountPercent}% OFF
          </span>
        )}
      </div>
      <div className="p-2.5">
        <h3 className="text-xs md:text-sm text-bazaar-ink leading-snug line-clamp-2 min-h-[2.4em]">{product.title}</h3>

        {hasRating ? (
          <div className="flex items-center gap-1 mt-1.5">
            <span className="flex items-center gap-0.5 bg-bazaar-success text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
              {product.averageRating.toFixed(1)} <Star size={9} fill="white" />
            </span>
            <span className="text-[10px] text-bazaar-sub">({product.reviewCount})</span>
          </div>
        ) : (
          <p className="text-[10px] text-bazaar-sub mt-1.5">No ratings yet</p>
        )}

        <div className="flex items-baseline gap-1.5 mt-1.5 flex-wrap">
          <span className="font-bazaar font-bold text-sm md:text-base text-bazaar-ink">{formatINR(product.basePrice)}</span>
          {hasDiscount && (
            <>
              <span className="text-[11px] text-bazaar-sub line-through">{formatINR(product.mrp)}</span>
              <span className="text-[11px] text-bazaar-success font-semibold">{product.discountPercent}% off</span>
            </>
          )}
        </div>
        <p className="text-[10px] text-bazaar-sub mt-1">Free Delivery</p>
      </div>
    </Link>
  );
}