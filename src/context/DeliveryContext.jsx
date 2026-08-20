import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const DeliveryContext = createContext(null);
const STORAGE_KEY = "eco_delivery_pincode";

export function DeliveryProvider({ children }) {
  const { user } = useAuth();
  const [pincode, setPincodeState] = useState(() => localStorage.getItem(STORAGE_KEY) || "");

  // Agar user ne kabhi manually pincode set nahi kiya, to login hote hi unke
  // default address se auto-fill kar do
  useEffect(() => {
    if (pincode || !user) return;
    api.get(`/address/userId/${user.userId}`)
      .then((res) => {
        const list = res.data || [];
        const def = list.find((a) => a.isDefault) || list[0];
        if (def?.pinCode) {
          setPincodeState(def.pinCode);
          localStorage.setItem(STORAGE_KEY, def.pinCode);
        }
      })
      .catch(() => {});
  }, [user]);

  const setPincode = (value) => {
    setPincodeState(value);
    if (value) localStorage.setItem(STORAGE_KEY, value);
    else localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <DeliveryContext.Provider value={{ pincode, setPincode }}>
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDelivery() {
  const ctx = useContext(DeliveryContext);
  if (!ctx) throw new Error("useDelivery must be used inside DeliveryProvider");
  return ctx;
}