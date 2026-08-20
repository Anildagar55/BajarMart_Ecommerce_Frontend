// Backend se imageUrl na aaye to bhi page khali/broken na dikhe — ek themed placeholder generate karta hai.
// placehold.co ek free, no-key service hai jo on-the-fly image banata hai.
export function productImage(product, { bg = "F3F1F7", fg = "6A1B7C" } = {}) {
  if (product?.imageUrl) return product.imageUrl;
  const label = encodeURIComponent((product?.title || "Product").slice(0, 20));
  return `https://placehold.co/500x500/${bg}/${fg}?font=source-sans-pro&text=${label}`;
}