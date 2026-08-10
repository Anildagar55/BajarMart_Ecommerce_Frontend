
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
    children,
    allowedRoles,
    redirectTo = "/login"
}) {
    const { user, seller, admin } = useAuth();

    let currentAccount = null;

    if (allowedRoles?.includes("SELLER")) {
        currentAccount = seller;
    }
    else if (allowedRoles?.includes("ADMIN")) {
        currentAccount = admin;
    }
    else if (allowedRoles?.includes("USER")) {
        currentAccount = user;
    }
    else {
        currentAccount = user || seller || admin;
    }

    console.log("ProtectedRoute:", {
        allowedRoles,
        user,
        seller,
        admin,
        currentAccount
    });

    if (!currentAccount) {
        return (
            <Navigate
                to={redirectTo}
                replace
            />
        );
    }

    if (
        allowedRoles?.length > 0 &&
        !allowedRoles.includes(currentAccount.role)
    ) {
        return (
            <Navigate
                to={redirectTo}
                replace
            />
        );
    }

    return children;
}
