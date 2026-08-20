import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Truck, RotateCcw, ShieldCheck, Minus, Plus } from "lucide-react";
import api from "../../../api/axios";
import { productImage } from "../../../utils/placeholderImage";
import { useCart } from "../../../context/CartContext";
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function variantLabel(v) {
  return [v.size, v.color].filter(Boolean).join(" / ") || v.sku;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();

  const loadReviews = () => {
    api.get(`/reviews/product/${id}`).then((res) => setReviews(res.data || [])).catch(() => setReviews([]));
  };

  useEffect(() => {
    setSelectedVariant(null);
    setQty(1);

    api.get(`/products/${id}`).then((res) => setProduct(res.data)).catch(() => {
      setProduct({
        id, title: "Hand-thrown Ceramic Vase",
        description: "Thrown on the wheel in small batches by a third-generation potter.",
        basePrice: 2400, mrp: 2400, discountPercent: 0, categoryName: "Home & Living",
        sellerName: "Kāya Pottery Studio", sellerId: 1,
        imageUrl: "https://picsum.photos/seed/vase01/700/700",
      });
    });

    api.get(`/variant/${id}`).then((res) => {
      const list = res.data || [];
      setVariants(list);
      if (list.length === 1) setSelectedVariant(list[0]);
    }).catch(() => setVariants([]));

    loadReviews();
  }, [id]);

  useEffect(() => {
    if (!user) { setCanReview(false); return; }
    api.get("/reviews/can-review", { params: { userId: user.userId, productId: id } })
      .then((res) => setCanReview(res.data === true))
      .catch(() => setCanReview(false));
  }, [user, id]);

  const addToCart = () => {
    if (variants.length === 0) {
      showToast("This item isn't available for purchase yet.", "error");
      return;
    }
    if (!selectedVariant) {
      showToast("Please select an option first", "error");
      return;
    }
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      title: product.title,
      imageUrl: product.imageUrl,
      price: selectedVariant.price,
      size: selectedVariant.size,
      color: selectedVariant.color,
      sku: selectedVariant.sku,
      maxStock: selectedVariant.stockQuantity,
    }, qty);
    showToast(`Added ${qty} to your cart`);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0) {
      showToast("Please select a star rating", "error");
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post("/reviews", { userId: user.userId, productId: id, rating: reviewForm.rating, comment: reviewForm.comment });
      showToast("Thanks for your review!");
      setReviewForm({ rating: 0, comment: "" });
      setCanReview(false);
      loadReviews();
      api.get(`/products/${id}`).then((res) => setProduct(res.data)).catch(() => {}); // refresh avg rating
    } catch (err) {
      showToast(err.response?.data?.error || "Couldn't submit review.", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!product) return <div className="max-w-7xl mx-auto px-6 py-24 text-center text-bazaar-sub">Loading…</div>;

  const displayPrice = selectedVariant?.price ?? product.basePrice;
  const hasDiscount = product.discountPercent > 0 && product.mrp > displayPrice;
  const hasRating = product.reviewCount > 0 && product.averageRating != null;
  const outOfStock = selectedVariant && selectedVariant.stockQuantity === 0;
  const unavailable = variants.length === 0;

  return (
    <div className="max-w-6xl mx-auto px-3 md:px-6 py-5 md:py-8">
      <div className="bg-white rounded-lg border border-bazaar-border p-4 md:p-8 grid md:grid-cols-2 gap-6 md:gap-12">
        <div className="aspect-square bg-bazaar-bg overflow-hidden rounded-md md:sticky md:top-24 h-fit">
          <img src={productImage(product)} alt={product.title} className="w-full h-full object-cover" />
        </div>

        <div>
          <p className="text-xs font-semibold text-bazaar-primary uppercase tracking-wide mb-2">{product.categoryName}</p>
          <h1 className="font-bazaar font-bold text-xl md:text-2xl text-bazaar-ink leading-snug">{product.title}</h1>

          {hasRating ? (
            <div className="flex items-center gap-2 mt-2.5">
              <span className="flex items-center gap-0.5 bg-bazaar-success text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                {product.averageRating.toFixed(1)} <Star size={10} fill="white" />
              </span>
              <span className="text-xs text-bazaar-sub">{product.reviewCount} rating{product.reviewCount !== 1 ? "s" : ""}</span>
            </div>
          ) : (
            <p className="text-xs text-bazaar-sub mt-2.5">No ratings yet</p>
          )}

          <div className="flex items-baseline gap-2 mt-4 flex-wrap">
            <span className="font-bazaar font-extrabold text-2xl md:text-3xl text-bazaar-ink">{formatINR(displayPrice)}</span>
            {hasDiscount && (
              <>
                <span className="text-sm text-bazaar-sub line-through">{formatINR(product.mrp)}</span>
                <span className="text-sm text-bazaar-success font-bold">{product.discountPercent}% off</span>
              </>
            )}
          </div>
          <p className="text-xs text-bazaar-sub mt-1">Inclusive of all taxes</p>

          <p className="text-bazaar-sub text-sm leading-relaxed mt-5 max-w-md">{product.description}</p>

          {product.sellerName && (
            <p className="text-xs text-bazaar-sub mt-3">Sold by <span className="text-bazaar-primary font-medium">{product.sellerName}</span></p>
          )}

          {variants.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-bold text-bazaar-ink uppercase tracking-wide mb-2">Select option</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={v.stockQuantity === 0}
                    className={`px-4 py-2 text-sm rounded-md border-2 transition-colors ${
                      selectedVariant?.id === v.id
                        ? "border-bazaar-primary bg-bazaar-primary text-white"
                        : v.stockQuantity === 0
                        ? "border-bazaar-border text-bazaar-sub/50 line-through cursor-not-allowed"
                        : "border-bazaar-border text-bazaar-ink hover:border-bazaar-primary"
                    }`}
                  >
                    {variantLabel(v)}
                  </button>
                ))}
              </div>
              {outOfStock && <p className="text-xs text-bazaar-accent mt-2 font-medium">This option is out of stock.</p>}
            </div>
          )}

          <div className="mt-6">
            <p className="text-xs font-bold text-bazaar-ink uppercase tracking-wide mb-2">Quantity</p>
            <div className="flex items-center border-2 border-bazaar-border rounded-md w-fit">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2.5 hover:bg-bazaar-bg"><Minus size={14} /></button>
              <span className="px-4 text-sm font-bold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="p-2.5 hover:bg-bazaar-bg"><Plus size={14} /></button>
            </div>
          </div>

          <button
            onClick={addToCart}
            disabled={outOfStock || unavailable}
            className="mt-7 w-full md:w-auto px-10 py-3.5 bg-bazaar-accent text-white font-bold text-sm rounded-md hover:brightness-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {unavailable ? "Currently unavailable" : outOfStock ? "Out of stock" : "Add to Cart"}
          </button>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-bazaar-border text-xs text-bazaar-sub">
            <div className="flex flex-col items-center text-center gap-2">
              <Truck size={18} className="text-bazaar-primary" /> Free delivery
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RotateCcw size={18} className="text-bazaar-primary" /> 7-day returns
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck size={18} className="text-bazaar-primary" /> Verified seller
            </div>
          </div>

          {/* Review submission — sirf tab dikhta hai jab is product ka delivered order ho aur pehle review na kiya ho */}
          {canReview && (
            <div className="mt-8 pt-6 border-t border-bazaar-border">
              <h3 className="font-bazaar font-bold text-base text-bazaar-ink mb-3">Rate this product</h3>
              <form onSubmit={submitReview} className="bg-bazaar-bg rounded-md p-4">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button type="button" key={n} onClick={() => setReviewForm({ ...reviewForm, rating: n })}>
                      <Star size={22} className={n <= reviewForm.rating ? "text-bazaar-gold" : "text-bazaar-border"} fill={n <= reviewForm.rating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Share your experience with this product…"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows={3}
                  className="w-full border border-bazaar-border rounded-md px-3 py-2 text-sm outline-none focus:border-bazaar-primary bg-white"
                />
                <button type="submit" disabled={submittingReview} className="mt-3 bg-bazaar-primary text-white text-xs font-semibold px-5 py-2.5 rounded-md disabled:opacity-50">
                  {submittingReview ? "Submitting…" : "Submit Review"}
                </button>
              </form>
            </div>
          )}

          {reviews.length > 0 && (
            <div className="mt-8 pt-6 border-t border-bazaar-border">
              <h3 className="font-bazaar font-bold text-base text-bazaar-ink mb-3">Ratings &amp; Reviews</h3>
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="text-sm">
                    <p className="text-bazaar-ink font-medium flex items-center gap-1.5">
                      {r.userName}
                      <span className="flex items-center gap-0.5 bg-bazaar-success text-white text-[10px] font-semibold px-1 py-0.5 rounded">{r.rating} <Star size={8} fill="white" /></span>
                    </p>
                    {r.comment && <p className="text-bazaar-sub mt-0.5">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}