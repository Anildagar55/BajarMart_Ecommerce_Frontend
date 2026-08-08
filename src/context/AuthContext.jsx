import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("eco_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
//     const data = res.data; // { token, email, name, role, userId }
//     if(res.data.role != "USER"){
//             throw new Error("Please login from Seller Portal");
//         }
    localStorage.setItem("eco_token",res.data.token);
    localStorage.setItem("eco_user", JSON.stringify(res.data));
    setUser(res.data);
    return res.data;
  };

  const signup = async (payload) => {
    // Signup response me token nahi aata (backend design) — signup ke baad login alag se karo
    const res = await api.post("/users/signup", payload);
    return res.data;
  };

  /**
   * Seller banne ka poora flow ek hi call me:
   * 1) customer account banao
   * 2) us account se login karo (userId chahiye seller-link ke liye)
   * 3) /api/seller/signup call karo — ye backend me role ko SELLER kar deta hai
   * 4) DOBARA login karo — pehla token abhi bhi CUSTOMER role carry kar raha hai,
   *    naya token SELLER permissions ke saath aayega
   */
  const registerSeller = async ({ name, email, phone, password, business_name, gst_number, bank_details }) => {
    await signup({ name, email, phone, password });
    const loggedIn = await login(email, password);
    await api.post("/seller/signup", {
      userId: loggedIn.userId,
      business_name,
      gst_number,
      bank_details,
    });
    return login(email, password); // fresh token with SELLER role
  };

  /** Delivery partner ke liye bilkul wahi pattern, /api/delivery/signup ke saath */
  const registerDelivery = async ({ name, email, phone, password, vehicleType, vehicleNumber }) => {
    await signup({ name, email, phone, password });
    const loggedIn = await login(email, password);
    await api.post("/delivery/signup", {
      userId: loggedIn.userId,
      vehicleType,
      vehicleNumber,
    });
    return login(email, password); // fresh token with DELIVERY_PARTNER role
  };

  /**
   * Admin registration seedha /api/auth/register-admin pe jata hai — koi separate
   * customer account nahi banta. Invite code backend me validate hota hai
   * (application.properties → admin.invite-code). Galat code = 401.
   */
  const registerAdmin = async ({ name, email, phone, password, inviteCode }) => {
    await api.post("/auth/register-admin", { name, email, phone, password, inviteCode });
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("eco_token");
    localStorage.removeItem("eco_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, registerSeller, registerDelivery, registerAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
