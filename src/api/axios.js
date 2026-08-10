
import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:8080/api",
});


// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use((config) => {

    const url = config.url || "";

    let token = null;


    // =================================================
    // AUTH APIs
    // Login / Signup / Register
    // In APIs ko koi old token nahi chahiye
    // =================================================

    if (
        url.startsWith("/auth/login") ||
        url.startsWith("/auth/register") ||
        url.startsWith("/users/signup")

    ) {
        return config;
    }


    // =================================================
    // ADMIN APIs
    // =================================================

    if (
        url.startsWith("/admin") ||
        url.startsWith("/dashboard/admin")||
            url.startsWith("/order/all")||
                url.startsWith("/users/all")
    ) {

        token = localStorage.getItem(
            "eco_admin_token"
        );
    }


    // =================================================
    // SELLER APIs
    // =================================================

    else if (
        url.startsWith("/seller") ||
        url.startsWith("/dashboard/seller") ||
        url.startsWith("/products") ||
            url.startsWith("/variant") ||
    url.startsWith("/order/advance")||
        url.startsWith("/order/sellers")
    ) {

        token = localStorage.getItem(
            "eco_seller_token"
        );
    }


    // =================================================
    // USER APIs
    // =================================================

    else {

        token = localStorage.getItem(
            "eco_user_token"
        );
    }


    // Attach JWT
    if (token) {

        config.headers = config.headers || {};

        config.headers.Authorization =
            `Bearer ${token}`;
    }


    return config;

});


// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response?.status === 401) {

            const url =
                error.config?.url || "";


            // =========================================
            // ADMIN
            // =========================================

            if (
                url.startsWith("/admin") ||
                url.startsWith("/dashboard/admin")||
                    url.startsWith("/order/all")||
                        url.startsWith("/users/all")
            ) {

                localStorage.removeItem(
                    "eco_admin_token"
                );

                localStorage.removeItem(
                    "eco_admin"
                );
            }


            // =========================================
            // SELLER
            // =========================================

            else if (
                url.startsWith("/seller") ||
                url.startsWith("/dashboard/seller") ||
                url.startsWith("/products") ||
                    url.startsWith("/variant") ||
    url.startsWith("/order/advance")||
                url.startsWith("/order/sellers")
            ) {

                localStorage.removeItem(
                    "eco_seller_token"
                );

                localStorage.removeItem(
                    "eco_seller"
                );
            }


            // =========================================
            // USER
            // =========================================

            else if (
                !url.startsWith("/auth/login") &&
                !url.startsWith("/users/signup")
            ) {

                localStorage.removeItem(
                    "eco_user_token"
                );

                localStorage.removeItem(
                    "eco_user"
                );
            }
        }


        return Promise.reject(error);
    }
);


export default api;

//import axios from "axios";
//
//const api = axios.create({
//  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
//});
//
//// Har request me JWT token automatically attach karo agar login hai
//api.interceptors.request.use((config) => {
//  const token = localStorage.getItem("eco_token");
//  if (token) {
//  localStorage.getItem("eco_token")
//    config.headers.Authorization = `Bearer ${token}`;
//  }
//  return config;
//});
//
//// 401 aane pe (token expire/invalid) auto-logout kar do
//api.interceptors.response.use(
//  (response) => response,
//  (error) => {
//    if (error.response && error.response.status === 401) {
//      localStorage.removeItem("eco_token");
//      localStorage.removeItem("eco_user");
//    }
//    return Promise.reject(error);
//  }
//);
//
//export default api;
