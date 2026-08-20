import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

// =====================================================
// CONFIG
// =====================================================

const INACTIVITY_TIME = 60 * 60 * 1000; // 1 hour


// =====================================================
// AUTH PROVIDER
// =====================================================

export function AuthProvider({ children }) {

    // =================================================
    // USER
    // =================================================

    const [user, setUser] = useState(() => {

        const stored = localStorage.getItem("eco_user");

        return stored
            ? JSON.parse(stored)
            : null;
    });


    // =================================================
    // SELLER
    // =================================================

    const [seller, setSeller] = useState(() => {

        const stored = localStorage.getItem("eco_seller");

        return stored
            ? JSON.parse(stored)
            : null;
    });


    // =================================================
    // ADMIN
    // =================================================

    const [admin, setAdmin] = useState(() => {

        const stored = localStorage.getItem("eco_admin");

        return stored
            ? JSON.parse(stored)
            : null;
    });


    // =================================================
    // CLEAR USER
    // =================================================

    const clearUser = () => {

        localStorage.removeItem("eco_user");
        localStorage.removeItem("eco_user_token");

        setUser(null);
    };


    // =================================================
    // CLEAR SELLER
    // =================================================

    const clearSeller = () => {

        localStorage.removeItem("eco_seller");
        localStorage.removeItem("eco_seller_token");
        localStorage.removeItem("eco_seller_last_activity");

        setSeller(null);
    };


    // =================================================
    // CLEAR ADMIN
    // =================================================

    const clearAdmin = () => {

        localStorage.removeItem("eco_admin");
        localStorage.removeItem("eco_admin_token");
        localStorage.removeItem("eco_admin_last_activity");

        setAdmin(null);
    };


    // =================================================
    // UPDATE SELLER ACTIVITY
    // =================================================

    const updateSellerActivity = () => {

        if (!localStorage.getItem("eco_seller_token")) {
            return;
        }

        localStorage.setItem(
            "eco_seller_last_activity",
            Date.now().toString()
        );
    };


    // =================================================
    // UPDATE ADMIN ACTIVITY
    // =================================================

    const updateAdminActivity = () => {

        if (!localStorage.getItem("eco_admin_token")) {
            return;
        }

        localStorage.setItem(
            "eco_admin_last_activity",
            Date.now().toString()
        );
    };


    // =================================================
    // CHECK SELLER INACTIVITY
    // =================================================

    const checkSellerInactivity = () => {

        const token = localStorage.getItem(
            "eco_seller_token"
        );

        if (!token) {
            return;
        }

        const lastActivity = localStorage.getItem(
            "eco_seller_last_activity"
        );

        if (!lastActivity) {
            return;
        }

        const inactiveTime =
            Date.now() - Number(lastActivity);


        if (inactiveTime >= INACTIVITY_TIME) {

            console.log(
                "SELLER logged out because of inactivity"
            );

            clearSeller();
        }
    };


    // =================================================
    // CHECK ADMIN INACTIVITY
    // =================================================

    const checkAdminInactivity = () => {

        const token = localStorage.getItem(
            "eco_admin_token"
        );

        if (!token) {
            return;
        }

        const lastActivity = localStorage.getItem(
            "eco_admin_last_activity"
        );

        if (!lastActivity) {
            return;
        }

        const inactiveTime =
            Date.now() - Number(lastActivity);


        if (inactiveTime >= INACTIVITY_TIME) {

            console.log(
                "ADMIN logged out because of inactivity"
            );

            clearAdmin();
        }
    };


    // =================================================
    // START INACTIVITY SYSTEM
    // =================================================

    useEffect(() => {

        // ---------------------------------------------
        // Check immediately when application starts
        // ---------------------------------------------

        checkAdminInactivity();
        checkSellerInactivity();


        // ---------------------------------------------
        // Activity handler
        // ---------------------------------------------

        let activityTimeout = null;

        const handleActivity = () => {

            // -----------------------------------------
            // ADMIN
            // -----------------------------------------

            if (localStorage.getItem("eco_admin_token")) {

                if (!activityTimeout) {

                    activityTimeout = setTimeout(() => {

                        updateAdminActivity();

                        activityTimeout = null;

                    }, 1000);
                }
            }


            // -----------------------------------------
            // SELLER
            // -----------------------------------------

            if (localStorage.getItem("eco_seller_token")) {

                if (!activityTimeout) {

                    activityTimeout = setTimeout(() => {

                        updateSellerActivity();

                        activityTimeout = null;

                    }, 1000);
                }
            }
        };


        // ---------------------------------------------
        // Browser activity events
        // ---------------------------------------------

        window.addEventListener(
            "click",
            handleActivity
        );

        window.addEventListener(
            "keydown",
            handleActivity
        );

        window.addEventListener(
            "mousemove",
            handleActivity
        );

        window.addEventListener(
            "scroll",
            handleActivity
        );

        window.addEventListener(
            "touchstart",
            handleActivity
        );


        // ---------------------------------------------
        // Check every 10 seconds
        // ---------------------------------------------

        const interval = setInterval(() => {

            checkAdminInactivity();
            checkSellerInactivity();

        }, 10000);


        // ---------------------------------------------
        // Cleanup
        // ---------------------------------------------

        return () => {

            window.removeEventListener(
                "click",
                handleActivity
            );

            window.removeEventListener(
                "keydown",
                handleActivity
            );

            window.removeEventListener(
                "mousemove",
                handleActivity
            );

            window.removeEventListener(
                "scroll",
                handleActivity
            );

            window.removeEventListener(
                "touchstart",
                handleActivity
            );

            clearInterval(interval);

            if (activityTimeout) {
                clearTimeout(activityTimeout);
            }
        };

    }, []);


    // =================================================
    // LOGIN
    // =================================================

    const login = async (
        email,
        password,
        role
    ) => {

        const res = await api.post(
            "/auth/login",
            {
                email,
                password
            }
        );


        console.log(
            "LOGIN RESPONSE:",
            res.data
        );


        // ---------------------------------------------
        // Backend role
        // ---------------------------------------------

        const backendRole =
            res.data.role
                ?.replace("ROLE_", "")
                .toUpperCase();


        // ---------------------------------------------
        // CUSTOMER -> USER
        // ---------------------------------------------

        let normalizedRole = backendRole;

        if (backendRole === "CUSTOMER") {

            normalizedRole = "USER";
        }


        const data = {
            ...res.data,
            role: normalizedRole
        };


        console.log(
            "BACKEND ROLE:",
            backendRole
        );

        console.log(
            "NORMALIZED ROLE:",
            normalizedRole
        );

        console.log(
            "EXPECTED ROLE:",
            role
        );


        // ---------------------------------------------
        // ROLE CHECK
        // ---------------------------------------------

        if (normalizedRole !== role) {

            throw new Error(
                `This account is not registered as ${role}.`
            );
        }


        // =================================================
        // CLEAR OTHER ROLE SESSIONS
//         // =================================================
//
//         if (role === "USER") {
//
//             clearSeller();
//             clearAdmin();
//         }
//
//         else if (role === "SELLER") {
//
//             clearUser();
//             clearAdmin();
//         }
//
//         else if (role === "ADMIN") {
//
//             clearUser();
//             clearSeller();
//         }


        // =================================================
        // USER LOGIN
        // =================================================

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


        // =================================================
        // SELLER LOGIN
        // =================================================

        else if (role === "SELLER") {

            localStorage.setItem(
                "eco_seller_token",
                data.token
            );

            localStorage.setItem(
                "eco_seller",
                JSON.stringify(data)
            );


            // Start inactivity timer
            localStorage.setItem(
                "eco_seller_last_activity",
                Date.now().toString()
            );


            setSeller(data);
        }


        // =================================================
        // ADMIN LOGIN
        // =================================================

        else if (role === "ADMIN") {

            localStorage.setItem(
                "eco_admin_token",
                data.token
            );

            localStorage.setItem(
                "eco_admin",
                JSON.stringify(data)
            );


            // Start inactivity timer
            localStorage.setItem(
                "eco_admin_last_activity",
                Date.now().toString()
            );


            setAdmin(data);
        }


        return data;
    };


    // =================================================
    // USER SIGNUP
    // =================================================

    const signup = async (payload) => {

        const res = await api.post(
            "/users/signup",
            payload
        );

        return res.data;
    };


    // =================================================
    // SELLER REGISTER
    // =================================================

    const registerSeller = async ({
        name,
        email,
        phone,
        password,
        business_name,
        gst_number,
        bank_details
    }) => {

        // ---------------------------------------------
        // 1. Create USER
        // ---------------------------------------------

        await signup({
            name,
            email,
            phone,
            password
        });


        // ---------------------------------------------
        // 2. Temporary USER login
        // ---------------------------------------------

        const loggedIn = await login(
            email,
            password,
            "USER"
        );


        // ---------------------------------------------
        // 3. Create seller profile
        // ---------------------------------------------

        await api.post(
            "/seller/signup",
            {
                userId: loggedIn.userId,
                business_name,
                gst_number,
                bank_details
            }
        );


        // ---------------------------------------------
        // 4. Login as SELLER
        // ---------------------------------------------

        return login(
            email,
            password,
            "SELLER"
        );
    };


    // =================================================
    // DELIVERY REGISTER
    // =================================================

    const registerDelivery = async ({
        name,
        email,
        phone,
        password,
        vehicleType,
        vehicleNumber
    }) => {

        // ---------------------------------------------
        // 1. Create account
        // ---------------------------------------------

        await signup({
            name,
            email,
            phone,
            password
        });


        // ---------------------------------------------
        // 2. Temporary USER login
        // ---------------------------------------------

        const loggedIn = await login(
            email,
            password,
            "USER"
        );


        // ---------------------------------------------
        // 3. Create delivery profile
        // ---------------------------------------------

        await api.post(
            "/delivery/signup",
            {
                userId: loggedIn.userId,
                vehicleType,
                vehicleNumber
            }
        );


        // ---------------------------------------------
        // 4. Login as delivery partner
        // ---------------------------------------------

        return login(
            email,
            password,
            "DELIVERY_PARTNER"
        );
    };


    // =================================================
    // ADMIN REGISTER
    // =================================================

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


    // =================================================
    // LOGOUT
    // =================================================

    const logout = (role) => {

        // ---------------------------------------------
        // USER
        // ---------------------------------------------

        if (role === "USER") {

            clearUser();
        }


        // ---------------------------------------------
        // SELLER
        // ---------------------------------------------

        else if (role === "SELLER") {

            clearSeller();
        }


        // ---------------------------------------------
        // ADMIN
        // ---------------------------------------------

        else if (role === "ADMIN") {

            clearAdmin();
        }
    };


    // =================================================
    // CONTEXT
    // =================================================

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


// =====================================================
// USE AUTH
// =====================================================

export function useAuth() {

    const ctx = useContext(AuthContext);

    if (!ctx) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return ctx;
}