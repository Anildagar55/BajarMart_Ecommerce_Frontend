
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const SellerContext = createContext(null);

export function SellerProvider({ children }) {

    // IMPORTANT:
    // Seller pages ke liye seller session use karo
    const { seller } = useAuth();

    const [sellerProfile, setSellerProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        console.log("Seller Auth =", seller);

        if (!seller?.userId) {
            setSellerProfile(null);
            setLoading(false);
            return;
        }

        setLoading(true);

        api.get(`/seller/by-user/${seller.userId}`)

            .then((res) => {

                console.log("Seller Response =", res.data);

                setSellerProfile(res.data);
            })

            .catch((err) => {

                console.log(
                    "Seller API Error:",
                    err.response?.status
                );

                console.log(
                    "Seller API Data:",
                    err.response?.data
                );

                setSellerProfile(null);
            })

            .finally(() => {
                setLoading(false);
            });

    }, [seller]);


    return (
        <SellerContext.Provider
            value={{
                seller: sellerProfile,
                sellerId: sellerProfile?.id,
                loading
            }}
        >
            {children}
        </SellerContext.Provider>
    );
}


export function useSeller() {

    const ctx = useContext(SellerContext);

    if (!ctx) {
        throw new Error(
            "useSeller must be used inside SellerProvider"
        );
    }

    return ctx;
}

