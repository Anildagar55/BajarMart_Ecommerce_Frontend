
import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    // =========================
    // USER
    // =========================

    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("eco_user");
        return stored ? JSON.parse(stored) : null;
    });


    // =========================
    // SELLER
    // =========================

    const [seller, setSeller] = useState(() => {
        const stored = localStorage.getItem("eco_seller");
        return stored ? JSON.parse(stored) : null;
    });


    // =========================
    // ADMIN
    // =========================

    const [admin, setAdmin] = useState(() => {
        const stored = localStorage.getItem("eco_admin");
        return stored ? JSON.parse(stored) : null;
    });


    // =========================
    // LOGIN
    // =========================

    const login = async (email, password, role) => {

        const res = await api.post("/auth/login", {
            email,
            password
        });
    console.log("LOGIN RESPONSE:", res.data);

   const backendRole = res.data.role
         ?.replace("ROLE_", "")
         .toUpperCase();

     // Backend CUSTOMER = Frontend USER
     let normalizedRole = backendRole;

     if (backendRole === "CUSTOMER") {
         normalizedRole = "USER";
     }

     const data = {
         ...res.data,
         role: normalizedRole
     };

     console.log("BACKEND ROLE:", backendRole);
     console.log("NORMALIZED ROLE:", normalizedRole);
     console.log("EXPECTED ROLE:", role);

     // Role check
     if (normalizedRole !== role) {
         throw new Error(
             `This account is not registered as ${role}.`
         );
     }

        // Backend role and requested portal role
        // must be same
        if (data.role !== role) {
            throw new Error(
                `This account is not registered as ${role}.`
            );
        }


        // =========================
        // USER LOGIN
        // =========================

        if (role === "USER") {

            localStorage.setItem(
                "eco_user_token",
                data.token
            );

            localStorage.setItem(
                "eco_user",
                JSON.stringify(data)
            );
            setUser(data);
        }


        // =========================
        // SELLER LOGIN
        // =========================

        else if (role === "SELLER") {

            localStorage.setItem(
                "eco_seller_token",
                data.token
            );

            localStorage.setItem(
                "eco_seller",
                JSON.stringify(data)
            );

            setSeller(data);
        }


        // =========================
        // ADMIN LOGIN
        // =========================

        else if (role === "ADMIN") {

            localStorage.setItem(
                "eco_admin_token",
                data.token
            );

            localStorage.setItem(
                "eco_admin",
                JSON.stringify(data)
            );

            setAdmin(data);
        }


        return data;
    };


    // =========================
    // USER SIGNUP
    // =========================

    const signup = async (payload) => {

        const res = await api.post(
            "/users/signup",
            payload
        );

        return res.data;
    };


    // =========================
    // SELLER REGISTER
    // =========================

    const registerSeller = async ({
        name,
        email,
        phone,
        password,
        business_name,
        gst_number,
        bank_details
    }) => {

        // 1. Create normal customer account
        await signup({
            name,
            email,
            phone,
            password
        });


        // 2. Login as USER temporarily
        const loggedIn = await login(
            email,
            password,
            "USER"
        );


        // 3. Convert USER account into SELLER
        await api.post("/seller/signup", {
            userId: loggedIn.userId,
            business_name,
            gst_number,
            bank_details
        });


        // 4. Login again
        // Backend now returns SELLER role
        return login(
            email,
            password,
            "SELLER"
        );
    };


    // =========================
    // DELIVERY REGISTER
    // =========================

    const registerDelivery = async ({
        name,
        email,
        phone,
        password,
        vehicleType,
        vehicleNumber
    }) => {

        // 1. Create normal account
        await signup({
            name,
            email,
            phone,
            password
        });


        // 2. Temporary USER login
        const loggedIn = await login(
            email,
            password,
            "USER"
        );


        // 3. Create delivery profile
        await api.post("/delivery/signup", {
            userId: loggedIn.userId,
            vehicleType,
            vehicleNumber
        });


        // 4. Login again with delivery role
        return login(
            email,
            password,
            "DELIVERY_PARTNER"
        );
    };


    // =========================
    // ADMIN REGISTER
    // =========================

    const registerAdmin = async ({
        name,
        email,
        phone,
        password,
        inviteCode
    }) => {

        await api.post(
            "/auth/register-admin",
            {
                name,
                email,
                phone,
                password,
                inviteCode
            }
        );


        // Fresh ADMIN login
        return login(
            email,
            password,
            "ADMIN"
        );
    };


    // =========================
    // LOGOUT
    // =========================

    const logout = (role) => {

        // USER logout
        if (role === "USER") {

            localStorage.removeItem(
                "eco_user_token"
            );

            localStorage.removeItem(
                "eco_user"
            );

            setUser(null);
        }


        // SELLER logout
        else if (role === "SELLER") {

            localStorage.removeItem(
                "eco_seller_token"
            );

            localStorage.removeItem(
                "eco_seller"
            );

            setSeller(null);
        }


        // ADMIN logout
        else if (role === "ADMIN") {

            localStorage.removeItem(
                "eco_admin_token"
            );

            localStorage.removeItem(
                "eco_admin"
            );

            setAdmin(null);
        }
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                seller,
                admin,

                login,
                signup,

                registerSeller,
                registerDelivery,
                registerAdmin,

                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {

    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return ctx;
}

