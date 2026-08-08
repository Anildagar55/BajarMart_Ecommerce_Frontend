// Backend se imageUrl na aaye to bhi page khali/broken na dikhe — ek themed placeholder generate karta hai.
// placehold.co ek free, no-key service hai jo on-the-fly image banata hai.
export function productImage(product, { bg = "F3F1F7", fg = "6A1B7C" } = {}) {
  if (product?.imageUrl) return product.imageUrl;
  const label = encodeURIComponent((product?.title || "Product").slice(0, 20));
  return `https://placehold.co/500x500/${bg}/${fg}?font=source-sans-pro&text=${label}`;
}

// Fake-but-consistent "original price" so cards can show a strikethrough + discount %,
// same visual language as Meesho/Amazon/Flipkart. Derived from the product id so it's
// stable across re-renders instead of randomizing every time.
export function withDiscount(price, seed = 1) {
  const pct = 20 + (Number(seed) % 5) * 10; // 20–60% band, deterministic per product
  const original = Math.round(price / (1 - pct / 100) / 10) * 10;
  return { original, pct };
}
