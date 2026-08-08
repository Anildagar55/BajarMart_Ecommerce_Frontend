# Eco Marketplace — Frontend (React + Tailwind)

4 alag panels, har ek ki apni visual identity — koi bhi ek dusre se copy-paste nahi lagta.

## Setup

```bash
npm install
cp .env.example .env   # VITE_API_BASE_URL backend URL se match karo
npm run dev
```
Runs on `http://localhost:5173`. Backend (Spring Boot) `http://localhost:8080` pe chalna chahiye.

## Panels aur unki design identity

| Panel | Route | Theme | Palette | Type |
|---|---|---|---|---|
| **User** (customer) | `/`, `/products`, `/cart`, `/login` | "The Atelier" — luxury boutique marketplace | Ivory, deep plum, merlot, antique gold | Fraunces (serif display) + Inter |
| **Seller** | `/seller/*` | "The Merchant Ledger" — structured dashboard | Slate ink, paper, copper, sage | Sora + IBM Plex Mono (data) |
| **Admin** | `/admin/*` | "Command Console" — dark command-center | Near-black, emerald, amber, crimson | Sora + mono |
| **Shipment** | `/shipment/*` | "Transit Board" — logistics/transit signage | Navy, teal, burnt orange | Barlow Condensed |

## Registration — ab har panel me self-service hai

**User** (`/login`): Normal signup, CUSTOMER role milta hai. Sab ka starting point yahi hai.

**Seller** (`/seller/login`): "Register your business" tab — ek hi form me account + business details (GST, bank). Submit karte hi backend user ko SELLER role de deta hai. **Status PENDING se shuru hota hai** — jab tak admin approve nahi karta, products live listing me nahi ja sakte (backend `ProductService` isko enforce karta hai).

**Shipment/Delivery** (`/shipment/login`): "Register" tab — account + vehicle details (type, number). Role DELIVERY_PARTNER ban jata hai, status PENDING se shuru — admin verification chahiye.

**Admin** (`/admin/login`): "Register" tab bhi hai, **lekin invite-code protected**. Backend `application.properties` me `admin.invite-code` set hai (default: `ECO-ADMIN-2026` — **production me isse turant badlo aur env variable bana do**). Bina sahi code ke admin account nahi ban sakta — ye jaanbujh kar public self-signup nahi hai, security ke liye.

**Important — role change ke baad token stale ho jata hai**: signup/register flow automatically dobara login karke fresh token le leta hai (yehi `AuthContext.registerSeller`/`registerDelivery`/`registerAdmin` andar karte hain), isliye manual re-login ki zaroorat nahi.

## Product Images

Backend `Product` entity me `imageUrl` field hai (simple URL string, koi file upload infra nahi hai abhi). Seller ke "List an item" form me ek Image URL field hai — khali chhodo to `src/utils/placeholderImage.js` automatically ek themed placeholder generate kar deta hai (placehold.co se, koi API key nahi chahiye), taaki koi bhi product kabhi broken/blank na dikhe.

Real image upload (S3/Cloudinary) abhi tak wire nahi hua — agla logical step hai.

## Kya real hai, kya demo/placeholder hai

**Ab fully functional hai:**
- **Filters** — category (live list from `/api/category`), price range, sort (price/name), sab URL query params me rehte hain (shareable/bookmarkable links)
- **Product variants** — size/color selection real hai (`/api/variant/{productId}` se), stock-aware (out-of-stock options disabled)
- **Cart** — proper quantity +/- controls, seller-wise grouping, live badge count in header (React Context, localStorage persisted)
- **Checkout** — real `/api/order/create` calls; agar cart me multiple sellers ke items hain to automatically alag-alag orders ban jate hain (Amazon/Flipkart jaisa hi behavior, kyunki backend ek order = ek seller design karta hai)
- **My Orders** page (`/orders`) — order history with live status
- Toast notifications (top-right) har cart/checkout action pe — koi `alert()` nahi

**Ek important backend fix isi round me**: pehle seller product banata tha to uska koi variant/stock nahi hota tha — matlab wo product kabhi order hi nahi ho sakta tha. Ab product create hote hi ek default variant + stock (seller "Starting stock" field se) auto-create ho jata hai, isliye naya listed product turant purchasable hai.

**Abhi bhi placeholder/demo hai:**
- Product images (`imageUrl` field hai, lekin upload UI nahi — URL paste karna padta hai; khali chhodo to auto themed placeholder banta hai)
- Payment gateway integration nahi hai — order "PLACED" status me ban jata hai, real payment capture wire nahi hua
- Agar backend down ho, pages **fallback sample data** dikhate hain taaki design hamesha demo-able rahe (production me ye hata dena)

## Next steps (priority order)

1. Real image upload (S3/Cloudinary) — abhi URL paste karna padta hai
2. Payment gateway integration (Razorpay/Stripe) — abhi order seedha PLACED status me ban jata hai
3. Seller's product list ko apne `sellerId` se filter karna (abhi sabka data dikhta hai)
4. Pagination controls on Product Listing (backend already supports `Pageable`, frontend abhi ek hi page fetch karke client-side filter karta hai)
5. Admin panel me PENDING sellers/delivery-partners ko approve/reject karne ka dedicated queue view (abhi Sellers.jsx me hai, Delivery partners ke liye similar page banani hai)
