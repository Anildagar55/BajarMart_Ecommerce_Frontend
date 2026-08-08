import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const SellerContext = createContext(null);

/**
 * JWT sirf userId carry karta hai, sellerId nahi (User aur Seller alag entities hain,
 * OneToOne linked). Har seller page ko apna real sellerId chahiye — ye Context ek hi
 * baar resolve karke sab child pages ko de deta hai.
 */
export function SellerProvider({ children }) {
  const { user } = useAuth();
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
          console.log("User =", user);

    if (!user?.userId) { setLoading(false); return; }
    api.get(`/seller/by-user/${user.userId}`)
      .then((res) =>{            console.log("Seller Response =", res.data);
 setSeller(res.data)})
      .catch((err) => {  console.log("Seller API Error:", err.response?.status);
                           console.log("Seller API Data:", err.response?.data);

          setSeller(null)
          })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <SellerContext.Provider value={{ seller, sellerId: seller?.id, loading }}>
      {children}
    </SellerContext.Provider>
  );
}

export function useSeller() {
  const ctx = useContext(SellerContext);
  if (!ctx) throw new Error("useSeller must be used inside SellerProvider");
  return ctx;
}